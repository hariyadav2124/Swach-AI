import React, { useState } from 'react';
import { 
  MessageSquare, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Camera, 
  X, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Search
} from 'lucide-react';
import { CitizenSanitationComplaint, SanitationTask } from '../../types/sanitation';
import { INITIAL_CITIZEN_COMPLAINTS } from '../../data/mockSanitationData';

interface SanitationComplaintsViewProps {
  tasks: SanitationTask[];
  onStartTaskByBinId: (binId: string) => void;
}

export const SanitationComplaintsView: React.FC<SanitationComplaintsViewProps> = ({
  tasks,
  onStartTaskByBinId,
}) => {
  const [complaints, setComplaints] = useState<CitizenSanitationComplaint[]>(INITIAL_CITIZEN_COMPLAINTS);
  const [selectedComplaint, setSelectedComplaint] = useState<CitizenSanitationComplaint | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredComplaints = complaints.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return c.id.toLowerCase().includes(q) || c.binId.toLowerCase().includes(q) || c.issue.toLowerCase().includes(q) || c.location.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/70 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Citizen Hygiene Complaints
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Verified resident reports logged via CivicWaste citizen app for Ward 14
          </p>
        </div>

        <div className="bg-neutral-900 text-white px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-2 font-mono">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span>{complaints.length} Active Hygiene Complaints</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by complaint ID, bin code, or keyword..."
          className="w-full text-xs pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 shadow-xs"
        />
      </div>

      {/* Complaints List */}
      <div className="space-y-3">
        {filteredComplaints.map((c) => (
          <div
            key={c.id}
            onClick={() => setSelectedComplaint(c)}
            className="bg-white border border-neutral-200/90 hover:border-neutral-300 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-neutral-900 group-hover:text-rose-700 transition-colors">
                    {c.id}
                  </span>
                  <span className="text-neutral-300">·</span>
                  <span className="font-mono text-xs font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                    {c.binId}
                  </span>
                  <span className="text-neutral-300">·</span>
                  <span className="font-bold text-xs sm:text-sm text-neutral-900">
                    {c.issue}
                  </span>
                </div>

                <p className="text-xs text-neutral-600 line-clamp-1">
                  "{c.citizenDescription}"
                </p>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-neutral-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-neutral-400" />
                    {c.location}
                  </span>
                  <span>·</span>
                  <span className="font-mono text-rose-600 font-bold">
                    {c.reportCount} Verified Reports
                  </span>
                  <span>·</span>
                  <span>Reported {c.reportedTime}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center shrink-0">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${
                c.urgency === 'critical'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {c.urgency.toUpperCase()}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStartTaskByBinId(c.binId);
                }}
                className="px-3.5 py-1.5 text-xs font-bold text-neutral-950 bg-teal-400 hover:bg-teal-300 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-neutral-950" />
                <span>Sanitize Bin</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Complaint Inspection Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-rose-700">{selectedComplaint.id}</span>
                <h3 className="text-base font-bold text-neutral-900">{selectedComplaint.issue}</h3>
              </div>
              <button onClick={() => setSelectedComplaint(null)} className="text-neutral-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-neutral-500">Related Bin:</span>
                <span className="font-bold text-neutral-900">{selectedComplaint.binId} · {selectedComplaint.binName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Location:</span>
                <span className="font-medium text-neutral-800">{selectedComplaint.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Citizen Reports:</span>
                <span className="font-bold text-rose-600">{selectedComplaint.reportCount} unique neighborhood reports</span>
              </div>
            </div>

            {selectedComplaint.photoUrl && (
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Citizen Evidence Photo</span>
                <div className="w-full aspect-16/9 rounded-xl overflow-hidden border border-neutral-200">
                  <img src={selectedComplaint.photoUrl} alt="Complaint Evidence" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Citizen Statement</span>
              <p className="text-xs text-neutral-700 bg-neutral-50 p-3 rounded-xl border border-neutral-200/80 leading-relaxed italic">
                "{selectedComplaint.citizenDescription}"
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const binId = selectedComplaint.binId;
                  setSelectedComplaint(null);
                  onStartTaskByBinId(binId);
                }}
                className="px-5 py-2.5 text-xs font-bold text-neutral-950 bg-teal-400 hover:bg-teal-300 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-neutral-950" />
                <span>Open Task for {selectedComplaint.binId}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
