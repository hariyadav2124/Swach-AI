import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  Clock, 
  MapPin, 
  Camera, 
  X,
  Calendar,
  Layers
} from 'lucide-react';
import { CollectionHistoryRecord } from '../../types/worker';

interface WorkerHistoryViewProps {
  historyRecords: CollectionHistoryRecord[];
}

export const WorkerHistoryView: React.FC<WorkerHistoryViewProps> = ({
  historyRecords,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<'All' | 'Today' | 'Yesterday' | 'Earlier this week'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Attention Required'>('All');
  const [viewPhotoRecord, setViewPhotoRecord] = useState<CollectionHistoryRecord | null>(null);

  const filtered = historyRecords.filter((rec) => {
    if (dateFilter !== 'All' && rec.dateGroup !== dateFilter) return false;
    if (statusFilter !== 'All' && rec.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return rec.binId.toLowerCase().includes(q) || rec.name.toLowerCase().includes(q) || rec.location.toLowerCase().includes(q);
    }
    return true;
  });

  // Calculate total payload today
  const todayPayload = historyRecords
    .filter((r) => r.dateGroup === 'Today')
    .reduce((sum, r) => sum + r.quantityKg, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Title & Today's Total Weight Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/70 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Collection History & Weighbridge Logs
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Recorded collections
          </p>
        </div>

        <div className="bg-neutral-900 text-white px-4 py-2 rounded-xl flex items-center gap-3 text-xs self-start sm:self-center">
          <Scale className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <div className="text-[10px] text-neutral-400 uppercase font-bold">Shift Weight Cleared</div>
            <div className="font-mono text-sm font-bold text-white">{todayPayload.toLocaleString()} kg</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by bin ID, name, or street location..."
            className="w-full text-xs pl-9 pr-3 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['All', 'Today', 'Yesterday', 'Earlier this week'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDateFilter(d)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                dateFilter === d
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Collection Records Table / Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center space-y-2">
          <History className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="text-sm font-bold text-neutral-800">No collection records found</h3>
          <p className="text-xs text-neutral-500">Try adjusting your search or date filter.</p>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-xs divide-y divide-neutral-100">
          {filtered.map((record) => (
            <div
              key={record.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/70 transition-colors"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0 text-neutral-700 font-mono text-xs font-bold mt-0.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
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

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      {record.location}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      {record.collectionTime}
                    </span>
                    <span>·</span>
                    <span className="font-mono text-neutral-700 font-semibold">
                      Vehicle {record.vehicle}
                    </span>
                  </div>

                  {record.operatorNotes && (
                    <p className="text-[11px] text-neutral-600 italic pt-0.5">
                      "{record.operatorNotes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Payload & Photo action */}
              <div className="flex items-center justify-between sm:justify-end gap-4 self-stretch sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-100">
                <div className="text-left sm:text-right">
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Weight Cleared</div>
                  <div className="font-mono text-base font-extrabold text-neutral-900">
                    {record.quantityKg} kg
                  </div>
                </div>

                <button
                  onClick={() => setViewPhotoRecord(record)}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Proof</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Proof Photo Modal */}
      {viewPhotoRecord && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-neutral-900 text-sm">
                  Verified Collection Photo Proof
                </h3>
                <p className="text-xs text-neutral-500 font-mono">
                  {viewPhotoRecord.binId} · {viewPhotoRecord.collectionTime} ({viewPhotoRecord.dateGroup})
                </p>
              </div>
              <button
                onClick={() => setViewPhotoRecord(null)}
                className="text-neutral-400 hover:text-neutral-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden aspect-16/9 bg-neutral-100 border border-neutral-200">
              <img src={viewPhotoRecord.photoUrl} alt="Proof" className="w-full h-full object-cover" />
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-neutral-500">Weight Offloaded:</span>
                <span className="font-mono font-bold text-neutral-900">{viewPhotoRecord.quantityKg} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Assigned Driver:</span>
                <span className="font-medium text-neutral-800">Rohit Kumar</span>
              </div>
            </div>

            <button
              onClick={() => setViewPhotoRecord(null)}
              className="w-full py-2 text-xs font-semibold bg-neutral-900 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
