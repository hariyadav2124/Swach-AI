import React from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Navigation, 
  Activity, 
  Scale, 
  TrendingUp, 
  AlertCircle,
  Radio,
  Calendar
} from 'lucide-react';
import { RouteStop } from '../../types/worker';

interface WorkerBinDetailsModalProps {
  stop: RouteStop;
  onClose: () => void;
  onStartCollection: (stop: RouteStop) => void;
  onReportProblem: (stop: RouteStop) => void;
}

export const WorkerBinDetailsModal: React.FC<WorkerBinDetailsModalProps> = ({
  stop,
  onClose,
  onStartCollection,
  onReportProblem,
}) => {
  // SVG 24-Hour Sparkline Chart Calculations
  const history = stop.fillHistory24h || [];
  const maxFill = 100;
  const chartWidth = 420;
  const chartHeight = 120;
  const paddingX = 25;
  const paddingY = 15;

  const points = history.map((item, index) => {
    const x = paddingX + (index / (history.length - 1 || 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (item.fill / maxFill) * (chartHeight - paddingY * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-neutral-100 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                {stop.binId}
              </span>
              <span className="text-neutral-300">·</span>
              <span className="text-xs font-semibold text-neutral-600">
                Stop #{stop.order} in Route
              </span>
            </div>
            <h2 className="text-base font-bold text-neutral-900 mt-1">{stop.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Location */}
          <div className="flex items-start gap-2.5 text-xs text-neutral-600 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/80">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-neutral-900">{stop.locationDescription}</div>
              <div className="text-neutral-500 mt-0.5">{stop.sector} · Coordinates: {stop.coordinates[0].toFixed(4)}, {stop.coordinates[1].toFixed(4)}</div>
            </div>
          </div>

          {/* Core Telemetry Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="text-[10px] uppercase font-bold text-neutral-400">Current Fill</div>
              <div className="font-mono text-xl font-black text-rose-600 mt-0.5">{stop.estimatedFill}%</div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="text-[10px] uppercase font-bold text-neutral-400">Capacity</div>
              <div className="font-mono text-xl font-bold text-neutral-800 mt-0.5">{stop.capacityKg} kg</div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="text-[10px] uppercase font-bold text-neutral-400">Avg Accumulation</div>
              <div className="font-mono text-base font-bold text-neutral-800 mt-1">~{stop.historicalRateKgPerHour} kg/h</div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="text-[10px] uppercase font-bold text-neutral-400">Citizen Reports</div>
              <div className="font-mono text-xl font-bold text-neutral-800 mt-0.5">{stop.recentCitizenReports}</div>
            </div>
          </div>

          {/* Historical Fill Chart (Last 24 Hours) */}
          <div className="border border-neutral-200/90 rounded-xl p-4 bg-white space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-neutral-900">
                Fill Level over the last 24 Hours
              </span>
              <span className="text-[11px] text-neutral-400 font-mono">Ultrasonic radar telemetry</span>
            </div>

            {history.length > 0 ? (
              <div className="w-full overflow-x-auto pt-2">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-28">
                  {/* Horizontal grid guide */}
                  <line x1={paddingX} y1={chartHeight - paddingY - 80} x2={chartWidth - paddingX} y2={chartHeight - paddingY - 80} stroke="#f3f4f6" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1={paddingX} y1={chartHeight - paddingY - 40} x2={chartWidth - paddingX} y2={chartHeight - paddingY - 40} stroke="#f3f4f6" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="#e5e7eb" strokeWidth="1" />

                  {/* Gradient area */}
                  <defs>
                    <linearGradient id="fillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#e11d48" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#e11d48" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Area */}
                  <polygon
                    points={`${points} ${chartWidth - paddingX},${chartHeight - paddingY} ${paddingX},${chartHeight - paddingY}`}
                    fill="url(#fillGrad)"
                  />

                  {/* Polyline */}
                  <polyline
                    fill="none"
                    stroke="#e11d48"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                  />

                  {/* Points & Hour Labels */}
                  {history.map((item, idx) => {
                    const x = paddingX + (idx / (history.length - 1 || 1)) * (chartWidth - paddingX * 2);
                    const y = chartHeight - paddingY - (item.fill / maxFill) * (chartHeight - paddingY * 2);
                    return (
                      <g key={idx}>
                        <circle cx={x} cy={y} r="3.5" fill="#e11d48" stroke="white" strokeWidth="1.5" />
                        <text x={x} y={chartHeight - 2} textAnchor="middle" fontSize="9" fill="#9ca3af" fontFamily="monospace">
                          {item.hour}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-neutral-400">
                Telemetry log unavailable for completed stop.
              </div>
            )}
          </div>

          {/* Priority Explanation */}
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1">
            <div className="font-semibold text-neutral-900">
              Operational Priority Justification:
            </div>
            <p className="text-neutral-600 text-[11px] leading-relaxed">
              {stop.priorityReason}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap gap-2.5">
            {stop.status !== 'completed' && (
              <button
                onClick={() => {
                  onClose();
                  onStartCollection(stop);
                }}
                className="flex-1 min-h-[46px] px-5 py-2.5 text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-neutral-950" />
                <span>START COLLECTION</span>
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onReportProblem(stop);
              }}
              className="px-4 py-2.5 text-xs font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report Problem</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
