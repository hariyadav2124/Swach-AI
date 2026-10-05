import React from 'react';
import { ArrowRight, CheckCircle2, MapPin, Navigation, Truck } from 'lucide-react';
import { RouteStop, WorkerProfile, WorkerTab } from '../../types/worker';

interface WorkerDashboardProps {
  stops: RouteStop[];
  workerProfile: WorkerProfile;
  setCurrentTab: (tab: WorkerTab) => void;
  onSelectStop: (stop: RouteStop) => void;
  onStartCollection: (stop: RouteStop) => void;
  onNavigateToStop: (stop: RouteStop) => void;
  onOpenDetails: (stop: RouteStop) => void;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({
  stops,
  workerProfile,
  setCurrentTab,
  onSelectStop,
  onStartCollection,
  onNavigateToStop,
  onOpenDetails,
}) => {
  const completedStops = stops.filter((stop) => stop.status === 'completed');
  const pendingStops = stops.filter((stop) => stop.status === 'pending' || stop.status === 'in_progress');
  const criticalStops = pendingStops.filter((stop) => stop.urgency === 'critical' || stop.estimatedFill >= 85);
  const totalDistanceKm = stops.reduce((sum, stop) => sum + stop.distanceMeters, 0) / 1000;
  const remainingDistanceKm = pendingStops.reduce((sum, stop) => sum + stop.distanceMeters, 0) / 1000;
  const progressPercent = stops.length > 0 ? Math.round((completedStops.length / stops.length) * 100) : 0;
  const nextStop = pendingStops[0];

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
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-neutral-600">
            <span>{workerProfile.zone}</span>
            <span>·</span>
            <span>Vehicle {workerProfile.vehicle}</span>
          </div>
        </div>
        <button
          onClick={() => setCurrentTab('route')}
          className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg flex items-center justify-center gap-2"
        >
          <Truck className="w-4 h-4" /> Open Route <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>

      <section className="bg-white border border-neutral-200/90 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-neutral-900">Collection Progress</h2>
            <p className="text-xs text-neutral-500 mt-1">
              {completedStops.length} of {stops.length} stops completed ({progressPercent}%)
            </p>
          </div>
          <div className="text-xs text-neutral-600">
            {pendingStops.length} pending · {remainingDistanceKm.toFixed(1)} km remaining
          </div>
        </div>
        <div className="w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden">
          <div className="h-full bg-emerald-600 transition-all" style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-neutral-50"><span className="text-neutral-500">Assigned stops</span><div className="font-mono font-bold mt-1">{stops.length}</div></div>
          <div className="p-3 rounded-lg bg-neutral-50"><span className="text-neutral-500">Completed</span><div className="font-mono font-bold mt-1">{completedStops.length}</div></div>
          <div className="p-3 rounded-lg bg-neutral-50"><span className="text-neutral-500">Critical</span><div className="font-mono font-bold mt-1">{criticalStops.length}</div></div>
          <div className="p-3 rounded-lg bg-neutral-50"><span className="text-neutral-500">Route distance</span><div className="font-mono font-bold mt-1">{totalDistanceKm.toFixed(1)} km</div></div>
        </div>
      </section>

      {criticalStops.length > 0 && (
        <section className="bg-rose-50 border border-rose-200 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-rose-900">Priority Stops</h2>
          <div className="mt-3 space-y-2">
            {criticalStops.map((stop) => (
              <button
                key={stop.id}
                onClick={() => {
                  onSelectStop(stop);
                  setCurrentTab('route');
                }}
                className="w-full bg-white border border-rose-200 rounded-xl p-3 text-left flex items-center justify-between gap-3"
              >
                <span>
                  <span className="font-mono text-xs font-bold">{stop.binId}</span>
                  <span className="text-xs font-semibold ml-2">{stop.name}</span>
                </span>
                <span className="text-xs font-mono text-rose-700">{stop.estimatedFill}% full</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {nextStop && (
        <section className="bg-neutral-900 text-white rounded-2xl p-5 space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-emerald-400">Next assigned stop</div>
          <div>
            <h2 className="font-bold">{nextStop.binId} · {nextStop.name}</h2>
            <p className="text-xs text-neutral-300 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {nextStop.locationDescription}
            </p>
            <p className="text-xs text-neutral-300 mt-2">{nextStop.priorityReason}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => onStartCollection(nextStop)} className="px-4 py-2 text-xs font-bold bg-emerald-400 text-neutral-950 rounded-lg flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Start collection
            </button>
            <button onClick={() => onNavigateToStop(nextStop)} className="px-4 py-2 text-xs font-semibold bg-neutral-800 rounded-lg flex items-center gap-1">
              <Navigation className="w-4 h-4" /> Navigate
            </button>
            <button onClick={() => onOpenDetails(nextStop)} className="px-4 py-2 text-xs font-semibold bg-neutral-800 rounded-lg">
              View details
            </button>
          </div>
        </section>
      )}

      <section className="bg-white border border-neutral-200/90 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-neutral-900">Assigned Stops</h2>
          <button onClick={() => setCurrentTab('route')} className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            View route <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        {pendingStops.length === 0 ? (
          <p className="text-sm text-neutral-500 py-3">No assigned collection stops.</p>
        ) : (
          pendingStops.slice(0, 4).map((stop) => (
            <button
              key={stop.id}
              onClick={() => {
                onSelectStop(stop);
                setCurrentTab('route');
              }}
              className="w-full flex items-center justify-between gap-3 border-t border-neutral-100 pt-3 text-left"
            >
              <span className="text-xs">
                <strong className="font-mono">{stop.binId}</strong> · {stop.name}
              </span>
              <span className="text-xs text-neutral-500">{stop.status}</span>
            </button>
          ))
        )}
      </section>
    </div>
  );
};
