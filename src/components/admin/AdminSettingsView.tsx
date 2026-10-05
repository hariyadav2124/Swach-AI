import React, { useState } from 'react';
import { 
  Settings, 
  Sliders, 
  Bell, 
  MapPin, 
  ShieldCheck, 
  Check, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { ADMIN_PROFILE } from '../../data/mockAdminData';

export const AdminSettingsView: React.FC = () => {
  const [criticalThreshold, setCriticalThreshold] = useState<number>(85);
  const [fillingThreshold, setFillingThreshold] = useState<number>(70);
  const [autoDispatchEmergency, setAutoDispatchEmergency] = useState<boolean>(true);
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState<boolean>(true);
  const [savedToast, setSavedToast] = useState<boolean>(false);

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-neutral-700 flex items-center gap-2 text-xs">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Operational settings updated successfully.</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
              System Configuration
            </span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight mt-0.5">
            Command Center Settings
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Ward parameters, ultrasonic sensor threshold triggers, and automated dispatch policies.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 text-xs font-bold text-neutral-950 bg-teal-400 hover:bg-teal-300 rounded-xl transition-colors shadow-2xs self-start sm:self-auto"
        >
          Save Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sensor Thresholds */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-4">
          <div className="border-b border-neutral-100 pb-3">
            <h2 className="text-sm font-bold text-neutral-900">Capacity & Threshold Triggers</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Defines when bins turn Amber (Filling) and Red (Critical)</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-medium text-neutral-700 mb-1.5">
                <span>Critical Risk Threshold (Triggers Red Pin & Dispatch Queue)</span>
                <span className="font-mono font-bold text-rose-600">{criticalThreshold}%</span>
              </div>
              <input
                type="range"
                min="75"
                max="95"
                value={criticalThreshold}
                onChange={(e) => setCriticalThreshold(Number(e.target.value))}
                className="w-full accent-rose-600"
              />
            </div>

            <div>
              <div className="flex justify-between font-medium text-neutral-700 mb-1.5">
                <span>Filling Warning Threshold (Triggers Amber Pin)</span>
                <span className="font-mono font-bold text-amber-600">{fillingThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="80"
                value={fillingThreshold}
                onChange={(e) => setFillingThreshold(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Automated Dispatch Policies */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-4">
          <div className="border-b border-neutral-100 pb-3">
            <h2 className="text-sm font-bold text-neutral-900">Automated Dispatch Policies</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Control room routing heuristics</p>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200 cursor-pointer">
              <div>
                <span className="font-bold text-neutral-900 block">Automated Critical Re-routing</span>
                <span className="text-neutral-500 text-[11px]">Auto-inject bins exceeding {criticalThreshold}% into nearest truck's route</span>
              </div>
              <input
                type="checkbox"
                checked={autoDispatchEmergency}
                onChange={(e) => setAutoDispatchEmergency(e.target.checked)}
                className="w-4 h-4 accent-teal-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200 cursor-pointer">
              <div>
                <span className="font-bold text-neutral-900 block">Supervisor SMS & WhatsApp Escalations</span>
                <span className="text-neutral-500 text-[11px]">Send instant alert if complaint SLA breaches 2 hours</span>
              </div>
              <input
                type="checkbox"
                checked={smsAlertsEnabled}
                onChange={(e) => setSmsAlertsEnabled(e.target.checked)}
                className="w-4 h-4 accent-teal-600 rounded"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
