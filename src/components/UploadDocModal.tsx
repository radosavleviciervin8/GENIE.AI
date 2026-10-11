import React, { useState } from 'react';
import { X, Upload, ShieldCheck, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { SovereignDocument } from '../types';

interface UploadDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentAdded: (newDoc: SovereignDocument) => void;
}

export const UploadDocModal: React.FC<UploadDocModalProps> = ({
  isOpen,
  onClose,
  onDocumentAdded
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Human Rights' | 'AI Ethics' | 'Public Sector' | 'Sovereignty' | 'Technical'>('Human Rights');
  const [authoritativeBody, setAuthoritativeBody] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and document content are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          authoritativeBody: authoritativeBody || 'Sovereign Public Body',
          description,
          content,
          tags: [category, 'Custom Sovereign Record']
        })
      });

      if (!response.ok) {
        throw new Error('Failed to ingest document');
      }

      const data = await response.json();
      if (data.document) {
        onDocumentAdded(data.document);
        onClose();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error uploading document');
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadSampleTreaty = () => {
    setTitle('International Covenant on Civil and Political Rights (ICCPR) - Art 17 & 19');
    setCategory('Human Rights');
    setAuthoritativeBody('United Nations General Assembly');
    setDescription('Core multilateral treaty guaranteeing privacy against arbitrary interference and freedom of expression.');
    setContent(`Article 17:
1. No one shall be subjected to arbitrary or unlawful interference with his privacy, family, home or correspondence, nor to unlawful attacks on his honour and reputation.
2. Everyone has the right to the protection of the law against such interference or attacks.

Article 19:
1. Everyone shall have the right to hold opinions without interference.
2. Everyone shall have the right to freedom of expression; this right shall include freedom to seek, receive and impart information and ideas of all kinds, regardless of frontiers, either orally, in writing or in print, in the form of art, or through any other media of his choice.
3. The exercise of the rights provided for in paragraph 2 carries with it special duties and responsibilities. It may therefore be subject to certain restrictions, but these shall only be such as are provided by law and are necessary:
(a) For respect of the rights or reputations of others;
(b) For the protection of national security or of public order, or of public health or morals.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#0b1b2d] border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-[#071320] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-600/40 flex items-center justify-center text-sky-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Ingest Sovereign Document</h3>
              <p className="text-xs text-slate-400">
                ClamAV antimalware inspection & BGE-Large semantic vector chunking
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-sm">
          {error && (
            <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={loadSampleTreaty}
              className="text-xs text-sky-400 hover:text-sky-300 underline font-medium"
            >
              + Populate Sample UN Treaty (ICCPR)
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Document Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. UN Convention on the Rights of Persons with Disabilities"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Policy Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
              >
                <option value="Human Rights">Human Rights</option>
                <option value="AI Ethics">AI Ethics</option>
                <option value="Public Sector">Public Sector</option>
                <option value="Sovereignty">Sovereignty</option>
                <option value="Technical">Technical</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Authoritative Body
              </label>
              <input
                type="text"
                value={authoritativeBody}
                onChange={(e) => setAuthoritativeBody(e.target.value)}
                placeholder="e.g. UN General Assembly, UNESCO, ITU"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Executive Summary / Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of normative scope"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-300">
                Official Content / Policy Text *
              </label>
              <span className="text-[10px] text-slate-400">
                ~{Math.round(content.split(/\s+/).filter(Boolean).length * 1.3)} estimated tokens
              </span>
            </div>
            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste official resolution, legal articles, standards, or guidelines here..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-sky-500 leading-relaxed"
              required
            />
          </div>

          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ClamAV Antivirus Scanner: Ready</span>
            </div>
            <span className="text-[11px] text-sky-400 font-mono">BGE-Large 1024-dim</span>
          </div>

          {/* Footer actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition shadow flex items-center gap-2"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Ingesting...' : 'Ingest into Sovereign Index'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
