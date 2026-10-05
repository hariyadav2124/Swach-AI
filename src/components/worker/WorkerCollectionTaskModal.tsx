import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Upload, 
  Camera, 
  Check, 
  Clock, 
  Scale, 
  ArrowRight, 
  Sparkles, 
  Truck,
  RotateCw,
  Image as ImageIcon
} from 'lucide-react';
import { RouteStop } from '../../types/worker';

interface WorkerCollectionTaskModalProps {
  stop: RouteStop;
  onClose: () => void;
  onCompleteCollection: (stopId: string, collectedKg: number, notes?: string, photoUrl?: string) => void;
}

export const WorkerCollectionTaskModal: React.FC<WorkerCollectionTaskModalProps> = ({
  stop,
  onClose,
  onCompleteCollection,
}) => {
  // Step states: 1 = Initial (Before collection), 2 = In Progress (hydraulic lift), 3 = Record info & Photo, 4 = Proof summary & Submit
  const [taskStep, setTaskStep] = useState<number>(1);
  const [progressTimer, setProgressTimer] = useState<number>(0);
  const [collectedKg, setCollectedKg] = useState<number>(Math.round(stop.capacityKg * (stop.estimatedFill / 100)));
  const [notes, setNotes] = useState<string>('Normal hydraulic lift offload. Concrete apron inspected and clean.');
  const [photoUrl, setPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80');
  const [previewPhotoModal, setPreviewPhotoModal] = useState<boolean>(false);

  // Simulated hydraulic compactor lift cycle
  useEffect(() => {
    let interval: any;
    if (taskStep === 2) {
      interval = setInterval(() => {
        setProgressTimer((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTaskStep(3);
            return 100;
          }
          return prev + 25;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [taskStep]);

  const handleStartLift = () => {
    setTaskStep(2);
    setProgressTimer(0);
  };

  const handleProceedToProof = (e: React.FormEvent) => {
    e.preventDefault();
    setTaskStep(4);
  };

  const handleFinalSubmit = () => {
    onCompleteCollection(stop.id, collectedKg, notes, photoUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-neutral-100 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-800 font-bold">
                Field Collection Task #{stop.order}
              </span>
            </div>
            <h2 className="text-base font-bold text-neutral-900 mt-0.5">
              {stop.binId} · {stop.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* STEP 1: Before Collection */}
          {taskStep === 1 && (
            <div className="space-y-6">
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500 uppercase font-bold text-[10px]">Pre-Collection Sensor Fill</span>
                  <span className="font-mono text-xl font-black text-rose-600">{stop.estimatedFill}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500">Station Location:</span>
                  <span className="font-medium text-neutral-800 text-right">{stop.locationDescription}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500">Bin Rated Capacity:</span>
                  <span className="font-mono font-bold text-neutral-900">{stop.capacityKg} kg (1100 Liters)</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>
                  Align truck PB-65-8821 hydraulic lifter arms with trunnions on container {stop.binId}.
                </span>
              </div>

              <button
                onClick={handleStartLift}
                className="w-full min-h-[50px] px-6 py-3 text-sm font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5 text-neutral-950" />
                <span>START COLLECTION</span>
              </button>
            </div>
          )}

          {/* STEP 2: Collection in Progress */}
          {taskStep === 2 && (
            <div className="py-10 text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-neutral-900 text-emerald-400 flex items-center justify-center mx-auto shadow-md relative">
                <RotateCw className="w-8 h-8 animate-spin" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-neutral-900">
                  Collection in Progress
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Hydraulic lifter engaged · Emptying 1100L container into compactor...
                </p>
              </div>

              <div className="max-w-xs mx-auto space-y-2">
                <div className="w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${progressTimer}%` }}
                  ></div>
                </div>
                <div className="text-[11px] font-mono text-neutral-400 font-bold">
                  {progressTimer}% COMPLETE
                </div>
              </div>

              <button
                onClick={() => setTaskStep(3)}
                className="text-xs text-neutral-500 hover:text-neutral-800 underline underline-offset-2"
              >
                Skip simulation
              </button>
            </div>
          )}

          {/* STEP 3: Record Actual Quantity & Photo Proof */}
          {taskStep === 3 && (
            <form onSubmit={handleProceedToProof} className="space-y-5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bin container emptied successfully. Record field payload metrics:</span>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Actual Collected Weight (kg)
                </label>
                <div className="relative">
                  <Scale className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    required
                    min={10}
                    max={600}
                    value={collectedKg}
                    onChange={(e) => setCollectedKg(Number(e.target.value))}
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono font-bold text-neutral-900"
                  />
                </div>
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Measured via PB-65-8821 hydraulic load-cell sensors.
                </span>
              </div>

              {/* Photo Proof */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Photo Proof (Mandatory for Municipal Verification)
                </label>
                <div className="relative aspect-16/9 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 flex items-center justify-center mb-2.5">
                  <img src={photoUrl} alt="Collection Proof" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPreviewPhotoModal(true)}
                    className="absolute bottom-2 right-2 px-2.5 py-1 text-[10px] font-semibold text-white bg-neutral-900/80 backdrop-blur-xs rounded-md"
                  >
                    Expand
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex-1 py-2 px-3 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200/70 border border-neutral-300/80 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Retake / Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Operator Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Cleared surrounding debris; container hinge lubricated."
                  className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] py-2.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Review Proof & Submit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 4: Proof Verification & Final Submit */}
          {taskStep === 4 && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <Check className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 mt-2">
                  Collection Ready for Submission
                </h3>
                <p className="text-xs text-neutral-500">
                  Verify collected payload and timestamp before closing stop.
                </p>
              </div>

              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Bin Station:</span>
                  <span className="font-bold text-neutral-900">{stop.binId} · {stop.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Collected Payload:</span>
                  <span className="font-mono font-black text-neutral-900">{collectedKg} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Timestamp:</span>
                  <span className="font-mono text-neutral-800">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Photo Proof:</span>
                  <span className="font-semibold text-emerald-700">Uploaded & Verified</span>
                </div>
                {notes && (
                  <div className="pt-2 border-t border-neutral-200">
                    <span className="text-neutral-500 text-[10px] uppercase font-bold block mb-0.5">Notes:</span>
                    <span className="text-neutral-700 italic">"{notes}"</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTaskStep(3)}
                  className="px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-xl"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="flex-1 min-h-[48px] py-2.5 text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-neutral-950" />
                  <span>SUBMIT & ADVANCE TO NEXT STOP</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Expanded photo viewer modal */}
      {previewPhotoModal && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl overflow-hidden p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900">Proof of Collection · {stop.binId}</span>
              <button onClick={() => setPreviewPhotoModal(false)} className="p-1 text-neutral-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <img src={photoUrl} alt="Proof" className="w-full rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
};
