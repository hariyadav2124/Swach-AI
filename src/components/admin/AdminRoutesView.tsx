import React from 'react';
import { Route as RouteIcon } from 'lucide-react';
import { AdminRoute } from '../../types/admin';

interface AdminRoutesViewProps {
  routes: AdminRoute[];
}

export const AdminRoutesView: React.FC<AdminRoutesViewProps> = ({ routes }) => {
  const totalStops = routes.reduce((sum, route) => sum + route.totalBins, 0);
  const completedStops = routes.reduce((sum, route) => sum + route.completedBins, 0);
  const totalDistanceSaved = routes.reduce((sum, route) => sum + route.potentialSavedKm, 0);

  const metrics = [
    { label: 'Routes', value: routes.length },
    { label: 'Stops completed', value: `${completedStops} / ${totalStops}` },
    { label: 'Critical stops', value: routes.reduce((sum, route) => sum + route.criticalBins, 0) },
    { label: 'Recorded distance saved', value: `${totalDistanceSaved.toFixed(1)} km` },
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="border-b border-neutral-200/80 pb-4">
        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
          Dispatch
        </span>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight mt-0.5">
          Route Operations
        </h1>
        <p className="text-xs text-neutral-500 mt-1">Current route records and their recorded progress.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-white p-4 rounded-xl border border-neutral-200/90">
            <span className="text-xs text-neutral-500 font-medium">{metric.label}</span>
            <div className="text-xl font-bold font-mono text-neutral-900 mt-1">{metric.value}</div>
          </div>
        ))}
      </div>

      <section className="bg-white rounded-2xl border border-neutral-200/90 p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
          <RouteIcon className="w-4 h-4 text-teal-700" />
          <h2 className="text-sm font-bold text-neutral-900">Route Records</h2>
        </div>
        {routes.length === 0 ? (
          <p className="text-sm text-neutral-500 py-4">No route records.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routes.map((route) => {
              const progress = route.totalBins > 0
                ? Math.round((route.completedBins / route.totalBins) * 100)
                : 0;
              return (
                <article key={route.id} className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-neutral-500">{route.id}</span>
                      <h3 className="font-bold text-neutral-900 text-sm mt-0.5">{route.name}</h3>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-md font-bold uppercase bg-white border border-neutral-200">
                      {route.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-neutral-200">
                      <span className="text-neutral-500 block">Type & assigned team</span>
                      <span className="font-bold text-neutral-900 mt-1 block">{route.type} · {route.workerName}</span>
                      <span className="text-neutral-500">{route.assignedTruck}</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-neutral-200">
                      <span className="text-neutral-500 block">Distance</span>
                      <span className="font-bold text-neutral-900 mt-1 block">{route.optimizedDistanceKm} km optimized</span>
                      <span className="text-neutral-500">{route.totalDistanceKm} km recorded</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-600">
                    <span>{route.completedBins} / {route.totalBins} stops</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
