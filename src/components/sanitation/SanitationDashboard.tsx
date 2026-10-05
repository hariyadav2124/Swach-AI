import React from 'react';
import { ArrowRight, MapPin, Navigation, Sparkles } from 'lucide-react';
import { SanitationTask, SanitationWorkerProfile, SanitationTab } from '../../types/sanitation';

interface SanitationDashboardProps {
  tasks: SanitationTask[];
  workerProfile: SanitationWorkerProfile;
  setCurrentTab: (tab: SanitationTab) => void;
  onSelectTask: (task: SanitationTask) => void;
  onStartTask: (task: SanitationTask) => void;
  onOpenDetails: (task: SanitationTask) => void;
}

export const SanitationDashboard: React.FC<SanitationDashboardProps> = ({
  tasks,
  workerProfile,
  setCurrentTab,
  onSelectTask,
  onStartTask,
  onOpenDetails,
}) => {
  const completedTasks = tasks.filter((task) => task.status === 'completed');
  const pendingTasks = tasks.filter((task) => task.status === 'pending' || task.status === 'in_progress');
  const criticalTasks = pendingTasks.filter((task) => task.urgency === 'critical');
  const highRiskTasks = pendingTasks.filter((task) => task.urgency === 'high');
  const routeDistanceKm = tasks.reduce((sum, task) => sum + task.distanceMeters, 0) / 1000;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  const nextTask = pendingTasks[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <section className="bg-white border border-neutral-200/90 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider">
            {workerProfile.status} · {workerProfile.shift}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 mt-1">
            Welcome, {workerProfile.name}
          </h1>
          <p className="text-xs text-neutral-600 mt-1">{workerProfile.zone} · {workerProfile.team} · {workerProfile.vehicle}</p>
        </div>
        <button
          onClick={() => setCurrentTab('route')}
          className="px-5 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> Open Route <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>

      <section className="bg-white border border-neutral-200/90 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-neutral-900">Sanitation Progress</h2>
            <p className="text-xs text-neutral-500 mt-1">
              {completedTasks.length} of {tasks.length} tasks completed ({progressPercent}%)
            </p>
          </div>
          <div className="text-xs text-neutral-600">
            {pendingTasks.length} pending · {routeDistanceKm.toFixed(1)} km recorded
          </div>
        </div>
        <div className="w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden">
          <div className="h-full bg-teal-600 transition-all" style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-neutral-50"><span className="text-neutral-500">Assigned tasks</span><div className="font-mono font-bold mt-1">{tasks.length}</div></div>
          <div className="p-3 rounded-lg bg-neutral-50"><span className="text-neutral-500">Completed</span><div className="font-mono font-bold mt-1">{completedTasks.length}</div></div>
          <div className="p-3 rounded-lg bg-neutral-50"><span className="text-neutral-500">Critical</span><div className="font-mono font-bold mt-1">{criticalTasks.length}</div></div>
          <div className="p-3 rounded-lg bg-neutral-50"><span className="text-neutral-500">High risk</span><div className="font-mono font-bold mt-1">{highRiskTasks.length}</div></div>
        </div>
      </section>

      {nextTask && (
        <section className="bg-neutral-900 text-white rounded-2xl p-5 space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-teal-400">Next assigned task</div>
          <div>
            <h2 className="font-bold">{nextTask.binId} · {nextTask.name}</h2>
            <p className="text-xs text-neutral-300 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {nextTask.locationDescription}
            </p>
            <p className="text-xs text-neutral-300 mt-2">{nextTask.priorityReason}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => onStartTask(nextTask)} className="px-4 py-2 text-xs font-bold bg-teal-400 text-neutral-950 rounded-lg">
              Start task
            </button>
            <button
              onClick={() => {
                onSelectTask(nextTask);
                setCurrentTab('route');
              }}
              className="px-4 py-2 text-xs font-semibold bg-neutral-800 rounded-lg flex items-center gap-1"
            >
              <Navigation className="w-4 h-4" /> Navigate
            </button>
            <button onClick={() => onOpenDetails(nextTask)} className="px-4 py-2 text-xs font-semibold bg-neutral-800 rounded-lg">
              View details
            </button>
          </div>
        </section>
      )}

      <section className="bg-white border border-neutral-200/90 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-neutral-900">Assigned Tasks</h2>
          <button onClick={() => setCurrentTab('route')} className="text-xs text-teal-700 font-semibold flex items-center gap-1">
            View route <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        {pendingTasks.length === 0 ? (
          <p className="text-sm text-neutral-500 py-3">No assigned sanitation tasks.</p>
        ) : (
          pendingTasks.slice(0, 4).map((task) => (
            <button
              key={task.id}
              onClick={() => {
                onSelectTask(task);
                setCurrentTab('route');
              }}
              className="w-full flex items-center justify-between gap-3 border-t border-neutral-100 pt-3 text-left"
            >
              <span className="text-xs"><strong className="font-mono">{task.binId}</strong> · {task.name}</span>
              <span className="text-xs text-neutral-500">{task.status}</span>
            </button>
          ))
        )}
      </section>
    </div>
  );
};
