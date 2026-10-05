import React, { useState } from 'react';
import { 
  PlusCircle, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Clock, 
  Users, 
  ArrowRight, 
  Check, 
  X,
  FileCheck,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { AdminNewBinRequest } from '../../types/admin';

interface AdminNewBinRequestsViewProps {
  requests: AdminNewBinRequest[];
  onApproveRequest: (id: string) => void;
  onRejectRequest: (id: string) => void;
  onInspectRequest: (id: string) => void;
}

export const AdminNewBinRequestsView: React.FC<AdminNewBinRequestsViewProps> = ({
  requests,
  onApproveRequest,
  onRejectRequest,
  onInspectRequest,
}) => {
  const [selectedReq, setSelectedReq] = useState<AdminNewBinRequest | null>(requests[0] ?? null);
  const pendingCount = requests.filter((request) => request.status === 'Pending Review').length;
  const inspectingCount = requests.filter((request) => request.status === 'Under Inspection').length;
  const approvedCount = requests.filter((request) => request.status === 'Approved').length;
  const rejectedCount = requests.filter((request) => request.status === 'Rejected').length;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
              Infrastructure Planning & Expansion
            </span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight mt-0.5">
            Citizen Community Bin Suggestions
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Crowdsourced citizen demand clusters, coverage deficit scoring (&gt;500m gaps), and installation approvals.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 font-bold">
            {pendingCount} Pending Review
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
            {approvedCount} Approved
          </span>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-neutral-200/90 shadow-2xs">
          <span className="text-xs text-neutral-500 font-medium">Pending Review</span>
          <div className="text-2xl font-bold font-mono text-neutral-900 mt-1">{pendingCount}</div>
          <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">Pending review</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-neutral-200/90 shadow-2xs">
          <span className="text-xs text-neutral-500 font-medium">Under Inspection</span>
          <div className="text-2xl font-bold font-mono text-neutral-900 mt-1">{inspectingCount}</div>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Under inspection</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-neutral-200/90 shadow-2xs">
          <span className="text-xs text-neutral-500 font-medium">Sanctioned & Approved</span>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">{approvedCount}</div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">Approved requests</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-neutral-200/90 shadow-2xs">
          <span className="text-xs text-neutral-500 font-medium">Rejected / Redundant</span>
          <div className="text-2xl font-bold font-mono text-neutral-400 mt-1">{rejectedCount}</div>
          <span className="text-[11px] text-neutral-400 font-mono mt-1 block">Rejected requests</span>
        </div>
      </div>

      {/* Main Split View: Request List + Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Request Cards */}
        <div className="lg:col-span-2 space-y-3">
          {requests.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-2xl p-8 text-center text-sm text-neutral-500">
              No new bin requests.
            </div>
          ) : requests.map((req) => {
            const isSelected = selectedReq?.id === req.id;

            return (
              <div
                key={req.id}
                onClick={() => setSelectedReq(req)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50/40 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white border-neutral-200/80 hover:border-neutral-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                        {req.id}
                      </span>
                      <span className="font-bold text-neutral-900 text-sm">{req.area}</span>
                      <span className="text-neutral-400">·</span>
                      <span className="text-xs font-semibold text-neutral-700">{req.sector}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        req.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'Under Inspection'
                          ? 'bg-amber-100 text-amber-800'
                          : req.status === 'Rejected'
                          ? 'bg-neutral-100 text-neutral-600'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-neutral-600 mt-2 font-mono">
                      <span className="flex items-center gap-1 font-bold text-neutral-900">
                        <Users className="w-3.5 h-3.5 text-neutral-400" />
                        {req.requestCount} citizen requests
                      </span>
                      <span>·</span>
                      <span className="text-rose-600 font-semibold">
                        Nearest bin: {req.nearestBinMeters}m away
                      </span>
                      <span>·</span>
                      <span>Coverage gap score: {req.coverageGapScore}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0" onClick={(e) => e.stopPropagation()}>
                    {req.status === 'Pending Review' && (
                      <>
                        <button
                          onClick={() => onApproveRequest(req.id)}
                          className="px-2.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => onInspectRequest(req.id)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
                        >
                          Inspect
                        </button>
                        <button
                          onClick={() => onRejectRequest(req.id)}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-neutral-100"
                          title="Reject request"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Request Coverage Card */}
        {selectedReq && (
          <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-xs space-y-4 h-fit">
            <div className="border-b border-neutral-100 pb-3">
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase block">Infrastructure Demand Analysis</span>
              <h3 className="text-base font-bold text-neutral-900 mt-1">{selectedReq.area}</h3>
              <div className="text-xs text-neutral-500 font-mono mt-0.5">{selectedReq.sector} · {selectedReq.id}</div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Citizen Backing:</span>
                  <span className="font-bold text-neutral-900">{selectedReq.requestCount} residents registered</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Nearest Community Bin:</span>
                  <span className="font-bold font-mono text-rose-600">{selectedReq.nearestBinMeters} meters</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Waste Demand Level:</span>
                  <span className="font-bold text-neutral-900">{selectedReq.wasteDemandLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Coverage Deficit Score:</span>
                  <span className="font-bold font-mono text-indigo-700">{selectedReq.coverageGapScore} / 100</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-neutral-700 block mb-1">Citizen Justification:</span>
                <p className="text-xs text-neutral-600 bg-neutral-50 p-3 rounded-xl border border-neutral-200 leading-relaxed font-sans">
                  "{selectedReq.justification}"
                </p>
              </div>

              <div className="text-[11px] text-neutral-400 font-mono">
                Initiated by: {selectedReq.suggestedBy} · {selectedReq.dateSubmitted}
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 space-y-2">
              <button
                onClick={() => onApproveRequest(selectedReq.id)}
                className="w-full py-2.5 text-xs font-bold text-neutral-950 bg-teal-400 hover:bg-teal-300 rounded-xl transition-colors shadow-2xs flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Sanction 1100L Bin Installation</span>
              </button>
              <button
                onClick={() => onInspectRequest(selectedReq.id)}
                className="w-full py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl border border-neutral-200 transition-colors"
              >
                Dispatch Engineering Inspection Team
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
