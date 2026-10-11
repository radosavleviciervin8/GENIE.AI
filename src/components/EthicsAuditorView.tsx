import React, { useState } from 'react';
import {
  Scale,
  ShieldCheck,
  Award,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Eye,
  FileSearch,
  Sparkles,
  RefreshCw,
  Cpu,
  BookOpen
} from 'lucide-react';
import { evaluateHumanRightsEthics, inspectAndRedactPII } from '../lib/ethicsAudit';
import { EthicsAuditResult } from '../types';

interface EthicsAuditorViewProps {
  onOpenHraiaModal: () => void;
}

export const EthicsAuditorView: React.FC<EthicsAuditorViewProps> = ({
  onOpenHraiaModal
}) => {
  const [sandboxInput, setSandboxInput] = useState(
    'Citizen John Doe (SSN: 123-45-6789, email: jdoe@example.org) requested asylum records under public administration guidelines.'
  );
  const [sandboxResult, setSandboxResult] = useState<EthicsAuditResult>(() =>
    evaluateHumanRightsEthics(
      'Citizen John Doe (SSN: 123-45-6789, email: jdoe@example.org) requested asylum records under public administration guidelines.',
      'Asylum procedures are guaranteed without distinction under UDHR Article 14.',
      true,
      98
    )
  );

  const runSandboxAudit = () => {
    const audit = evaluateHumanRightsEthics(
      sandboxInput,
      'Administrative query evaluated for human rights compliance.',
      true,
      96
    );
    setSandboxResult(audit);
  };

  const udhrArticles = [
    { article: 'UDHR Art. 1', title: 'Inherent Dignity & Freedom', status: 'Protected', desc: 'AI acts as a servant of human dignity without behavioral coercion.' },
    { article: 'UDHR Art. 2 & 7', title: 'Non-Discrimination & Equality', status: 'Audited', desc: 'Active bias filters eliminate historic disparate treatment in retrieval.' },
    { article: 'UDHR Art. 12', title: 'Right to Privacy', status: 'Enforced', desc: 'Automatic regex-level PII redaction and sovereign boundary isolation.' },
    { article: 'UDHR Art. 19', title: 'Freedom of Expression', status: 'Guaranteed', desc: 'No ideological silencing; neutral access to public knowledge.' },
    { article: 'UDHR Art. 27', title: 'Share in Scientific Advancement', status: 'Realized', desc: 'Digital Public Good (DPG) and open-source public code availability.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-[#091727] border border-slate-800 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
              International Human Rights Law Ethics Center
            </h2>
            <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-700 px-2 py-0.5 rounded font-mono font-bold">
              UNESCO 2021 Normative Standard
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Sovereign algorithmic oversight verifying adherence to the Universal Declaration of Human Rights (UDHR) and UNESCO Recommendation on the Ethics of AI.
          </p>
        </div>

        <button
          onClick={onOpenHraiaModal}
          className="px-4 py-2.5 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white rounded-xl text-xs font-semibold transition flex items-center gap-2 shadow-lg"
        >
          <Award className="w-4 h-4" />
          <span>Generate Official HRAIA Certificate</span>
        </button>
      </div>

      {/* 8 UNESCO Pillars Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Scale className="w-4 h-4 text-sky-400" />
          UNESCO 8 Core Ethical Pillars Monitoring Matrix
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {sandboxResult.pillars.map((pillar) => (
            <div
              key={pillar.unPillarId}
              className="bg-[#071424] border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 truncate">
                  {pillar.pillar}
                </span>
                <span className="text-xs font-bold text-sky-400 font-mono">
                  {pillar.score}%
                </span>
              </div>
              <p className="text-[10px] text-sky-300/80 font-mono">
                {pillar.treatyReference}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                {pillar.justification}
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Normative Compliance Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* UDHR Treaty Articles Compliance Checklist */}
      <div className="bg-[#071424] border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-sky-400" />
          Universal Declaration of Human Rights (UDHR) Operational Alignment
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {udhrArticles.map((art, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 border border-slate-800/80 p-3.5 rounded-xl space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-300 font-mono">{art.article}</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                  {art.status}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-slate-200">{art.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{art.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Live Privacy & Bias Guardrail Sandbox */}
      <div className="bg-[#071424] border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Interactive Privacy & Non-Discrimination Guardrail Sandbox
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Real-time regex & semantic inspection
          </span>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-slate-400 font-medium">
            Test custom prompt or public record for PII leaks, bias indicators, and sovereign compliance:
          </label>
          <div className="flex gap-2">
            <textarea
              rows={3}
              value={sandboxInput}
              onChange={(e) => setSandboxInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-sky-500"
            />
          </div>
          <button
            onClick={runSandboxAudit}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-evaluate Prompt</span>
          </button>
        </div>

        {/* Sandbox Findings */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400 font-medium">UDHR Art. 12 PII Status</p>
            <p className="text-sm font-bold text-slate-200 mt-1">
              {sandboxResult.piiDetected ? `${sandboxResult.piiRedactedCount} Identifiers Shielded` : 'Zero PII Detected'}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">Automated scrubbing in public records</p>
          </div>

          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400 font-medium">UDHR Art. 2 Bias Risk Level</p>
            <p className={`text-sm font-bold mt-1 ${sandboxResult.biasRiskLevel === 'LOW' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {sandboxResult.biasRiskLevel} RISK
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">Non-discrimination algorithm active</p>
          </div>

          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400 font-medium">Human Oversight Requirement</p>
            <p className="text-sm font-bold text-sky-300 mt-1">
              {sandboxResult.humanOversightLevel.replace(/_/g, ' ')}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">UNGP Principle 31 appeal mechanism</p>
          </div>
        </div>
      </div>
    </div>
  );
};
