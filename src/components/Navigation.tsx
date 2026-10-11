import React from 'react';
import { MessageSquare, FolderGit2, ShieldCheck, Activity, BookOpenCheck } from 'lucide-react';

export type TabType = 'chat' | 'documents' | 'ethics' | 'observability' | 'governance';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  documentCount: number;
  ethicsScore: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  documentCount,
  ethicsScore
}) => {
  const tabs = [
    {
      id: 'chat' as TabType,
      label: 'Sovereign Assistant',
      icon: MessageSquare,
      badge: 'Grounded RAG'
    },
    {
      id: 'documents' as TabType,
      label: 'Knowledge Repository',
      icon: FolderGit2,
      badge: `${documentCount} Docs`
    },
    {
      id: 'ethics' as TabType,
      label: 'Human Rights Ethics Center',
      icon: ShieldCheck,
      badge: `${ethicsScore}% UDHR`
    },
    {
      id: 'observability' as TabType,
      label: 'OTel Observability',
      icon: Activity,
      badge: 'BGE Pipeline'
    },
    {
      id: 'governance' as TabType,
      label: 'Governance & Fork Heritage',
      icon: BookOpenCheck,
      badge: 'Copyright Ervin'
    }
  ];

  return (
    <nav className="bg-[#0b1e36] border-b border-slate-800 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto scrollbar-none py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-sky-600/20 text-sky-300 border border-sky-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                  isActive
                    ? 'bg-sky-500/20 text-sky-200 border border-sky-400/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
