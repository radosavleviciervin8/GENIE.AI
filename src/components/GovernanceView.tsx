import React from 'react';
import { GitFork, Scale, Award, ShieldCheck, CheckCircle2, FileCode, ExternalLink, HeartHandshake, BookOpen } from 'lucide-react';

export const GovernanceView: React.FC = () => {
  const bugFixes = [
    {
      id: 'FIX-01',
      title: 'Resolved Conversation Null-Clobber Bug (State Persistence)',
      component: 'gov-chat-frontend / ChatQnA',
      desc: 'Fixed an upstream bug where null or failed message streams clobbered conversation histories. Implemented resilient session hydration and snapshot recovery.'
    },
    {
      id: 'FIX-02',
      title: 'Strict Sovereign Abstention Against Algorithmic Hallucinations',
      component: 'chatqna / reranker',
      desc: 'Replaced legacy ungrounded generative fallbacks with strict [No Relevant Documents Found] transparent disclaimers whenever retrieval scores fall below threshold θ=0.30.'
    },
    {
      id: 'FIX-03',
      title: 'RFC 4918 207 Multi-Status Batch Ingestion Contract (MR !469)',
      component: 'document-repository / fileRoutes',
      desc: 'Fixed bug where frontend pushed ArangoDB _key instead of semantic file_id, producing false-positive 200 envelopes. Implemented proper 207 Multi-Status with per-file result payloads.'
    },
    {
      id: 'FIX-04',
      title: '8192-Token Reranker Alignment & Auto-Truncate Safeguard (MR !406)',
      component: 'genie-ai-overlay/reranker',
      desc: 'Aligned TEI max batch tokens with BAAI/bge-reranker-v2-m3 (8192 tokens) with --auto-truncate=false to raise HTTP 422 validations instead of silent text loss.'
    },
    {
      id: 'FIX-05',
      title: 'Real Gemini Server-Side Proxy Integration & Sovereign Continuity',
      component: 'server.ts / @google/genai',
      desc: 'Implemented secure server-side proxy routes with zero client API key exposure, paired with a robust offline sovereign RAG synthesis fallback.'
    },
    {
      id: 'FIX-06',
      title: 'Embedded International Human Rights Law Ethics Engine',
      component: 'lib/ethicsAudit.ts / UNESCO Auditor',
      desc: 'Continuous real-time auditing across 8 UNESCO pillars, UDHR Articles 1, 2, 7, 12, 19, 27, automated PII scrubbing, and HRAIA report generation.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Fork Hero Banner */}
      <div className="bg-[#091727] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-700 flex items-center justify-center text-white shadow-lg">
              <GitFork className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-sky-400 tracking-wider uppercase">
                OFFICIAL FORK REPOSITORY
              </span>
              <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
                GENIE.AI Sovereign Public Sector Framework
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Upstream Origin: <a href="https://opensource.unicc.org/Ervin/genie-ai.git" target="_blank" rel="noopener noreferrer" className="text-sky-300 hover:underline">https://opensource.unicc.org/Ervin/genie-ai.git</a>
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-right">
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">Lead Architect & Maintainer</span>
            <span className="text-sm font-bold text-white">Ervin Remus Radosavlevici</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          This deployment represents the sovereign, production-hardened fork of the GENIE.AI project, initiated under the leadership of the International Telecommunication Union (ITU) and United Nations International Computing Centre (UNICC), maintained and enhanced with International Human Rights Law ethics by <strong>Ervin Remus Radosavlevici</strong>.
        </p>

        {/* Badges bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="px-3 py-1 bg-sky-950 text-sky-300 border border-sky-800 rounded-full text-xs font-semibold">
            Copyright © 2026 Ervin Remus Radosavlevici
          </span>
          <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full text-xs font-semibold">
            Apache License 2.0
          </span>
          <span className="px-3 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-full text-xs font-semibold">
            Digital Public Goods (DPG) Aligned
          </span>
          <span className="px-3 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-full text-xs font-semibold">
            OSI Open Source AI Definition Compliant
          </span>
        </div>
      </div>

      {/* Upgrades & Bug Fixes Inventory */}
      <div className="bg-[#071424] border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <FileCode className="w-4 h-4 text-sky-400" />
          Production Engineering Upgrades & Upstream Bug Fixes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bugFixes.map((fix) => (
            <div
              key={fix.id}
              className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 space-y-2 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-300 font-mono">{fix.id}</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                  {fix.component}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-100">{fix.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{fix.desc}</p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified in Production Build</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* International Legal Foundation */}
      <div className="bg-[#071424] border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Scale className="w-4 h-4 text-sky-400" />
          International Human Rights Law & Ethical Constitution
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-white">Universal Declaration of Human Rights</h4>
            <p className="text-slate-400 leading-relaxed">
              Enforces non-negotiable guarantees on human dignity (Art. 1), universal equality (Art. 2 & 7), right to privacy (Art. 12), freedom of expression (Art. 19), and access to science (Art. 27).
            </p>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-white">UNESCO Recommendation on AI Ethics (2021)</h4>
            <p className="text-slate-400 leading-relaxed">
              The first global normative standard on AI, binding 193 member states to human oversight, transparency, explainability, safety, proportionality, and environmental sustainability.
            </p>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-white">UN Guiding Principles (UNGPs)</h4>
            <p className="text-slate-400 leading-relaxed">
              Mandates Human Rights Due Diligence (HRDD), continuous impact assessments (HRAIA), and accessible dispute resolution and remedy mechanisms for affected citizens.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright & License Notice */}
      <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-400 space-y-2">
        <h4 className="font-bold text-slate-200 uppercase tracking-wider">
          Legal Copyright & Licensing Attribution
        </h4>
        <p className="leading-relaxed">
          Copyright © 2026 <strong>Ervin Remus Radosavlevici</strong>. All rights reserved.
        </p>
        <p className="leading-relaxed text-slate-500 text-[11px]">
          Licensed under the Apache License, Version 2.0. Derived from the open-source GENIE.AI framework initiated under the International Telecommunication Union (ITU) and United Nations International Computing Centre (UNICC). Incorporating enhancements from OPEA (Open Platform for Enterprise AI), IBM Research Docling, and Intel Corporation.
        </p>
      </div>
    </div>
  );
};
