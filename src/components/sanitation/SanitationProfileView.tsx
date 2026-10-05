import React, { useState } from 'react';
import { Check, MapPin, Truck } from 'lucide-react';
import { SanitationWorkerProfile } from '../../types/sanitation';

interface SanitationProfileViewProps {
  workerProfile: SanitationWorkerProfile;
  setWorkerProfile: React.Dispatch<React.SetStateAction<SanitationWorkerProfile>>;
}

export const SanitationProfileView: React.FC<SanitationProfileViewProps> = ({
  workerProfile,
  setWorkerProfile,
}) => {
  const [showToast, setShowToast] = useState<boolean>(false);

  const handleStatusChange = (status: SanitationWorkerProfile['status']) => {
    setWorkerProfile((prev) => ({ ...prev, status }));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="border-b border-neutral-200/70 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">Sanitation Worker Profile</h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">Profile and duty status</p>
      </div>

      <section className="bg-white rounded-2xl border border-neutral-200/80 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-500 text-neutral-950 font-bold text-2xl flex items-center justify-center">
              {workerProfile.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">{workerProfile.name}</h2>
              <p className="text-xs text-neutral-500 mt-0.5">{workerProfile.role} · {workerProfile.team}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-neutral-600 flex-wrap">
                <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" />{workerProfile.vehicle || 'No vehicle assigned'}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{workerProfile.zone}</span>
                <span>{workerProfile.shift}</span>
              </div>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-mono uppercase font-bold text-neutral-400 block mb-1">Duty Status</label>
            <div className="inline-flex p-1 bg-neutral-100 rounded-xl border border-neutral-200">
              {(['On Duty', 'On Break', 'Off Duty'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                    workerProfile.status === status ? 'bg-neutral-900 text-white' : 'text-neutral-600'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {showToast && (
        <div className="fixed bottom-20 sm:bottom-6 right-6 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Duty status updated: {workerProfile.status}</span>
        </div>
      )}
    </div>
  );
};
