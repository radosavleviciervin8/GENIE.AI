export interface DocumentChunk {
  id: string;
  documentId: string;
  documentTitle: string;
  chunkIndex: number;
  content: string;
  tokenCount: number;
  metadata: {
    section?: string;
    article?: string;
    category: 'Human Rights' | 'AI Ethics' | 'Public Sector' | 'Sovereignty' | 'Technical';
    sourceUrl?: string;
    authoritativeBody: string;
  };
}

export interface SovereignDocument {
  id: string;
  title: string;
  file_id: string;
  category: 'Human Rights' | 'AI Ethics' | 'Public Sector' | 'Sovereignty' | 'Technical';
  authoritativeBody: string;
  description: string;
  uploadedAt: string;
  fileSizeKb: number;
  chunkCount: number;
  status: 'indexed' | 'pending' | 'quarantined' | 'retracted';
  scanStatus: 'clamav_clean' | 'scanning' | 'flagged';
  clamavScanHash: string;
  humanRightsAlignment: number; // 0 - 100
  tags: string[];
  chunks: DocumentChunk[];
}

export interface EthicsPillarScore {
  pillar: string;
  unPillarId: 'human_agency' | 'transparency' | 'fairness' | 'privacy' | 'safety' | 'proportionality' | 'sustainability' | 'redress';
  score: number; // 0 - 100
  status: 'compliant' | 'warning' | 'non_compliant';
  justification: string;
  treatyReference: string; // e.g., "UDHR Art. 12 / UNESCO Rec. 2021 Para. 69"
}

export interface EthicsAuditResult {
  overallScore: number; // 0 - 100
  verdict: 'APPROVED_SOVEREIGN' | 'CONDITIONAL_REVIEW' | 'ABSTAINED_RIGHTS_VIOLATION';
  pillars: EthicsPillarScore[];
  piiDetected: boolean;
  piiRedactedCount: number;
  biasRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  rightsImplicated: string[];
  humanOversightLevel: 'FULLY_ASSISTED' | 'AUDIT_FLAGGED' | 'HUMAN_CONFIRMATION_REQUIRED';
  timestamp: string;
  auditorSignature: string;
}

export interface Citation {
  id: string;
  documentId: string;
  documentTitle: string;
  authoritativeBody: string;
  articleOrSection: string;
  snippet: string;
  relevanceScore: number; // 0 - 1.0
  rerankScore: number; // 0 - 1.0
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
  grounded: boolean;
  groundingConfidence: number; // 0 - 100
  abstained?: boolean;
  abstentionReason?: string;
  citations: Citation[];
  ethicsAudit?: EthicsAuditResult;
  latencyMs?: number;
  tokensUsed?: {
    prompt: number;
    completion: number;
    total: number;
  };
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  language: 'en' | 'fr' | 'es' | 'ar' | 'zh' | 'ru';
  messages: Message[];
}

export interface RAGTraceStep {
  step: 'gateway_ingress' | 'query_guardrail' | 'bge_embedding' | 'vector_retrieval' | 'bge_rerank' | 'llm_synthesis' | 'ethics_audit';
  name: string;
  latencyMs: number;
  status: 'ok' | 'degraded' | 'cached';
  details: string;
}

export interface RAGTrace {
  traceId: string;
  timestamp: string;
  totalLatencyMs: number;
  steps: RAGTraceStep[];
}
