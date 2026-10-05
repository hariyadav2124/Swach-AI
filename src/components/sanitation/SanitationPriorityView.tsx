import React from 'react';
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Info,
  Droplets,
  Bug,
  ShieldCheck
} from 'lucide-react';
import { SanitationTask } from '../../types/sanitation';

interface SanitationPriorityViewProps {
  tasks: SanitationTask[];
  onStartTask: (task: SanitationTask) => void;
  onOpenDetails: (task: SanitationTask) => void;
}

export const SanitationPriorityView: React.FC<SanitationPriorityViewProps> = ({
  tasks,
  onStartTask,
  onOpenDetails,
}) => {
  const priorityTasks = tasks
    .filter((t) => t.status !== 'completed' && (t.urgency === 'critical' || t.urgency === 'high' || t.citizenReportCount > 0))
    .sort((a, b) => b.citizenReportCount - a.citizenReportCount);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Title */}
      <div className="border-b border-neutral-200/70 pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-rose-700 font-bold">
            Municipal Hygiene Risk Engine
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 mt-1">
          Priority Sanitation Tasks
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Locations requiring attention based on hygiene risk, complaints, pest activity, and time elapsed since last cleaning.
        </p>
      </div>

      {/* Priority Logic Explanation Guide for VC Demonstration */}
      <div className="bg-neutral-900 text-white rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <h2 className="text-xs font-mono uppercase font-bold tracking-wider text-teal-400">
            How CivicWaste Prioritizes Sanitation Dispatch
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-3 bg-neutral-800/90 rounded-xl border border-neutral-700">
            <div className="font-bold text-rose-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              CRITICAL
            </div>
            <p className="text-[11px] text-neutral-300 mt-1">
              "Overflow cleanup + repeated odour complaints"
            </p>
          </div>

          <div className="p-3 bg-neutral-800/90 rounded-xl border border-neutral-700">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              HIGH
            </div>
            <p className="text-[11px] text-neutral-300 mt-1">
              "48 hours since last sanitation"
            </p>
          </div>

          <div className="p-3 bg-neutral-800/90 rounded-xl border border-neutral-700">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              HIGH
            </div>
            <p className="text-[11px] text-neutral-300 mt-1">
              "Pest / fly activity reported by citizens"
            </p>
          </div>

          <div className="p-3 bg-neutral-800/90 rounded-xl border border-neutral-700">
            <div className="font-bold text-teal-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              ROUTINE
            </div>
            <p className="text-[11px] text-neutral-300 mt-1">
              "Scheduled preventive disinfection"
            </p>
          </div>
        </div>
      </div>

      {/* Task Cards */}
      {priorityTasks.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-teal-500 mx-auto" />
          <h3 className="text-base font-bold text-neutral-900">
            All sanitation locations are currently within normal operating levels
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            No biohazard spillage, severe odour complaints, or pest infestations reported in Ward 14.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {priorityTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white border border-neutral-200/90 hover:border-neutral-300 rounded-2xl p-5 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group"
            >
              <div className="space-y-2.5 max-w-xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-base font-extrabold text-neutral-900">
                    {task.binId}
                  </span>
                  <span className="text-neutral-300">·</span>
                  <span className="font-semibold text-neutral-800 text-sm">
                    {task.name}
                  </span>
                  {task.urgency === 'critical' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-md">
                      <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                      CRITICAL HYGIENE RISK
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      HIGH RISK
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    {task.locationDescription}
                  </span>
                  <span>·</span>
                  <span className="font-mono font-medium text-neutral-800">
                    {task.distance} away
                  </span>
                </div>

                {/* Priority Justification Callout */}
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1">
                  <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>Priority Reason: {task.priorityCategory}</span>
                  </div>
                  <p className="text-neutral-600 text-[11px] leading-relaxed pl-5">
                    {task.priorityReason}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-4 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-neutral-100">
                <div className="text-left md:text-right">
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Last Cleaned</div>
                  <div className="text-xs font-bold text-neutral-800 mt-0.5">{task.lastCleaned}</div>
                  <div className="text-[11px] font-bold text-rose-600 mt-1">
                    {task.citizenReportCount} Citizen Complaints
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => onOpenDetails(task)}
                    className="flex-1 sm:flex-initial px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => onStartTask(task)}
                    className="flex-1 sm:flex-initial px-5 py-2 text-xs font-bold text-neutral-950 bg-teal-400 hover:bg-teal-300 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Start Task</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
