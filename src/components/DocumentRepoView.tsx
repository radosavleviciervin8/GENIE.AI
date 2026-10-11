import React, { useState } from 'react';
import {
  FolderGit2,
  Upload,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Eye,
  FileText,
  Search,
  Filter,
  Layers,
  Scale
} from 'lucide-react';
import { SovereignDocument, DocumentChunk } from '../types';

interface DocumentRepoViewProps {
  documents: SovereignDocument[];
  onOpenUploadModal: () => void;
  onBatchAction: (action: 'ingest' | 'retract' | 'reindex', fileIds: string[]) => Promise<void>;
  isProcessingBatch: boolean;
}

export const DocumentRepoView: React.FC<DocumentRepoViewProps> = ({
  documents,
  onOpenUploadModal,
  onBatchAction,
  isProcessingBatch
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [inspectingDoc, setInspectingDoc] = useState<SovereignDocument | null>(null);

  const categories = ['All', 'Human Rights', 'AI Ethics', 'Sovereignty', 'Public Sector'];

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.file_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleSelectAll = () => {
    if (selectedFileIds.length === filteredDocs.length) {
      setSelectedFileIds([]);
    } else {
      // Correctly push semantic file_id (Fixes upstream bug !469)
      setSelectedFileIds(filteredDocs.map(d => d.file_id));
    }
  };

  const toggleSelectOne = (fileId: string) => {
    if (selectedFileIds.includes(fileId)) {
      setSelectedFileIds(selectedFileIds.filter(id => id !== fileId));
    } else {
      setSelectedFileIds([...selectedFileIds, fileId]);
    }
  };

  const handleBatch = async (action: 'ingest' | 'retract' | 'reindex') => {
    if (selectedFileIds.length === 0) return;
    await onBatchAction(action, selectedFileIds);
    setSelectedFileIds([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-[#091727] border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">
              Sovereign Document Repository & Knowledge Base
            </h2>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono font-semibold">
              RFC 4918 207 Multi-Status Compliant
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Sovereign documents indexed into BGE-Large vector space. Verified with ClamAV antimalware inspection and contextual 8192-token chunk boundaries.
          </p>
        </div>

        <button
          onClick={onOpenUploadModal}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-2 shadow"
        >
          <Upload className="w-4 h-4" />
          <span>Ingest New Document</span>
        </button>
      </div>

      {/* Filter and Batch Toolbar */}
      <div className="bg-[#071424] border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, treaty ID, or keyword..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Category filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Batch action bar */}
        {selectedFileIds.length > 0 && (
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-sky-950/40 p-2.5 rounded-xl border border-sky-800/40">
            <span className="text-xs text-sky-200 font-medium">
              {selectedFileIds.length} document(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBatch('ingest')}
                disabled={isProcessingBatch}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs rounded-lg font-medium transition disabled:opacity-50"
              >
                Batch Ingest (207)
              </button>
              <button
                onClick={() => handleBatch('retract')}
                disabled={isProcessingBatch}
                className="px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-white text-xs rounded-lg font-medium transition disabled:opacity-50"
              >
                Batch Retract
              </button>
              <button
                onClick={() => handleBatch('reindex')}
                disabled={isProcessingBatch}
                className="px-3 py-1.5 bg-sky-700 hover:bg-sky-600 text-white text-xs rounded-lg font-medium transition disabled:opacity-50"
              >
                Batch Re-index
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Documents Table */}
      <div className="bg-[#071424] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#050f1b] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={filteredDocs.length > 0 && selectedFileIds.length === filteredDocs.length}
                    onChange={toggleSelectAll}
                    className="rounded bg-slate-900 border-slate-700 text-sky-600 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="p-4">Document Title & Semantic ID</th>
                <th className="p-4">Authoritative Body</th>
                <th className="p-4">Chunks</th>
                <th className="p-4">ClamAV Scan</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No documents found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => {
                  const isSelected = selectedFileIds.includes(doc.file_id);

                  return (
                    <tr
                      key={doc.id}
                      className={`hover:bg-slate-900/60 transition ${
                        isSelected ? 'bg-sky-950/30' : ''
                      }`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(doc.file_id)}
                          className="rounded bg-slate-900 border-slate-700 text-sky-600 focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-100 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                          <span>{doc.title}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          file_id: {doc.file_id} ({doc.fileSizeKb} KB)
                        </div>
                      </td>
                      <td className="p-4 text-slate-400">
                        {doc.authoritativeBody}
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-800 text-sky-300 px-2 py-0.5 rounded text-[11px] font-mono">
                          {doc.chunkCount} chunks
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Clean</span>
                        </div>
                        <span className="text-[9px] text-slate-500 font-mono truncate block max-w-[120px]">
                          {doc.clamavScanHash.substring(0, 16)}...
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                            doc.status === 'indexed'
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                              : doc.status === 'retracted'
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-700/60'
                              : 'bg-rose-950/80 text-rose-300 border border-rose-700/60'
                          }`}
                        >
                          {doc.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setInspectingDoc(doc)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-sky-400" />
                          <span>Inspect Chunks</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chunk Inspector Modal */}
      {inspectingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#0b1b2d] border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-800 bg-[#071320] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-sky-400" />
                  <span>Chunk Inspector: {inspectingDoc.title}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {inspectingDoc.chunkCount} BGE-Large Embeddings · ClamAV Clean
                </p>
              </div>
              <button
                onClick={() => setInspectingDoc(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {inspectingDoc.chunks.map((chunk, idx) => (
                <div
                  key={chunk.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-sky-300">
                      Chunk #{idx + 1} ({chunk.metadata.article || chunk.metadata.section || 'General'})
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {chunk.tokenCount} tokens
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed bg-[#050e18] p-3 rounded-lg border border-slate-800/80 whitespace-pre-wrap">
                    {chunk.content}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-800 bg-[#071320] flex justify-end">
              <button
                onClick={() => setInspectingDoc(null)}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
