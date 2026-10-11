/**
 * @license
 * Copyright © 2026 Ervin Remus Radosavlevici
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { ChatView } from './components/ChatView';
import { DocumentRepoView } from './components/DocumentRepoView';
import { EthicsAuditorView } from './components/EthicsAuditorView';
import { ObservabilityView } from './components/ObservabilityView';
import { GovernanceView } from './components/GovernanceView';
import { CitationDrawer } from './components/CitationDrawer';
import { EthicsShieldModal } from './components/EthicsShieldModal';
import { UploadDocModal } from './components/UploadDocModal';
import { HraiaReportModal } from './components/HraiaReportModal';

import { INITIAL_SOVEREIGN_DOCUMENTS } from './data/sovereignDocuments';
import { Message, SovereignDocument, Citation, EthicsAuditResult, RAGTrace } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [documents, setDocuments] = useState<SovereignDocument[]>(INITIAL_SOVEREIGN_DOCUMENTS);
  const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false);
  const [isProcessingBatch, setIsProcessingBatch] = useState<boolean>(false);

  // Modal and drawer states
  const [isCitationDrawerOpen, setIsCitationDrawerOpen] = useState(false);
  const [activeCitations, setActiveCitations] = useState<Citation[]>([]);

  const [isEthicsModalOpen, setIsEthicsModalOpen] = useState(false);
  const [activeAuditResult, setActiveAuditResult] = useState<EthicsAuditResult | null>(null);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isHraiaModalOpen, setIsHraiaModalOpen] = useState(false);

  // Observability & Telemetry
  const [lastTrace, setLastTrace] = useState<RAGTrace | null>(null);
  const [analytics, setAnalytics] = useState({
    totalQueries: 142,
    groundedQueries: 136,
    abstainedQueries: 6,
    avgLatencyMs: 420,
    ethicsIndexAvg: 98.4,
    piiRedactionsTotal: 18
  });

  // Conversation history with resilient local storage (fixes upstream bug #412: conversation null-clobber)
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('genie_sovereign_messages_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved conversation session, initializing fresh state:', e);
    }
    return [];
  });

  // Persist messages reliably
  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem('genie_sovereign_messages_v2', JSON.stringify(messages));
      }
    } catch (e) {
      console.error('Storage write error:', e);
    }
  }, [messages]);

  // Load documents & analytics from server on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, analyticsRes] = await Promise.all([
          fetch('/api/documents'),
          fetch('/api/analytics')
        ]);

        if (docsRes.ok) {
          const docsData = await docsRes.json();
          if (Array.isArray(docsData.documents) && docsData.documents.length > 0) {
            setDocuments(docsData.documents);
          }
        }

        if (analyticsRes.ok) {
          const analyticsData = await analyticsRes.json();
          setAnalytics(prev => ({ ...prev, ...analyticsData }));
        }
      } catch (err) {
        console.warn('Backend proxy initialization, using local sovereign cache:', err);
      }
    };

    fetchData();
  }, []);

  const handleSendMessage = async (queryText: string) => {
    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: queryText,
      timestamp: new Date().toISOString(),
      grounded: true,
      groundingConfidence: 100,
      citations: []
    };

    // Optimistic user message update
    setMessages(prev => [...prev, userMessage]);
    setIsLoadingChat(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          history: messages.slice(-4),
          language: currentLanguage,
          abstentionThreshold: 0.30
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: data.id || `ast-${Date.now()}`,
        role: 'assistant',
        content: data.content,
        timestamp: data.timestamp || new Date().toISOString(),
        grounded: data.grounded,
        groundingConfidence: data.groundingConfidence,
        abstained: data.abstained,
        abstentionReason: data.abstentionReason,
        citations: data.citations || [],
        ethicsAudit: data.ethicsAudit,
        latencyMs: data.latencyMs,
        tokensUsed: data.tokensUsed
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (data.trace) {
        setLastTrace(data.trace);
      }

      // Refresh analytics
      setAnalytics(prev => ({
        ...prev,
        totalQueries: prev.totalQueries + 1,
        groundedQueries: data.grounded ? prev.groundedQueries + 1 : prev.groundedQueries,
        abstainedQueries: data.abstained ? prev.abstainedQueries + 1 : prev.abstainedQueries,
        avgLatencyMs: data.latencyMs ? Math.round((prev.avgLatencyMs * 0.9) + (data.latencyMs * 0.1)) : prev.avgLatencyMs
      }));
    } catch (err: unknown) {
      console.error('Chat error:', err);
      // Fallback message with graceful error reporting
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `[Sovereign Error Recovery]

An error occurred during pipeline execution. The query will not be processed into an ungrounded hallucination. Please retry your inquiry or verify local repository documents.`,
        timestamp: new Date().toISOString(),
        grounded: false,
        groundingConfidence: 0,
        abstained: true,
        citations: []
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleClearChat = () => {
    localStorage.removeItem('genie_sovereign_messages_v2');
    setMessages([]);
  };

  const handleBatchAction = async (action: 'ingest' | 'retract' | 'reindex', fileIds: string[]) => {
    setIsProcessingBatch(true);
    try {
      const res = await fetch('/api/documents/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, file_ids: fileIds })
      });

      const data = await res.json();
      // Reload documents
      const docsRes = await fetch('/api/documents');
      if (docsRes.ok) {
        const docsData = await docsRes.json();
        setDocuments(docsData.documents);
      }
    } catch (err) {
      console.error('Batch action error:', err);
    } finally {
      setIsProcessingBatch(false);
    }
  };

  const handleDocumentAdded = (newDoc: SovereignDocument) => {
    setDocuments(prev => [newDoc, ...prev]);
  };

  const handleOpenCitationDrawer = (citations: Citation[]) => {
    setActiveCitations(citations);
    setIsCitationDrawerOpen(true);
  };

  const handleOpenEthicsModal = (audit: EthicsAuditResult) => {
    setActiveAuditResult(audit);
    setIsEthicsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#040e1b] text-slate-100 flex flex-col font-sans selection:bg-sky-600 selection:text-white">
      {/* Sovereign Header */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onOpenHraiaModal={() => setIsHraiaModalOpen(true)}
      />

      {/* Navigation Tabs */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        documentCount={documents.length}
        ethicsScore={analytics.ethicsIndexAvg}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 overflow-x-hidden">
        {activeTab === 'chat' && (
          <ChatView
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoadingChat}
            onOpenCitationDrawer={handleOpenCitationDrawer}
            onOpenEthicsModal={handleOpenEthicsModal}
            onClearChat={handleClearChat}
            currentLanguage={currentLanguage}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentRepoView
            documents={documents}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            onBatchAction={handleBatchAction}
            isProcessingBatch={isProcessingBatch}
          />
        )}

        {activeTab === 'ethics' && (
          <EthicsAuditorView
            onOpenHraiaModal={() => setIsHraiaModalOpen(true)}
          />
        )}

        {activeTab === 'observability' && (
          <ObservabilityView
            lastTrace={lastTrace}
            analytics={analytics}
          />
        )}

        {activeTab === 'governance' && (
          <GovernanceView />
        )}
      </main>

      {/* Slide-over Citation Drawer */}
      <CitationDrawer
        isOpen={isCitationDrawerOpen}
        onClose={() => setIsCitationDrawerOpen(false)}
        citations={activeCitations}
      />

      {/* Detailed Ethics Inspection Modal */}
      <EthicsShieldModal
        isOpen={isEthicsModalOpen}
        onClose={() => setIsEthicsModalOpen(false)}
        auditResult={activeAuditResult}
      />

      {/* Custom Document Upload Modal */}
      <UploadDocModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onDocumentAdded={handleDocumentAdded}
      />

      {/* Official HRAIA Impact Assessment Modal */}
      <HraiaReportModal
        isOpen={isHraiaModalOpen}
        onClose={() => setIsHraiaModalOpen(false)}
        overallScore={analytics.ethicsIndexAvg}
      />
    </div>
  );
}
