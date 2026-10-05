import React, { useState } from 'react';
import { 
  ClipboardList, 
  AlertCircle, 
  Sparkles, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  Activity, 
  X, 
  MapPin, 
  ChevronRight, 
  Upload, 
  MessageSquare, 
  RotateCcw,
  Check,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { CitizenRequest, LanguageCode, AppTab } from '../types';
import { translations } from '../translations';

interface MyRequestsViewProps {
  requests: CitizenRequest[];
  onUpdateRequest: (updated: CitizenRequest) => void;
  setCurrentTab: (tab: AppTab) => void;
  language: LanguageCode;
}

export const MyRequestsView: React.FC<MyRequestsViewProps> = ({
  requests,
  onUpdateRequest,
  setCurrentTab,
  language,
}) => {
  const t = translations[language];

  const [activeFilter, setActiveFilter] = useState<'all' | 'complaints' | 'cleaning' | 'new_bin'>('all');
  const [selectedRequest, setSelectedRequest] = useState<CitizenRequest | null>(null);
  const [supplementaryText, setSupplementaryText] = useState<string>('');
  const [showAddInfoModal, setShowAddInfoModal] = useState<boolean>(false);
  const [reopenFeedback, setReopenFeedback] = useState<string>('');
  const [showReopenModal, setShowReopenModal] = useState<boolean>(false);

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    if (activeFilter === 'complaints') return r.type === 'complaint';
    if (activeFilter === 'cleaning') return r.type === 'cleaning';
    if (activeFilter === 'new_bin') return r.type === 'new_bin';
    return true;
  });

  const getStatusBadge = (status: CitizenRequest['status']) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Resolved
          </span>
        );
      case 'assigned':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            Assigned
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
            <Activity className="w-3.5 h-3.5 text-purple-600" />
            In Progress
          </span>
        );
      case 'escalated':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Escalated
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
            <X className="w-3.5 h-3.5 text-rose-600" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-700 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded">
            <Clock className="w-3.5 h-3.5 text-neutral-500" />
            Submitted
          </span>
        );
    }
  };

  const getTypeIcon = (type: CitizenRequest['type']) => {
    switch (type) {
      case 'complaint':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      case 'cleaning':
        return <Sparkles className="w-4 h-4 text-teal-600" />;
      case 'new_bin':
        return <PlusCircle className="w-4 h-4 text-neutral-800" />;
    }
  };

  // Citizen confirms resolution
  const handleConfirmResolution = (req: CitizenRequest) => {
    const updated: CitizenRequest = {
      ...req,
      citizenConfirmed: true,
      updatedAt: 'Just now (Confirmed by Citizen)',
    };
    onUpdateRequest(updated);
    setSelectedRequest(updated);
  };

  // Citizen adds information
  const handleAddInformation = () => {
    if (!selectedRequest || !supplementaryText.trim()) return;

    const updated: CitizenRequest = {
      ...selectedRequest,
      description: `${selectedRequest.description}\n\n[Citizen Update]: ${supplementaryText.trim()}`,
      updatedAt: 'Just now',
    };
    onUpdateRequest(updated);
    setSelectedRequest(updated);
    setSupplementaryText('');
    setShowAddInfoModal(false);
  };

  // Citizen reopens issue
  const handleReopenIssue = () => {
    if (!selectedRequest || !reopenFeedback.trim()) return;

    const updated: CitizenRequest = {
      ...selectedRequest,
      status: 'escalated',
      description: `${selectedRequest.description}\n\n[Citizen Reopened Issue]: ${reopenFeedback.trim()}`,
      updatedAt: 'Just now (Escalated to Zonal Commissioner)',
      timeline: [
        ...selectedRequest.timeline,
        {
          title: 'Citizen Reported Issue Persists',
          time: 'Just now',
          note: `Reopened reason: ${reopenFeedback.trim()}`,
          done: true,
        },
        {
          title: 'Escalated to Zonal Sanitation Officer',
          time: 'Urgent priority',
          note: 'Re-inspection scheduled with priority team',
          done: false,
        },
      ],
    };

    onUpdateRequest(updated);
    setSelectedRequest(updated);
    setReopenFeedback('');
    setShowReopenModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-neutral-200/70 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            My Civic Requests & Complaints
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Track real-time progress, municipal worker dispatch, and SLA resolution times
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg border border-neutral-200/80 self-start sm:self-center overflow-x-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeFilter === 'all'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {t.all} ({requests.length})
          </button>
          <button
            onClick={() => setActiveFilter('complaints')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeFilter === 'complaints'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {t.complaints}
          </button>
          <button
            onClick={() => setActiveFilter('cleaning')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeFilter === 'cleaning'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {t.cleaning}
          </button>
          <button
            onClick={() => setActiveFilter('new_bin')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeFilter === 'new_bin'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {t.newBin}
          </button>
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-12 text-center space-y-3">
          <ClipboardList className="w-12 h-12 text-neutral-300 mx-auto" />
          <h3 className="text-sm font-bold text-neutral-800">
            No requests found in this category
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            You currently have no active or historical municipal requests under this filter.
          </p>
          <button
            onClick={() => setActiveFilter('all')}
            className="mt-2 px-4 py-2 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg"
          >
            Show All Requests
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              onClick={() => setSelectedRequest(req)}
              className="bg-white border border-neutral-200/90 hover:border-neutral-300 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-xs cursor-pointer group"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-neutral-200 transition-colors">
                  {getTypeIcon(req.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900 text-sm group-hover:text-emerald-800 transition-colors">
                      {req.title}
                    </span>
                    <span className="font-mono text-xs text-neutral-400">
                      {req.id}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      {req.location}
                    </span>
                    <span>·</span>
                    <span>Submitted: {req.submittedAt}</span>
                    <span>·</span>
                    <span className="text-neutral-700 font-medium">Updated: {req.updatedAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-center border-t sm:border-t-0 pt-2.5 sm:pt-0 border-neutral-100">
                {getStatusBadge(req.status)}
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Timeline Drawer / Modal for Selected Request */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-neutral-100 flex items-center justify-between z-10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-neutral-500">{selectedRequest.id}</span>
                  <span className="text-neutral-300">·</span>
                  {getStatusBadge(selectedRequest.status)}
                </div>
                <h2 className="text-base font-bold text-neutral-900 mt-1">{selectedRequest.title}</h2>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-neutral-400 hover:text-neutral-600 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Request Metadata */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Location:</span>
                  <span className="font-semibold text-neutral-900">{selectedRequest.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Submitted:</span>
                  <span className="font-medium text-neutral-800">{selectedRequest.submittedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Last Status Update:</span>
                  <span className="font-medium text-neutral-800">{selectedRequest.updatedAt}</span>
                </div>
                {selectedRequest.assignedWorker && (
                  <div className="pt-2 border-t border-neutral-200 flex flex-col gap-0.5">
                    <span className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider">
                      Municipal Assigned Team
                    </span>
                    <span className="font-semibold text-neutral-900">
                      {selectedRequest.assignedWorker.name} · {selectedRequest.assignedWorker.team}
                    </span>
                    <span className="font-mono text-[11px] text-neutral-600">
                      Vehicle: {selectedRequest.assignedWorker.vehicle}
                    </span>
                  </div>
                )}
              </div>

              {/* Description & Photo */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
                  Citizen Report Details
                </span>
                <p className="text-xs text-neutral-700 leading-relaxed bg-white p-3 rounded-lg border border-neutral-100">
                  {selectedRequest.description}
                </p>

                {selectedRequest.photoUrl && (
                  <div className="mt-2">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Attached Photo</span>
                    <div className="w-full h-40 rounded-xl overflow-hidden border border-neutral-200">
                      <img src={selectedRequest.photoUrl} alt="Evidence" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>

              {/* Detailed Real-Time Progress Timeline */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
                  Municipal Action Timeline
                </span>
                <div className="border-l-2 border-neutral-200 ml-3 space-y-4 pl-4 py-1">
                  {selectedRequest.timeline.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div
                        className={`absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full border-2 bg-white ${
                          step.done ? 'border-emerald-600 bg-emerald-600' : 'border-neutral-300'
                        }`}
                      ></div>
                      <div>
                        <div className="flex items-center justify-between text-xs">
                          <span className={`font-semibold ${step.done ? 'text-neutral-900' : 'text-neutral-400'}`}>
                            {step.title}
                          </span>
                          <span className="font-mono text-[11px] text-neutral-400">{step.time}</span>
                        </div>
                        {step.note && (
                          <p className="text-[11px] text-neutral-500 mt-0.5">
                            {step.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Citizen Actions / Confirmation */}
              <div className="pt-4 border-t border-neutral-100 flex flex-wrap gap-2.5 justify-between">
                <button
                  onClick={() => setShowAddInfoModal(true)}
                  className="px-3.5 py-2 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Add Information</span>
                </button>

                {selectedRequest.status === 'resolved' && !selectedRequest.citizenConfirmed && (
                  <button
                    onClick={() => handleConfirmResolution(selectedRequest)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirm Resolution</span>
                  </button>
                )}

                {selectedRequest.status === 'resolved' && (
                  <button
                    onClick={() => setShowReopenModal(true)}
                    className="px-3.5 py-2 text-xs font-medium text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Issue Unresolved? Reopen</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Info Modal */}
      {showAddInfoModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-neutral-900 text-sm">
              Add Supplementary Information
            </h3>
            <p className="text-xs text-neutral-500">
              Provide extra landmark directions, timing details, or changes in waste situation.
            </p>
            <textarea
              rows={3}
              value={supplementaryText}
              onChange={(e) => setSupplementaryText(e.target.value)}
              placeholder="e.g. Stray cattle have overturned one carton, please prioritize."
              className="w-full text-xs p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddInfoModal(false)}
                className="px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddInformation}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md"
              >
                Save Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reopen / Unresolved Modal */}
      {showReopenModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-neutral-900 text-sm">
              Reopen Complaint & Escalate
            </h3>
            <p className="text-xs text-neutral-500">
              If the problem was not satisfactorily rectified, this complaint will be escalated directly to the SAS Nagar Zonal Sanitary Officer.
            </p>
            <textarea
              rows={3}
              value={reopenFeedback}
              onChange={(e) => setReopenFeedback(e.target.value)}
              placeholder="e.g. Only the inner bin was lifted; spillage and bottles on the pavement were left behind..."
              className="w-full text-xs p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              required
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowReopenModal(false)}
                className="px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleReopenIssue}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-md"
              >
                Escalate Complaint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
