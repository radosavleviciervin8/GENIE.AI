import React from 'react';
import { X, ShieldCheck, AlertTriangle, CheckCircle2, Lock, FileText, Download, Scale } from 'lucide-react';
import { EthicsAuditResult } from '../types';

interface EthicsShieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditResult: EthicsAuditResult | null;
}

export const EthicsShieldModal: React.FC<EthicsShieldModalProps> = ({
  isOpen,
  onClose,
  auditResult
}) => {
  if (!isOpen || !auditResult) return null;

  const downloadReport = () => {
    const reportData = JSON.stringify(auditResult, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GENIE_AI_Human_Rights_Audit_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0b1b2d] border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-[#071320] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-600/40 flex items-center justify-center text-sky-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  International Human Rights Law Ethics Inspection
                </h3>
                <span className="bg-sky-950 text-sky-300 text-[10px] font-semibold border border-sky-700 px-2 py-0.5 rounded">
                  UNESCO 2021 Normative Standard
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Audited against UDHR (1948), UNGP, and UNESCO Recommendation on AI Ethics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Top Scorecard Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">Compliance Index</p>
                <p className="text-2xl font-bold text-sky-400 mt-1">{auditResult.overallScore}%</p>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-sky-500/40 flex items-center justify-center text-xs font-bold text-sky-300">
                AAA
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">Sovereign Audit Status</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-300">
                    {auditResult.verdict.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">UDHR Art. 12 Privacy Filter</p>
                <p className="text-sm font-semibold text-slate-200 mt-1">
                  {auditResult.piiDetected ? `${auditResult.piiRedactedCount} Identifiers Shielded` : 'Zero PII Leaked'}
                </p>
              </div>
              <Lock className="w-5 h-5 text-indigo-400" />
            </div>
          </div>

          {/* 8 UNESCO Pillars Breakdown */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              UNESCO 8 Core Ethical Pillars Assessment
            </h4>
            <div className="space-y-2.5">
              {auditResult.pillars.map((pillar) => (
                <div
                  key={pillar.unPillarId}
                  className="bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 rounded-xl p-3.5 transition"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-200">{pillar.pillar}</span>
                      <span className="text-[10px] bg-slate-800 text-sky-300 px-2 py-0.5 rounded font-mono border border-slate-700">
                        {pillar.treatyReference}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-sky-400">{pillar.score}%</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{pillar.justification}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Implicated Rights and Human Oversight */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
            <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Human Agency & Legal Notice
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Under UN Guiding Principle 31 and UNESCO Principle 6, automated public sector algorithms provide advisory decision-support. Sovereign discretion and ultimate administrative determination remain with natural human public officials.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              <span>Auditor Signature: <strong className="text-sky-300">{auditResult.auditorSignature}</strong></span>
              <span className="text-slate-600">|</span>
              <span>Timestamp: <span className="font-mono text-slate-300">{auditResult.timestamp}</span></span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#071320] flex items-center justify-between">
          <button
            onClick={downloadReport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Audit JSON</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-medium transition shadow"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
