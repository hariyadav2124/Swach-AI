import React from 'react';
import { ArrowRight, Route as RouteIcon } from 'lucide-react';
import { AdminRoute, AdminWorker } from '../../types/admin';

interface AdminCollectionViewProps {
  routes: AdminRoute[];
  workers: AdminWorker[];
  onViewRoute: (route: AdminRoute) => void;
}

export const AdminCollectionView: React.FC<AdminCollectionViewProps> = ({
  routes,
  workers,
  onViewRoute,
}) => {
  const collectionRoutes = routes.filter((route) => route.type === 'Collection');
  const collectionWorkers = workers.filter((worker) => worker.role === 'Collection Worker');
  const totalBins = collectionRoutes.reduce((sum, route) => sum + route.totalBins, 0);
  const completedBins = collectionRoutes.reduce((sum, route) => sum + route.completedBins, 0);
  const criticalBins = collectionRoutes.reduce((sum, route) => sum + route.criticalBins, 0);

  const metrics = [
    { label: 'Collection Routes', value: collectionRoutes.length },
    { label: 'Bins Completed', value: `${completedBins} / ${totalBins}` },
    { label: 'Critical Bins', value: criticalBins },
    { label: 'Collection Workers', value: collectionWorkers.length },
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="border-b border-neutral-200/80 pb-4">
        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
          Waste Logistics Operations
        </span>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight mt-0.5">
          Collection Operations
        </h1>
        <p className="text-xs text-neutral-500 mt-1">Current collection routes and their recorded progress.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-white p-4 rounded-xl border border-neutral-200/90">
            <span className="text-xs text-neutral-500 font-medium">{metric.label}</span>
            <div className="text-2xl font-bold font-mono text-neutral-900 mt-1">{metric.value}</div>
          </div>
        ))}
      </div>

      <section className="bg-white rounded-2xl border border-neutral-200/90 p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
          <RouteIcon className="w-4 h-4 text-emerald-700" />
          <h2 className="text-sm font-bold text-neutral-900">Collection Routes</h2>
        </div>
        {collectionRoutes.length === 0 ? (
          <p className="text-sm text-neutral-500 py-4">No collection route records.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {collectionRoutes.map((route) => {
              const progress = route.totalBins > 0
                ? Math.round((route.completedBins / route.totalBins) * 100)
                : 0;
              return (
                <button
                  key={route.id}
                  onClick={() => onViewRoute(route)}
                  className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-left hover:border-neutral-300 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-neutral-900">{route.id}</span>
                    <span className="text-[10px] font-semibold text-neutral-600">{route.status}</span>
                  </div>
                  <div>
                    <div className="font-bold text-sm text-neutral-900">{route.name}</div>
                    <div className="text-xs text-neutral-500 mt-1">
                      {route.workerName} · {route.assignedTruck}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-600">
                    <span>{route.completedBins} / {route.totalBins} bins</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-xs text-teal-700 font-semibold flex items-center gap-1">
                    View route <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
