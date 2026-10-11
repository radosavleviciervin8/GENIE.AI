import React from 'react';
import { X, ExternalLink, BookOpen, Scale, Award } from 'lucide-react';
import { Citation } from '../types';

interface CitationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  citations: Citation[];
}

export const CitationDrawer: React.FC<CitationDrawerProps> = ({
  isOpen,
  onClose,
  citations
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-[#0a1828] border-l border-slate-700 h-full flex flex-col shadow-2xl text-slate-100">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-[#06101d] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Sovereign Source Citations</h3>
              <p className="text-[11px] text-slate-400">{citations.length} Verified Public Sector Sources</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Citations List */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {citations.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No citations attached to this record.
            </div>
          ) : (
            citations.map((citation, idx) => (
              <div
                key={citation.id || idx}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 space-y-3 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                      Source #{idx + 1}
                    </span>
                    <h4 className="text-xs font-bold text-slate-100 leading-snug">
                      {citation.documentTitle}
                    </h4>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-800 px-1.5 py-0.5 rounded font-mono font-bold">
                      Rerank {(citation.rerankScore * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <Scale className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-300">{citation.articleOrSection}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400 truncate">{citation.authoritativeBody}</span>
                </div>

                <div className="bg-[#050e18] p-3 rounded-lg border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
                  "{citation.snippet}"
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Award className="w-3 h-3" />
                    Verified Sovereign Record
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    Similarity: {(citation.relevanceScore * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#06101d] text-[11px] text-slate-400 text-center">
          Grounded via BGE-Reranker-v2-m3 under ITU & UNICC specifications
        </div>
      </div>
    </div>
  );
};
