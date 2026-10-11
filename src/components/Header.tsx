import React from 'react';
import { ShieldCheck, Globe, Database, Scale, GitFork, Award } from 'lucide-react';

interface HeaderProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  onOpenHraiaModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  onOpenHraiaModal
}) => {
  const languages = [
    { code: 'en', name: 'English (UN)' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'ar', name: 'العربية' },
    { code: 'zh', name: '中文' },
    { code: 'ru', name: 'Русский' }
  ];

  return (
    <header className="bg-[#07182c] border-b border-slate-800 text-slate-100 shadow-md">
      {/* Top Sovereign Status Bar */}
      <div className="bg-[#040e1b] px-4 py-1.5 border-b border-slate-800/80 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-medium text-sky-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            SOVEREIGN INSTANCE ACTIVE
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-slate-300">
            <Scale className="w-3.5 h-3.5 text-sky-400" />
            UDHR & UNESCO AI Ethics 2021 Compliant
          </span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="hidden md:inline-flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            ClamAV Antivirus Clean
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-slate-400">
            Fork Maintainer: <strong className="text-slate-200">Ervin Remus Radosavlevici</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-sky-300 font-mono">v2.1.0-sovereign</span>
        </div>
      </div>

      {/* Main Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-600 via-blue-700 to-indigo-800 flex items-center justify-center shadow-lg shadow-sky-950/50 border border-sky-400/30">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
                GENIE<span className="text-sky-400">.AI</span>
              </h1>
              <span className="bg-sky-950/80 text-sky-300 border border-sky-700/50 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded">
                Sovereign Edition
              </span>
              <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                <GitFork className="w-3 h-3" />
                Ervin Fork
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Public Sector Intelligence Platform · International Human Rights Law Ethics & Audited RAG
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* HRAIA Button */}
          <button
            onClick={onOpenHraiaModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-900/60 hover:bg-sky-800/80 text-sky-200 border border-sky-600/50 rounded-lg text-xs font-medium transition shadow-sm"
          >
            <Award className="w-3.5 h-3.5 text-sky-400" />
            <span>Generate HRAIA Report</span>
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center bg-slate-900/90 border border-slate-700 rounded-lg px-2.5 py-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer pr-2 text-xs"
              aria-label="Select Interface Language"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200">
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
