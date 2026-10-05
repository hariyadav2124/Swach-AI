import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Camera, 
  Upload, 
  Check, 
  ShieldAlert,
  Wrench,
  Droplets
} from 'lucide-react';
import { SanitationTask } from '../../types/sanitation';

interface SanitationProblemModalProps {
  task: SanitationTask;
  onClose: () => void;
  onSubmitEscalation: (taskId: string, reason: string, description: string, photo?: string) => void;
}

const ESCALATION_REASONS = [
  { id: 'inaccessible', title: 'Area Inaccessible', desc: 'Waterlogged, blocked by construction, or barricaded' },
  { id: 'structural_damage', title: 'Heavy Structural Damage', desc: 'Cracked concrete plinth or compromised container body' },
  { id: 'pest_infestation', title: 'Severe Pest / Rodent Infestation', desc: 'Requires specialized municipal extermination team' },
  { id: 'hazardous', title: 'Hazardous / Medical Material Suspected', desc: 'Unidentified toxic chemical or biohazard waste' },
  { id: 'insufficient_equipment', title: 'Insufficient Equipment', desc: 'Requires heavy earthmover, tractor, or larger tanker' },
  { id: 'water_unavailable', title: 'Water Refill Required', desc: 'Water jet tanker empty; cannot perform pressure washing' },
  { id: 'other', title: 'Other Field Exception', desc: 'Legal dispute, severe hostility, or other impediment' },
];

export const SanitationProblemModal: React.FC<SanitationProblemModalProps> = ({
  task,
  onClose,
  onSubmitEscalation,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>(ESCALATION_REASONS[0].title);
  const [description, setDescription] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitEscalation(
      task.id,
      selectedReason,
      description.trim() || 'Sanitation worker escalated field condition to municipal maintenance wing.',
      photoUrl
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-neutral-100 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-rose-700 font-bold">
                Sanitation Escalation Flow
              </span>
            </div>
            <h2 className="text-base font-bold text-neutral-900 mt-0.5">
              Escalate Task · {task.binId}
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
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs flex items-center justify-between">
            <span className="font-semibold text-neutral-800">{task.name}</span>
            <span className="font-mono text-neutral-500">{task.distance}</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
              Select Escalation Reason
            </label>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {ESCALATION_REASONS.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedReason(cat.title)}
                  className={`w-full flex items-start justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                    selectedReason === cat.title
                      ? 'border-rose-600 bg-rose-50/50 ring-1 ring-rose-600 font-semibold'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div>
                    <div className="text-neutral-900">{cat.title}</div>
                    <div className="text-[11px] text-neutral-500 font-normal mt-0.5">{cat.desc}</div>
                  </div>
                  {selectedReason === cat.title && (
                    <div className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              Specific Operator Details
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Deep structural crack in concrete base leaking wastewater into storm drain. Requires municipal civil team repair."
              className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900"
              required
            ></textarea>
          </div>

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
            Escalating will mark this task as <strong>ESCALATED</strong>, dispatch a notification to Ward 14 Engineering, and advance to your next sanitation task.
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
              <span>Escalate to Maintenance</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
