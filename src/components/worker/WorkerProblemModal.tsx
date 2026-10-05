import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Camera, 
  Upload, 
  Check, 
  MapPin, 
  AlertCircle,
  Truck,
  ShieldAlert
} from 'lucide-react';
import { RouteStop } from '../../types/worker';

interface WorkerProblemModalProps {
  stop: RouteStop;
  onClose: () => void;
  onSubmitProblem: (stopId: string, category: string, description: string, photo?: string) => void;
}

const PROBLEM_CATEGORIES = [
  { id: 'inaccessible', title: 'Bin Inaccessible', desc: 'Parked cars, construction barrier, or blocked road' },
  { id: 'damaged', title: 'Container Damaged', desc: 'Cracked rim, broken trunnion, or unhookable lid' },
  { id: 'excessive_overflow', title: 'Excessive Spillage / Bulky Waste', desc: 'Requires separate front-end loader or manual tractor crew' },
  { id: 'scattered', title: 'Waste Scattered Outside', desc: 'Severe littering requiring dedicated sanitation sweepers' },
  { id: 'vehicle_fault', title: 'Vehicle / Hydraulic Lift Issue', desc: 'Mechanical problem on compactor PB-65-8821' },
  { id: 'missing', title: 'Bin Missing / Displaced', desc: 'Container not found at registered coordinates' },
  { id: 'other', title: 'Other Operational Exception', desc: 'Hazardous chemical spillage, animal interference, etc.' },
];

export const WorkerProblemModal: React.FC<WorkerProblemModalProps> = ({
  stop,
  onClose,
  onSubmitProblem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(PROBLEM_CATEGORIES[0].title);
  const [description, setDescription] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitProblem(stop.id, selectedCategory, description.trim() || 'Worker flagged operational exception.', photoUrl);
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
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-neutral-100 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-rose-700 font-bold">
                Field Exception Report
              </span>
            </div>
            <h2 className="text-base font-bold text-neutral-900 mt-0.5">
              Report Issue · {stop.binId}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Bin identifier */}
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs flex items-center justify-between">
            <span className="font-semibold text-neutral-800">{stop.name}</span>
            <span className="font-mono text-neutral-500">{stop.distance}</span>
          </div>

          {/* Select Category */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
              Select Problem Category
            </label>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {PROBLEM_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.title)}
                  className={`w-full flex items-start justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                    selectedCategory === cat.title
                      ? 'border-rose-600 bg-rose-50/50 ring-1 ring-rose-600 font-semibold'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div>
                    <div className="text-neutral-900">{cat.title}</div>
                    <div className="text-[11px] text-neutral-500 font-normal mt-0.5">{cat.desc}</div>
                  </div>
                  {selectedCategory === cat.title && (
                    <div className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              Specific Operator Details
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Three vehicles parked in front of bin pocket blocking hydraulic lift arm extension. Notified local security."
              className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900"
              required
            ></textarea>
          </div>

          {/* Photo */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              Attach On-Site Photo
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 py-2 px-3 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200/70 border border-neutral-300/80 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <Camera className="w-3.5 h-3.5" />
                <span>Upload Proof Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {photoUrl && (
                <span className="text-xs text-rose-700 font-medium flex items-center gap-1">
                  Attached
                </span>
              )}
            </div>
          </div>

          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-[11px] text-neutral-600">
            Reporting an issue will flag this stop as <strong>ATTENTION REQUIRED</strong>, notify Ward 14 Control Room, and sequence the next stop on your route.
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Submit & Mark Attention Required</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
