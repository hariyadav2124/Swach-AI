import React from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Droplets,
  Bug,
  MessageSquare
} from 'lucide-react';
import { SanitationTask } from '../../types/sanitation';

interface SanitationTaskDetailsModalProps {
  task: SanitationTask;
  onClose: () => void;
  onStartTask: (task: SanitationTask) => void;
  onReportProblem: (task: SanitationTask) => void;
}

export const SanitationTaskDetailsModal: React.FC<SanitationTaskDetailsModalProps> = ({
  task,
  onClose,
  onStartTask,
  onReportProblem,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-neutral-100 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                {task.binId}
              </span>
              <span className="text-neutral-300">·</span>
              <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Risk: {task.urgency.toUpperCase()}
              </span>
            </div>
            <h2 className="text-base font-bold text-neutral-900 mt-1">{task.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Issue Section */}
          <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2 text-xs">
            <div className="font-bold text-rose-950 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Reported Hygiene Issue</span>
            </div>
            <div className="font-semibold text-rose-900 text-sm">{task.primaryIssue}</div>
            <p className="text-rose-800 leading-relaxed">{task.priorityReason}</p>
            {task.citizenReportCount > 0 && (
              <div className="pt-1.5 border-t border-rose-200/80 font-bold text-rose-700 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{task.citizenReportCount} Verified Citizen Complaints</span>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="flex items-start gap-2.5 text-xs text-neutral-600 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
            <MapPin className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-neutral-900">{task.locationDescription}</div>
              <div className="text-neutral-500 mt-0.5">{task.sector} · Ward 14 · {task.distance} from Sanitation Van</div>
            </div>
          </div>

          {/* History */}
          <div className="border border-neutral-200 rounded-xl p-4 space-y-2 text-xs">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Sanitation History</span>
            <div className="flex justify-between">
              <span className="text-neutral-500">Last Sanitation:</span>
              <span className="font-bold text-neutral-800">{task.lastCleaned}</span>
            </div>
            {task.previousIssue && (
              <div className="flex justify-between">
                <span className="text-neutral-500">Previous Issue Logged:</span>
                <span className="font-medium text-neutral-800">{task.previousIssue}</span>
              </div>
            )}
          </div>

          {/* Recommended Actions */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
              Municipal Recommended Actions
            </span>
            <div className="space-y-1.5">
              {task.recommendedActions.map((action, idx) => (
                <div key={idx} className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-800 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap gap-2.5">
            {task.status !== 'completed' && (
              <button
                onClick={() => {
                  onClose();
                  onStartTask(task);
                }}
                className="flex-1 min-h-[46px] px-5 py-2.5 text-xs font-bold text-neutral-950 bg-teal-400 hover:bg-teal-300 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-neutral-950" />
                <span>START SANITATION TASK</span>
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onReportProblem(task);
              }}
              className="px-4 py-2.5 text-xs font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report Problem / Escalate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
