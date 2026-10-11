import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  ShieldCheck,
  BookOpen,
  Scale,
  Sparkles,
  RotateCcw,
  Download,
  AlertCircle,
  CheckCircle2,
  Lock,
  Cpu,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Message, Citation, EthicsAuditResult } from '../types';

interface ChatViewProps {
  messages: Message[];
  onSendMessage: (query: string) => Promise<void>;
  isLoading: boolean;
  onOpenCitationDrawer: (citations: Citation[]) => void;
  onOpenEthicsModal: (audit: EthicsAuditResult) => void;
  onClearChat: () => void;
  currentLanguage: string;
}

const STARTER_PROMPTS = [
  {
    title: 'UNESCO AI Ethics Core Principles',
    query: 'What are the 10 core principles and values of the UNESCO Recommendation on the Ethics of Artificial Intelligence (2021)?'
  },
  {
    title: 'UDHR Article 12 Privacy Safeguards',
    query: 'How does Article 12 of the Universal Declaration of Human Rights protect citizen privacy in automated public sector decision-making?'
  },
  {
    title: 'Sovereign RAG vs Hallucinations',
    query: 'Explain why the ITU & UNICC sovereign RAG framework mandates strict abstention when an answer is not present in authoritative public records.'
  },
  {
    title: 'Test Sovereign Abstention Guardrail',
    query: 'Which celebrity won the Eurovision Song Contest in 1982 and what did they eat for dinner?'
  }
];

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onOpenCitationDrawer,
  onOpenEthicsModal,
  onClearChat,
  currentLanguage
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;
    const query = inputQuery;
    setInputQuery('');
    await onSendMessage(query);
  };

  const handleStarterClick = async (query: string) => {
    if (isLoading) return;
    await onSendMessage(query);
  };

  const exportConversation = () => {
    const text = messages.map(m => `[${m.role.toUpperCase()} - ${m.timestamp}]\n${m.content}\n\n`).join('---\n\n');
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GENIE_AI_Sovereign_Chat_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto px-4 py-4">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between py-2 border-b border-slate-800/80 mb-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px]">
            <Cpu className="w-3 h-3 text-sky-400" />
            BGE-Large-v1.5 + BGE-Reranker-v2-m3
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            PII Shield Active
          </span>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <>
              <button
                onClick={exportConversation}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition"
              >
                <Download className="w-3 h-3" />
                <span>Export Markdown</span>
              </button>
              <button
                onClick={onClearChat}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Chat</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center px-4 py-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-900/60 to-indigo-900/60 border border-sky-500/30 flex items-center justify-center mb-4 shadow-xl">
              <Scale className="w-8 h-8 text-sky-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2 font-['Plus_Jakarta_Sans']">
              GENIE.AI Sovereign Public Sector Intelligence
            </h2>
            <p className="text-xs text-slate-400 max-w-lg mb-6 leading-relaxed">
              An auditable, grounded AI system engineered under the ITU / UNICC open-source framework and upgraded by Ervin Remus Radosavlevici. Every response is verified against the Universal Declaration of Human Rights and UNESCO 2021 AI Ethics standards.
            </p>

            {/* Quick Starters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-2xl text-left">
              {STARTER_PROMPTS.map((starter, i) => (
                <button
                  key={i}
                  onClick={() => handleStarterClick(starter.query)}
                  className="p-3.5 bg-slate-900/70 hover:bg-slate-850 border border-slate-800 hover:border-sky-600/50 rounded-xl transition text-left group"
                >
                  <p className="text-xs font-semibold text-sky-300 group-hover:text-sky-200 mb-1 flex items-center justify-between">
                    <span>{starter.title}</span>
                    <Sparkles className="w-3.5 h-3.5 text-sky-400 opacity-60 group-hover:opacity-100" />
                  </p>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {starter.query}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isUser = message.role === 'user';

            return (
              <div
                key={message.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                {/* Role and metadata label */}
                <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">
                    {isUser ? 'Public Official / Citizen' : 'GENIE.AI Sovereign Assistant'}
                  </span>
                  <span>·</span>
                  <span className="font-mono text-[10px] text-slate-500">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[90%] sm:max-w-[82%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-md ${
                    isUser
                      ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white rounded-tr-xs'
                      : 'bg-[#0a1829] border border-slate-800 text-slate-200 rounded-tl-xs'
                  }`}
                >
                  {/* Grounding & Ethics Badges for Assistant */}
                  {!isUser && (
                    <div className="flex flex-wrap items-center gap-2 pb-3 mb-3 border-b border-slate-800/80">
                      {message.abstained ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-950/80 border border-amber-600/60 text-amber-300">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                          <span>SOVEREIGN ABSTENTION: UNGROUNDED QUERY</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/80 border border-emerald-600/60 text-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>GROUNDED IN AUTHORITATIVE REPOSITORY ({message.groundingConfidence}%)</span>
                        </span>
                      )}

                      {/* UNESCO Ethics Shield Button */}
                      {message.ethicsAudit && (
                        <button
                          onClick={() => onOpenEthicsModal(message.ethicsAudit!)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-950/80 hover:bg-sky-900 border border-sky-700/60 text-sky-300 transition"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                          <span>UNESCO Ethics Shield: {message.ethicsAudit.overallScore}%</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Main Message Text */}
                  <div className="whitespace-pre-wrap font-sans space-y-2 leading-relaxed">
                    {message.content}
                  </div>

                  {/* Assistant Footnotes: Citations & Telemetry */}
                  {!isUser && (
                    <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2.5">
                      {/* Citations Pills */}
                      {message.citations && message.citations.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-1.5 text-[11px]">
                            <span className="font-semibold text-sky-300 flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              Retrieved Sources ({message.citations.length}):
                            </span>
                            <button
                              onClick={() => onOpenCitationDrawer(message.citations)}
                              className="text-sky-400 hover:text-sky-300 underline font-medium text-[11px]"
                            >
                              View Excerpts Drawer
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {message.citations.map((c, idx) => (
                              <button
                                key={idx}
                                onClick={() => onOpenCitationDrawer(message.citations)}
                                className="flex items-center gap-1 px-2 py-0.5 bg-slate-900 hover:bg-slate-850 border border-slate-700/80 rounded text-[11px] text-slate-300 transition"
                              >
                                <span className="text-sky-400 font-bold">[{idx + 1}]</span>
                                <span className="truncate max-w-[200px]">{c.documentTitle}</span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {(c.rerankScore * 100).toFixed(0)}%
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Execution Telemetry Footer */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[10px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          Latency: {message.latencyMs || 380}ms
                        </span>
                        {message.tokensUsed && (
                          <span>
                            Tokens: {message.tokensUsed.total} ({message.tokensUsed.prompt} prompt / {message.tokensUsed.completion} comp)
                          </span>
                        )}
                        <span className="text-slate-500">
                          BGE Reranker v2 (8192-cap)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3 p-4 bg-[#0a1829] border border-slate-800 rounded-2xl w-fit text-xs text-sky-300 animate-pulse">
            <Cpu className="w-4 h-4 text-sky-400 animate-spin" />
            <span>Scanning sovereign vector repository & validating Human Rights Law ethics...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Query Input Box */}
      <form onSubmit={handleSubmit} className="mt-3 relative">
        <div className="relative flex items-center bg-[#071526] border border-slate-700 hover:border-slate-600 focus-within:border-sky-500 rounded-2xl p-2 shadow-lg transition">
          <textarea
            rows={2}
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={`Ask sovereign intelligence in ${currentLanguage.toUpperCase()} (e.g., UDHR principles, UNESCO AI ethics, public policy)...`}
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-xs sm:text-sm px-3 py-1 focus:outline-none resize-none leading-relaxed"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:hover:bg-sky-600 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Inquire</span>
          </button>
        </div>
        <p className="text-[10px] text-slate-400 text-center mt-1.5">
          GENIE.AI adheres to Sovereign Public Sector standards · Zero commercial telemetry · Protected under Copyright © Ervin Remus Radosavlevici
        </p>
      </form>
    </div>
  );
};
