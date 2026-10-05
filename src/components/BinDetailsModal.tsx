import React from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  Navigation, 
  CheckCircle2, 
  Activity, 
  Battery, 
  Trash2, 
  Info,
  Calendar,
  Layers
} from 'lucide-react';
import { CommunityBin, LanguageCode } from '../types';
import { translations } from '../translations';

interface BinDetailsModalProps {
  bin: CommunityBin;
  onClose: () => void;
  onReportIssue: (bin: CommunityBin) => void;
  onRequestCleaning: (bin: CommunityBin) => void;
  onGetDirections: (bin: CommunityBin) => void;
  language: LanguageCode;
}

export const BinDetailsModal: React.FC<BinDetailsModalProps> = ({
  bin,
  onClose,
  onReportIssue,
  onRequestCleaning,
  onGetDirections,
  language,
}) => {
  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-neutral-100 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-neutral-900">{bin.id}</span>
              <span className="text-neutral-300">·</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                {bin.ward}
              </span>
            </div>
            <h2 className="text-base font-bold text-neutral-900 mt-0.5">{bin.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Location Description */}
          <div className="flex items-start gap-2.5 text-xs text-neutral-600 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-neutral-900">{bin.locationDescription}</div>
              <div className="text-neutral-500 mt-0.5">{bin.sector} · {bin.distanceMeters} meters from your detected location</div>
            </div>
          </div>

          {/* Current Estimated Fill Status */}
          <div className="border border-neutral-200/90 rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Current Estimated Status
              </span>
              <span className="font-mono text-2xl font-bold text-neutral-900">
                {bin.fillLevel}%
              </span>
            </div>

            {/* Gauge bar */}
            <div className="w-full bg-neutral-100 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  bin.fillLevel >= 85
                    ? 'bg-rose-600'
                    : bin.fillLevel >= 65
                    ? 'bg-amber-500'
                    : 'bg-emerald-600'
                }`}
                style={{ width: `${bin.fillLevel}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-neutral-100 text-center">
              <div>
                <div className="text-[10px] text-neutral-400 uppercase font-medium">Capacity</div>
                <div className="text-xs font-bold text-neutral-800 font-mono mt-0.5">{bin.capacityLiters} L</div>
              </div>
              <div>
                <div className="text-[10px] text-neutral-400 uppercase font-medium">Sensor Battery</div>
                <div className="text-xs font-bold text-neutral-800 font-mono mt-0.5 flex items-center justify-center gap-1">
                  <Battery className="w-3 h-3 text-emerald-600" />
                  {bin.sensorBattery}%
                </div>
              </div>
              <div>
                <div className="text-[10px] text-neutral-400 uppercase font-medium">Recent Reports</div>
                <div className="text-xs font-bold text-neutral-800 font-mono mt-0.5">{bin.activeReportsCount} active</div>
              </div>
            </div>
          </div>

          {/* Service History */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Service History
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1">
                  <Trash2 className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Last collection</span>
                </div>
                <div className="text-xs font-semibold text-neutral-900">
                  {bin.lastCollection}
                </div>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>Last cleaning</span>
                </div>
                <div className="text-xs font-semibold text-neutral-900">
                  {bin.lastCleaning}
                </div>
              </div>
            </div>
          </div>

          {/* Predictive Intelligence Callout */}
          <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-xl text-xs text-amber-950 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <Clock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Predictive Fill Intelligence</span>
            </div>
            <p className="text-amber-900/90 leading-relaxed">
              {bin.predictionReason || `Based on recent service patterns, this bin may reach critical level in approximately 6 hours.`}
            </p>
            <div className="text-[11px] text-amber-700 italic pt-1 border-t border-amber-200/60">
              * Note: Predictive information is an estimate calculated from historical sensor fill velocity and weather conditions.
            </div>
          </div>

          {/* Waste Streams Supported */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
              Supported Segregated Streams
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              {bin.binTypes.map((stream) => (
                <span
                  key={stream}
                  className="px-2.5 py-1 rounded-md font-medium capitalize bg-neutral-100 text-neutral-800 border border-neutral-200"
                >
                  {stream === 'dry' && '♻️ Dry / Recyclable (Blue)'}
                  {stream === 'wet' && '🍏 Wet / Organic (Green)'}
                  {stream === 'hazardous' && '⚠️ Domestic Hazardous (Red)'}
                  {stream === 'sanitary' && '🩹 Sanitary Waste'}
                </span>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() => {
                onClose();
                onGetDirections(bin);
              }}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onReportIssue(bin);
              }}
              className="px-4 py-2.5 text-xs font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Report Overflow</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onRequestCleaning(bin);
              }}
              className="px-4 py-2.5 text-xs font-semibold text-teal-800 hover:text-teal-950 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Request Cleaning</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
