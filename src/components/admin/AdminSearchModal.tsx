import React, { useState } from 'react';
import { 
  Search, 
  X, 
  Trash2, 
  MessageSquare, 
  PlusCircle, 
  Users, 
  ArrowRight,
  Sparkles,
  MapPin
} from 'lucide-react';
import { 
  AdminBin, 
  AdminComplaint, 
  AdminNewBinRequest, 
  AdminWorker, 
  AdminTab 
} from '../../types/admin';

interface AdminSearchModalProps {
  bins: AdminBin[];
  complaints: AdminComplaint[];
  newBinRequests: AdminNewBinRequest[];
  workers: AdminWorker[];
  onClose: () => void;
  onSelectBin: (bin: AdminBin) => void;
  onNavigateTab: (tab: AdminTab) => void;
}

export const AdminSearchModal: React.FC<AdminSearchModalProps> = ({
  bins,
  complaints,
  newBinRequests,
  workers,
  onClose,
  onSelectBin,
  onNavigateTab,
}) => {
  const [query, setQuery] = useState<string>('');

  const q = query.toLowerCase().trim();

  const matchedBins = q ? bins.filter((b) => b.id.toLowerCase().includes(q) || b.name.toLowerCase().includes(q) || b.locationDescription.toLowerCase().includes(q)) : [];
  const matchedComplaints = q ? complaints.filter((c) => c.id.toLowerCase().includes(q) || c.binId.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.citizenName.toLowerCase().includes(q)) : [];
  const matchedRequests = q ? newBinRequests.filter((r) => r.id.toLowerCase().includes(q) || r.area.toLowerCase().includes(q)) : [];
  const matchedWorkers = q ? workers.filter((w) => w.name.toLowerCase().includes(q) || w.vehicle.toLowerCase().includes(q) || w.team.toLowerCase().includes(q)) : [];

  const totalResults = matchedBins.length + matchedComplaints.length + matchedRequests.length + matchedWorkers.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-16 p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-neutral-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-3 border-b border-neutral-100 flex items-center gap-2">
          <Search className="w-5 h-5 text-neutral-400 shrink-0 ml-2" />
          <input
            type="text"
            autoFocus
            placeholder="Search current bins, complaints, requests, or workers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent border-none focus:outline-none text-neutral-900 placeholder:text-neutral-400 py-1"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-neutral-400 hover:text-neutral-700">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="text-xs text-neutral-500 hover:text-neutral-900 px-2 py-1">
            Esc
          </button>
        </div>

        {/* Results Container */}
        {query && (
          <div className="overflow-y-auto p-3 space-y-4 text-xs divide-y divide-neutral-100">
            {totalResults === 0 ? (
              <div className="text-center py-8 text-neutral-400">
                No matching records found for "{query}".
              </div>
            ) : null}

            {/* Bins */}
            {matchedBins.length > 0 && (
              <div className="space-y-1 pt-2 first:pt-0">
                <span className="text-[10px] font-mono uppercase font-bold text-neutral-400 px-2">Community Bins</span>
                {matchedBins.map((bin) => (
                  <div
                    key={bin.id}
                    onClick={() => {
                      onSelectBin(bin);
                      onClose();
                    }}
                    className="p-2 rounded-xl hover:bg-neutral-50 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                        <Trash2 className="w-3.5 h-3.5 text-teal-600" />
                        <span>{bin.id} · {bin.name}</span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                          bin.status === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {bin.currentFill}%
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-500 ml-5">{bin.locationDescription}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                ))}
              </div>
            )}

            {/* Complaints */}
            {matchedComplaints.length > 0 && (
              <div className="space-y-1 pt-2">
                <span className="text-[10px] font-mono uppercase font-bold text-neutral-400 px-2">Citizen Complaints</span>
                {matchedComplaints.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onNavigateTab('complaints');
                      onClose();
                    }}
                    className="p-2 rounded-xl hover:bg-neutral-50 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                        <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                        <span>{c.id} · {c.category}</span>
                        <span className="font-mono text-teal-700 text-[10px] bg-teal-50 px-1 rounded">{c.binId}</span>
                      </div>
                      <div className="text-[11px] text-neutral-500 ml-5 truncate max-w-md">{c.description}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                ))}
              </div>
            )}

            {/* Workers */}
            {matchedWorkers.length > 0 && (
              <div className="space-y-1 pt-2">
                <span className="text-[10px] font-mono uppercase font-bold text-neutral-400 px-2">Personnel & Fleet</span>
                {matchedWorkers.map((w) => (
                  <div
                    key={w.id}
                    onClick={() => {
                      onNavigateTab('workers');
                      onClose();
                    }}
                    className="p-2 rounded-xl hover:bg-neutral-50 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        <span>{w.name} ({w.vehicle})</span>
                        <span className="text-[10px] text-neutral-500 font-mono">· {w.role}</span>
                      </div>
                      <div className="text-[11px] text-neutral-500 ml-5">Currently at: {w.currentLocationName}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
