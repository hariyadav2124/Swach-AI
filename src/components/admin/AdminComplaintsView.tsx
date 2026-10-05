import React, { useState } from 'react';
import { 
  MessageSquare, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Search, 
  Filter, 
  ShieldAlert, 
  ArrowRight, 
  Check, 
  UserPlus,
  PhoneCall,
  Camera,
  X
} from 'lucide-react';
import { AdminComplaint } from '../../types/admin';

interface AdminComplaintsViewProps {
  complaints: AdminComplaint[];
  onEscalateComplaint: (complaintId: string) => void;
  onAssignComplaint: (complaint: AdminComplaint) => void;
  onResolveComplaint: (complaintId: string) => void;
}

export const AdminComplaintsView: React.FC<AdminComplaintsViewProps> = ({
  complaints,
  onEscalateComplaint,
  onAssignComplaint,
  onResolveComplaint,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [viewProofModal, setViewProofModal] = useState<AdminComplaint | null>(null);

  const filtered = complaints.filter((c) => {
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (categoryFilter !== 'All' && c.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.binId.toLowerCase().includes(q) ||
        c.citizenName.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    return true;
  });
  const countByStatus = (status: AdminComplaint['status']) =>
    complaints.filter((complaint) => complaint.status === status).length;
  const overdueCount = complaints.filter(
    (complaint) => complaint.isOverdue || complaint.slaRemainingMinutes < 0
  ).length;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
              Citizen Grievance Redressal
            </span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight mt-0.5">
            Complaint & SLA Management
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Track citizen-reported overflows, foul odour, bin damage, and enforce municipal service level agreements (SLAs).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 font-bold">
            {overdueCount} SLA Breaches
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
            {countByStatus('Resolved')} Resolved
          </span>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-neutral-200/90 text-left">
          <span className="text-[11px] text-neutral-500 font-medium">New Unassigned</span>
          <div className="text-xl font-bold font-mono text-neutral-900 mt-0.5">{countByStatus('New')}</div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-neutral-200/90 text-left">
          <span className="text-[11px] text-neutral-500 font-medium">Assigned</span>
          <div className="text-xl font-bold font-mono text-neutral-900 mt-0.5">{countByStatus('Assigned')}</div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-neutral-200/90 text-left">
          <span className="text-[11px] text-neutral-500 font-medium">In Progress</span>
          <div className="text-xl font-bold font-mono text-neutral-900 mt-0.5">{countByStatus('In Progress')}</div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-rose-200 bg-rose-50/30 text-left">
          <span className="text-[11px] text-rose-700 font-bold">Escalated</span>
          <div className="text-xl font-bold font-mono text-rose-700 mt-0.5">{countByStatus('Escalated')}</div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-neutral-200/90 text-left">
          <span className="text-[11px] text-emerald-700 font-medium">Resolved Today</span>
          <div className="text-xl font-bold font-mono text-emerald-700 mt-0.5">{countByStatus('Resolved')}</div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-rose-300 bg-rose-100/50 text-left">
          <span className="text-[11px] text-rose-800 font-bold">Overdue SLA</span>
          <div className="text-xl font-bold font-mono text-rose-800 mt-0.5">{overdueCount}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search complaint ID, bin, location, or citizen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-2 font-medium text-neutral-700 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Escalated">Escalated</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-2 font-medium text-neutral-700 focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Overflow">Overflow</option>
            <option value="Bad Odour">Bad Odour</option>
            <option value="Spillage">Spillage</option>
            <option value="Pest Infestation">Pest Infestation</option>
            <option value="Damaged Bin">Damaged Bin</option>
          </select>
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-2xl p-8 text-center text-sm text-neutral-500">
            No complaint records.
          </div>
        ) : filtered.map((cmp) => {
          const isOverdue = cmp.isOverdue || cmp.slaRemainingMinutes < 0;

          return (
            <div
              key={cmp.id}
              className={`p-4 rounded-xl border transition-all ${
                isOverdue
                  ? 'bg-rose-50/30 border-rose-200 shadow-xs ring-1 ring-rose-500/20'
                  : 'bg-white border-neutral-200/80 hover:border-neutral-300'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                      {cmp.id}
                    </span>
                    <span className="text-sm font-bold text-neutral-900">{cmp.category}</span>
                    <span className="text-neutral-400">·</span>
                    <span className="font-mono text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {cmp.binId} ({cmp.binName})
                    </span>

                    {isOverdue ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-rose-600 text-white animate-pulse">
                        SLA OVERDUE: {Math.abs(Math.floor(cmp.slaRemainingMinutes / 60))}h {Math.abs(cmp.slaRemainingMinutes % 60)}m
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-neutral-100 text-neutral-700 border border-neutral-200">
                        SLA: {Math.floor(cmp.slaRemainingMinutes / 60)}h {cmp.slaRemainingMinutes % 60}m left
                      </span>
                    )}

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      cmp.status === 'Escalated'
                        ? 'bg-rose-100 text-rose-800'
                        : cmp.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {cmp.status}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                    "{cmp.description}"
                  </p>

                  <div className="flex items-center gap-4 text-xs text-neutral-500 font-mono flex-wrap pt-1">
                    <span>Reported by: <span className="text-neutral-800 font-semibold">{cmp.citizenName}</span> ({cmp.citizenPhone})</span>
                    <span>·</span>
                    <span>Submitted: {cmp.submittedTime}</span>
                    <span>·</span>
                    <span>Team: <span className="text-neutral-800 font-semibold">{cmp.assignedTeam || 'Unassigned'}</span></span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {cmp.photoUrl && (
                    <button
                      onClick={() => setViewProofModal(cmp)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg border border-neutral-200 flex items-center gap-1"
                    >
                      <Camera className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Photo</span>
                    </button>
                  )}

                  {isOverdue && cmp.status !== 'Resolved' && (
                    <button
                      onClick={() => onEscalateComplaint(cmp.id)}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Escalate</span>
                    </button>
                  )}

                  {cmp.status !== 'Resolved' && (
                    <>
                      <button
                        onClick={() => onAssignComplaint(cmp)}
                        className="px-3 py-1.5 text-xs font-bold text-teal-950 bg-teal-400 hover:bg-teal-300 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Assign</span>
                      </button>

                      <button
                        onClick={() => onResolveComplaint(cmp.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg border border-emerald-300 transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolve</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Photo Modal */}
      {viewProofModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 space-y-3 border border-neutral-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <span className="font-bold text-xs text-neutral-900">{viewProofModal.id} · Attached Photo</span>
              <button onClick={() => setViewProofModal(null)} className="p-1 text-neutral-400 hover:text-neutral-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <img src={viewProofModal.photoUrl} alt="Citizen proof" className="w-full h-56 object-cover rounded-xl border border-neutral-200" />
            <p className="text-xs text-neutral-600 font-sans">{viewProofModal.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};
