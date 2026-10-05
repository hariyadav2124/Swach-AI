import React from 'react';
import { AdminBin } from '../../types/admin';

interface AdminPredictionsViewProps {
  bins: AdminBin[];
  onAssignBin: (bin: AdminBin) => void;
}

export const AdminPredictionsView: React.FC<AdminPredictionsViewProps> = ({
  bins,
  onAssignBin,
}) => {
  const forecasts = [...bins]
    .filter((bin) => bin.predictedFillNext12h >= 90)
    .sort((a, b) => b.predictedFillNext12h - a.predictedFillNext12h);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="border-b border-neutral-200/80 pb-4">
        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
          Capacity Forecasts
        </span>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight mt-0.5">
          Predictive Operations
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Forecasts will appear when bin telemetry is available.
        </p>
      </div>

      <section className="bg-white rounded-2xl border border-neutral-200/90 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <h2 className="text-sm font-bold text-neutral-900">Bins predicted to reach high capacity</h2>
          <span className="text-xs font-mono text-neutral-500">{forecasts.length} records</span>
        </div>
        {forecasts.length === 0 ? (
          <p className="text-sm text-neutral-500 py-4">No forecast records available.</p>
        ) : (
          <div className="space-y-3">
            {forecasts.map((bin) => (
              <div
                key={bin.id}
                className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-neutral-900">{bin.id}</span>
                    <span className="font-bold text-neutral-900 text-sm">{bin.name}</span>
                  </div>
                  <div className="text-xs text-neutral-600">
                    Current fill: {bin.currentFill}% · Predicted in 6h: {bin.predictedFillNext6h}% ·
                    {' '}Predicted in 12h: {bin.predictedFillNext12h}%
                  </div>
                  <p className="text-xs text-neutral-500">{bin.predictionReason}</p>
                </div>
                <button
                  onClick={() => onAssignBin(bin)}
                  className="px-3 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg"
                >
                  Assign worker
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
