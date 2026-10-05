import React, { useState } from 'react';
import { Check, Truck } from 'lucide-react';
import { WorkerProfile } from '../../types/worker';

interface WorkerProfileViewProps {
  workerProfile: WorkerProfile;
  setWorkerProfile: React.Dispatch<React.SetStateAction<WorkerProfile>>;
}

export const WorkerProfileView: React.FC<WorkerProfileViewProps> = ({
  workerProfile,
  setWorkerProfile,
}) => {
  const [showToast, setShowToast] = useState<boolean>(false);

  const handleStatusChange = (status: WorkerProfile['status']) => {
    setWorkerProfile((prev) => ({ ...prev, status }));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="border-b border-neutral-200/70 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">Field Operator Profile</h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">Profile and duty status</p>
      </div>

      <section className="bg-white border border-neutral-200/90 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-neutral-900 text-white font-bold text-lg flex items-center justify-center">
            {workerProfile.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h2 className="text-base font-bold text-neutral-900">{workerProfile.name}</h2>
            <p className="text-xs text-neutral-500 mt-0.5">{workerProfile.role} · {workerProfile.zone}</p>
            {workerProfile.driverLicense && (
              <p className="text-xs text-neutral-500 font-mono mt-1">License: {workerProfile.driverLicense}</p>
            )}
          </div>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Duty Status</label>
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg border border-neutral-200 text-xs">
            {(['On Duty', 'On Break', 'Off Duty'] as const).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`px-2.5 py-1 rounded-md font-semibold ${
                  workerProfile.status === status ? 'bg-neutral-900 text-white' : 'text-neutral-600'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white border border-neutral-200/90 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-emerald-700" />
          <h2 className="text-sm font-bold text-neutral-900">Assigned Vehicle</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
            <span className="text-neutral-500">Vehicle</span>
            <p className="font-mono font-bold text-neutral-900 mt-1">{workerProfile.vehicle || 'Not assigned'}</p>
          </div>
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
            <span className="text-neutral-500">Shift</span>
            <p className="font-bold text-neutral-900 mt-1">{workerProfile.shift || 'Not specified'}</p>
          </div>
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
            <span className="text-neutral-500">Depot</span>
            <p className="font-bold text-neutral-900 mt-1">{workerProfile.depot || 'Not specified'}</p>
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
