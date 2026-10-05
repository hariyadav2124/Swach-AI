import React from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Truck, 
  Sparkles, 
  MessageSquare, 
  ShieldCheck, 
  Layers,
  ArrowRight,
  UserPlus,
  Compass
} from 'lucide-react';
import { AdminBin } from '../../types/admin';

interface AdminBinDetailPanelProps {
  bin: AdminBin;
  onClose: () => void;
  onAssignTask: (bin: AdminBin) => void;
  onViewRoute?: (bin: AdminBin) => void;
}

export const AdminBinDetailPanel: React.FC<AdminBinDetailPanelProps> = ({
  bin,
  onClose,
  onAssignTask,
  onViewRoute,
}) => {
  const isCritical = bin.status === 'critical' || bin.currentFill >= 85;

  return (
    <aside className="w-full lg:w-96 bg-white border-l border-neutral-200/90 flex flex-col h-full overflow-y-auto shadow-xl z-30 animate-in slide-in-from-right duration-150">
      {/* Header */}
      <div className="p-4 border-b border-neutral-100 flex items-start justify-between bg-neutral-50/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-neutral-900 bg-white px-2 py-0.5 rounded border border-neutral-200 shadow-2xs">
              {bin.id}
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
              isCritical
                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                : bin.status === 'filling'
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}>
              {bin.status}
            </span>
          </div>
          <h2 className="text-base font-bold text-neutral-900 mt-1">{bin.name}</h2>
          <div className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{bin.locationDescription}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
          title="Close panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-5 flex-1">
        {/* Fill Level Status Block */}
        <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-medium text-neutral-500">Current Fill Level</span>
            <span className={`text-2xl font-bold font-mono ${
              isCritical ? 'text-rose-600' : bin.currentFill >= 70 ? 'text-amber-600' : 'text-emerald-700'
            }`}>
              {bin.currentFill}%
            </span>
          </div>

          <div className="w-full bg-neutral-200 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isCritical ? 'bg-rose-500' : bin.currentFill >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${bin.currentFill}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 border-t border-neutral-200/60">
            <span>Capacity: {bin.capacityLitres} Litres</span>
            <span className="flex items-center gap-1 font-mono text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Sensor {bin.sensorHealth}
            </span>
          </div>
        </div>

        {/* Predictive Intelligence Card */}
        <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900">
              <Sparkles className="w-3.5 h-3.5 text-teal-700" />
              <span>PREDICTIVE FORECAST</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-semibold border border-teal-300">
              {bin.confidence} Confidence
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-600">Predicted Overflow:</span>
            <span className="text-xs font-bold text-rose-700 bg-white px-2 py-0.5 rounded border border-rose-200 font-mono">
              {bin.predictedCriticalIn}
            </span>
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed bg-white/70 p-2.5 rounded-lg border border-teal-100">
            "{bin.predictionReason}"
          </p>

          <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
            <div className="bg-white p-2 rounded-lg border border-neutral-200">
              <span className="text-[10px] text-neutral-400 block font-mono">EST. IN 6H</span>
              <span className="font-bold text-neutral-900 font-mono">{bin.predictedFillNext6h}%</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-neutral-200">
              <span className="text-[10px] text-neutral-400 block font-mono">EST. IN 12H</span>
              <span className="font-bold text-rose-600 font-mono">{bin.predictedFillNext12h}%</span>
            </div>
          </div>
        </div>

        {/* Operational Timings & Assignment */}
        <div className="space-y-2 text-xs">
          <div className="text-[10px] font-mono uppercase font-bold text-neutral-400">Field Operations</div>

          <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
            <div className="flex items-center gap-2 text-neutral-600">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>Last Collection:</span>
            </div>
            <span className="font-semibold text-neutral-900">{bin.lastCollectionTime}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
            <div className="flex items-center gap-2 text-neutral-600">
              <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
              <span>Last Sanitization:</span>
            </div>
            <span className="font-semibold text-neutral-900">{bin.lastSanitationTime}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
            <div className="flex items-center gap-2 text-neutral-600">
              <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
              <span>Citizen Complaints:</span>
            </div>
            <span className={`font-bold font-mono px-2 py-0.5 rounded text-xs ${
              bin.activeComplaintsCount > 0 ? 'bg-amber-100 text-amber-800' : 'text-neutral-500'
            }`}>
              {bin.activeComplaintsCount} active
            </span>
          </div>

          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1">
            <span className="text-[10px] text-neutral-400 uppercase font-mono block">Current Assignment</span>
            <div className="font-bold text-neutral-900">{bin.assignedTeam || 'Unassigned'}</div>
            {bin.assignedWorker && (
              <div className="text-xs text-neutral-500 flex items-center gap-1 font-mono">
                <Truck className="w-3 h-3 text-neutral-400" />
                {bin.assignedWorker}
              </div>
            )}
          </div>
        </div>

        {/* 24-Hour Fill Pattern */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold text-neutral-400">
            <span>24-Hour Fill Trend</span>
            <span className="text-neutral-400">Today</span>
          </div>
          <div className="flex items-end gap-2 h-20 pt-4 px-2 bg-neutral-50 rounded-xl border border-neutral-200">
            {bin.dailyFillTrend.map((point, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div
                  className={`w-full rounded-t transition-all ${
                    point.fill >= 85 ? 'bg-rose-500' : point.fill >= 70 ? 'bg-amber-400' : 'bg-teal-500'
                  }`}
                  style={{ height: `${(point.fill / 100) * 48}px` }}
                  title={`${point.hour}: ${point.fill}%`}
                ></div>
                <span className="text-[9px] font-mono text-neutral-400">{point.hour}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-neutral-200 bg-white space-y-2">
        <button
          onClick={() => onAssignTask(bin)}
          className="w-full min-h-[44px] py-2.5 px-4 text-xs font-bold text-neutral-950 bg-teal-400 hover:bg-teal-300 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Assign Urgent Collection / Cleaning</span>
        </button>

        {onViewRoute && (
          <button
            onClick={() => onViewRoute(bin)}
            className="w-full py-2 px-4 text-xs font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl border border-neutral-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-neutral-500" />
            <span>Locate on Active Route</span>
          </button>
        )}
      </div>
    </aside>
  );
};
