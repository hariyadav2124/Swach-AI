import React, { useState } from 'react';
import { 
  History, 
  Search, 
  CheckCircle2, 
  Camera, 
  X, 
  Clock, 
  MapPin, 
  Check, 
  Sparkles,
  Layers
} from 'lucide-react';
import { SanitationHistoryRecord } from '../../types/sanitation';

interface SanitationHistoryViewProps {
  historyRecords: SanitationHistoryRecord[];
}

export const SanitationHistoryView: React.FC<SanitationHistoryViewProps> = ({
  historyRecords,
}) => {
  const [activeDateTab, setActiveDateTab] = useState<'All' | 'Today' | 'Yesterday' | 'This Week'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewProofModal, setViewProofModal] = useState<SanitationHistoryRecord | null>(null);

  const filtered = historyRecords.filter((rec) => {
    if (activeDateTab !== 'All' && rec.dateGroup !== activeDateTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return rec.binId.toLowerCase().includes(q) || rec.name.toLowerCase().includes(q) || rec.taskType.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/70 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Sanitation Task History
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Verified Before/After photographic records for Sanitation Unit B
          </p>
        </div>

        <div className="bg-neutral-900 text-white px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <span>{historyRecords.length} Verified Cleanings Logged</span>
        </div>
      </div>

      {/* Date Tabs and Search */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by bin ID, location, or cleaning type..."
            className="w-full text-xs pl-9 pr-3 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['All', 'Today', 'Yesterday', 'This Week'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveDateTab(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeDateTab === tab
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Records List */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center space-y-2">
          <History className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="text-sm font-bold text-neutral-800">No sanitation records found</h3>
          <p className="text-xs text-neutral-500">Try adjusting your search query or date filter.</p>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-xs divide-y divide-neutral-100">
          {filtered.map((record) => (
            <div
              key={record.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/70 transition-colors"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0 text-teal-700 font-mono text-xs font-bold mt-0.5">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-neutral-900">
                      {record.binId}
                    </span>
                    <span className="text-neutral-300">·</span>
                    <span className="font-bold text-xs sm:text-sm text-neutral-900">
                      {record.name}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                      {record.dateGroup}
                    </span>
                  </div>

                  <div className="text-xs text-neutral-700 font-medium">
                    {record.taskType}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      {record.location}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      {record.completionTime}
                    </span>
                    <span>·</span>
                    <span className="font-semibold text-teal-800 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Before / After Proof Verified
                    </span>
                  </div>

                  {record.operatorNotes && (
                    <p className="text-[11px] text-neutral-600 italic pt-0.5">
                      "{record.operatorNotes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-100">
                <button
                  onClick={() => setViewProofModal(record)}
                  className="px-3.5 py-2 text-xs font-bold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Camera className="w-3.5 h-3.5 text-teal-700" />
                  <span>View Dual Proof</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Before / After Dual Proof Comparison Modal */}
      {viewProofModal && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-teal-800">{viewProofModal.binId}</span>
                <h3 className="font-bold text-neutral-900 text-sm">{viewProofModal.name}</h3>
                <span className="text-[11px] text-neutral-500 font-mono">Completed at {viewProofModal.completionTime} ({viewProofModal.dateGroup})</span>
              </div>
              <button onClick={() => setViewProofModal(null)} className="text-neutral-400 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Dual Before / After Side-by-Side Comparison */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-neutral-500 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Before Sanitization
                </div>
                <div className="aspect-4/3 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100">
                  <img src={viewProofModal.beforePhoto} alt="Before" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-teal-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  After Sanitization
                </div>
                <div className="aspect-4/3 rounded-xl overflow-hidden border border-teal-300 bg-neutral-100">
                  <img src={viewProofModal.afterPhoto} alt="After" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-500">Actions Performed:</span>
                <span className="font-semibold text-neutral-900">{viewProofModal.actionsPerformed.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Operator:</span>
                <span className="font-medium text-neutral-800">{viewProofModal.workerName} ({viewProofModal.team})</span>
              </div>
              {viewProofModal.operatorNotes && (
                <div className="pt-1 text-[11px] text-neutral-600 italic">
                  "{viewProofModal.operatorNotes}"
                </div>
              )}
            </div>

            <button
              onClick={() => setViewProofModal(null)}
              className="w-full py-2.5 text-xs font-semibold bg-neutral-900 text-white rounded-xl"
            >
              Close Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
