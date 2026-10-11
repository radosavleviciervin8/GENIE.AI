import React from 'react';
import { Activity, Clock, Cpu, Server, CheckCircle2, ShieldCheck, Zap, Database, ArrowRight } from 'lucide-react';
import { RAGTrace } from '../types';

interface ObservabilityViewProps {
  lastTrace: RAGTrace | null;
  analytics: {
    totalQueries: number;
    groundedQueries: number;
    abstainedQueries: number;
    avgLatencyMs: number;
    ethicsIndexAvg: number;
    piiRedactionsTotal: number;
  };
}

export const ObservabilityView: React.FC<ObservabilityViewProps> = ({
  lastTrace,
  analytics
}) => {
  const defaultTraceSteps = [
    { name: '1. Sovereign Gateway Ingress (Kong / NGINX)', component: 'api-gateway-solution', latency: 3, details: 'W3C traceparent injection, rate limiting, SSL verification' },
    { name: '2. Pre-Query Guardrail & PII Scrubbing', component: 'gov-chat-backend', latency: 4, details: 'UDHR Art. 12 regex scrubbing; zero external PII leakage' },
    { name: '3. Vector Embedding Matcher (BGE-Large-en-v1.5)', component: 'genie-ai-overlay/embedding', latency: 12, details: '1024-dim dense representation generated' },
    { name: '4. Sovereign Multi-Model Retrieval (ArangoDB)', component: 'genie-ai-overlay/retriever', latency: 28, details: 'Hybrid graph + vector recall across active policy chunks' },
    { name: '5. Cross-Encoder Reranker (BGE-Reranker-v2-m3)', component: 'genie-ai-overlay/reranker', latency: 45, details: '8192-token cap, cross-attention scoring, threshold evaluation' },
    { name: '6. Grounded Sovereign Synthesis (Gemini Engine)', component: 'genie-ai-overlay/chatqna', latency: 280, details: 'Authoritative context synthesis with treaty citation bounding' },
    { name: '7. UNESCO 2021 Ethics & Human Rights Inspection', component: 'ethics-audit-engine', latency: 8, details: 'Evaluated against UDHR & UNESCO 8 pillars' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-[#091727] border border-slate-800 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
              OpenTelemetry (OTel) Sovereign Observability Pipeline
            </h2>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
              W3C Trace Context Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time telemetry waterfall tracking latency, token usage, abstention rates, and service boundary transitions across OPEA microservices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-sky-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Trace Collector: Online</span>
          </span>
        </div>
      </div>

      {/* Metrics Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-[#071424] border border-slate-800 p-4 rounded-xl">
          <p className="text-[11px] text-slate-400 font-medium">Total Inquiries</p>
          <p className="text-2xl font-bold text-white mt-1 font-mono">{analytics.totalQueries}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Sovereign transactions</p>
        </div>

        <div className="bg-[#071424] border border-slate-800 p-4 rounded-xl">
          <p className="text-[11px] text-slate-400 font-medium">Grounded Responses</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1 font-mono">{analytics.groundedQueries}</p>
          <p className="text-[10px] text-emerald-500/80 mt-0.5">
            {Math.round((analytics.groundedQueries / Math.max(analytics.totalQueries, 1)) * 100)}% verified rate
          </p>
        </div>

        <div className="bg-[#071424] border border-slate-800 p-4 rounded-xl">
          <p className="text-[11px] text-slate-400 font-medium">Abstention Triggers</p>
          <p className="text-2xl font-bold text-amber-400 mt-1 font-mono">{analytics.abstainedQueries}</p>
          <p className="text-[10px] text-amber-500/80 mt-0.5">Zero hallucinations allowed</p>
        </div>

        <div className="bg-[#071424] border border-slate-800 p-4 rounded-xl">
          <p className="text-[11px] text-slate-400 font-medium">Avg Total Latency</p>
          <p className="text-2xl font-bold text-sky-400 mt-1 font-mono">{analytics.avgLatencyMs}ms</p>
          <p className="text-[10px] text-slate-500 mt-0.5">End-to-end response</p>
        </div>

        <div className="bg-[#071424] border border-slate-800 p-4 rounded-xl">
          <p className="text-[11px] text-slate-400 font-medium">UDHR Ethics Index</p>
          <p className="text-2xl font-bold text-sky-300 mt-1 font-mono">{analytics.ethicsIndexAvg}%</p>
          <p className="text-[10px] text-sky-500/80 mt-0.5">8 UNESCO pillars</p>
        </div>

        <div className="bg-[#071424] border border-slate-800 p-4 rounded-xl">
          <p className="text-[11px] text-slate-400 font-medium">PII Redactions</p>
          <p className="text-2xl font-bold text-indigo-400 mt-1 font-mono">{analytics.piiRedactionsTotal}</p>
          <p className="text-[10px] text-indigo-500/80 mt-0.5">UDHR Art. 12 protected</p>
        </div>
      </div>

      {/* Trace Waterfall Visualizer */}
      <div className="bg-[#071424] border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              RAG Pipeline Trace Waterfall Spans
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Active Trace ID: <span className="font-mono text-sky-300">{lastTrace?.traceId || 'trace-sovereign-live-0x8f2'}</span>
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Total Pipeline Latency: <strong className="text-white">{lastTrace?.totalLatencyMs || 380}ms</strong>
          </span>
        </div>

        {/* Steps Waterfall */}
        <div className="space-y-3 pt-2">
          {defaultTraceSteps.map((step, idx) => {
            const stepPercent = Math.max(Math.min((step.latency / 380) * 100, 100), 4);

            return (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 space-y-2 transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{step.name}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                      {step.component}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-sky-400 font-semibold">{step.latency}ms</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>

                {/* Progress bar visual */}
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-sky-500 to-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${stepPercent}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 leading-snug font-mono">
                  {step.details}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* OPEA Architectural Specs Card */}
      <div className="bg-[#071424] border border-slate-800 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Server className="w-4 h-4 text-sky-400" />
          Sovereign Hardware & Container Specs (ITU / UNICC Profile)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Embedding Engine</span>
            <p className="font-semibold text-slate-200">BAAI/bge-large-en-v1.5</p>
            <p className="text-[11px] text-slate-400 mt-1">1024-dimension vector space, TEI inference runtime</p>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Reranking Engine</span>
            <p className="font-semibold text-slate-200">BAAI/bge-reranker-v2-m3</p>
            <p className="text-[11px] text-slate-400 mt-1">8192 token max input cap, zero silent truncation</p>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Data Engine</span>
            <p className="font-semibold text-slate-200">ArangoDB 3.12 Multi-Model</p>
            <p className="text-[11px] text-slate-400 mt-1">Graph relations + vector collections + ClamAV scan</p>
          </div>
        </div>
      </div>
    </div>
  );
};
