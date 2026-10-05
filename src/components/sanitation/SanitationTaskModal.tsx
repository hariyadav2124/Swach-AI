import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Camera, 
  Upload, 
  Check, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Droplets,
  AlertCircle
} from 'lucide-react';
import { SanitationTask, SanitationActionType } from '../../types/sanitation';

interface SanitationTaskModalProps {
  task: SanitationTask;
  onClose: () => void;
  onCompleteTask: (
    taskId: string,
    performedActions: SanitationActionType[],
    notes?: string,
    beforePhoto?: string,
    afterPhoto?: string
  ) => void;
}

const ACTION_OPTIONS: SanitationActionType[] = [
  'Routine cleaning',
  'Deep cleaning',
  'Disinfection',
  'Spillage cleanup',
  'Odour treatment',
  'Pest treatment',
  'Emergency cleanup',
];

export const SanitationTaskModal: React.FC<SanitationTaskModalProps> = ({
  task,
  onClose,
  onCompleteTask,
}) => {
  // Step 1: Checklist & Action Types, Step 2: Proof & Notes, Step 3: Confirmation Summary
  const [modalStep, setModalStep] = useState<number>(1);
  const [checklist, setChecklist] = useState(task.checklist);
  const [selectedActions, setSelectedActions] = useState<SanitationActionType[]>([
    'Deep cleaning',
    'Disinfection',
    'Odour treatment',
  ]);
  const [beforePhoto, setBeforePhoto] = useState<string>(task.beforePhoto || 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80');
  const [afterPhoto, setAfterPhoto] = useState<string>(task.afterPhoto || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80');
  const [notes, setNotes] = useState<string>('Heavy organic residue and odour neutralized with high-pressure bleaching wash.');

  const completedCount = checklist.filter((c) => c.completed).length;
  const isChecklistComplete = completedCount >= 5; // require at least 5 key items

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const toggleActionType = (act: SanitationActionType) => {
    setSelectedActions((prev) =>
      prev.includes(act) ? prev.filter((a) => a !== act) : [...prev, act]
    );
  };

  const handleBeforeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setBeforePhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAfterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAfterPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFinalSubmit = () => {
    onCompleteTask(task.id, selectedActions, notes, beforePhoto, afterPhoto);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-neutral-100 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-teal-800 font-bold">
                Task Started · {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h2 className="text-base font-bold text-neutral-900 mt-0.5">
              {task.binId} · {task.name}
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
          {/* STEP 1: Sanitation Checklist & Actions */}
          {modalStep === 1 && (
            <div className="space-y-6">
              {/* Checklist Progress */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-neutral-900">
                  <span>Sanitation Field Checklist</span>
                  <span className="font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {completedCount} / {checklist.length} Completed
                  </span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-teal-600 rounded-full transition-all duration-300"
                    style={{ width: `${(completedCount / checklist.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Checklist Items */}
              <div className="space-y-2">
                {checklist.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left text-xs transition-all ${
                      item.completed
                        ? 'bg-teal-50/70 border-teal-400 text-teal-950 font-semibold'
                        : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-700'
                    }`}
                  >
                    <span>{item.label}</span>
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        item.completed
                          ? 'bg-teal-600 border-teal-600 text-white'
                          : 'border-neutral-300 bg-white'
                      }`}
                    >
                      {item.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </div>
                  </button>
                ))}
              </div>

              {/* Sanitation Type Multi-Select */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Sanitation Work Performed (Select all applied)
                </label>
                <div className="flex flex-wrap gap-2">
                  {ACTION_OPTIONS.map((action) => {
                    const isSelected = selectedActions.includes(action);
                    return (
                      <button
                        key={action}
                        type="button"
                        onClick={() => toggleActionType(action)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          isSelected
                            ? 'bg-neutral-900 text-white border-neutral-900 font-bold'
                            : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        {isSelected && '✓ '}
                        {action}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Next Step CTA */}
              <button
                type="button"
                disabled={!isChecklistComplete}
                onClick={() => setModalStep(2)}
                className={`w-full min-h-[48px] py-2.5 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 ${
                  isChecklistComplete
                    ? 'bg-teal-500 hover:bg-teal-400 text-neutral-950'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
              >
                <span>Continue to Photo Proof ({completedCount}/{checklist.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Before & After Proof + Notes */}
          {modalStep === 2 && (
            <div className="space-y-5">
              <div className="text-xs text-neutral-600">
                Upload on-site Before & After photographs to verify municipal hygiene compliance.
              </div>

              {/* Before & After Dual Preview */}
              <div className="grid grid-cols-2 gap-3">
                {/* Before Photo */}
                <div className="space-y-2">
                  <div className="text-[10px] uppercase font-bold text-neutral-500">
                    1. Before Cleaning
                  </div>
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 flex items-center justify-center">
                    <img src={beforePhoto} alt="Before" className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-neutral-900/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                      BEFORE
                    </span>
                  </div>
                  <label className="block w-full py-1.5 text-center text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg border border-neutral-300 cursor-pointer">
                    Retake Before
                    <input type="file" accept="image/*" onChange={handleBeforeUpload} className="hidden" />
                  </label>
                </div>

                {/* After Photo */}
                <div className="space-y-2">
                  <div className="text-[10px] uppercase font-bold text-teal-700">
                    2. After Sanitization
                  </div>
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-teal-300 bg-neutral-100 flex items-center justify-center">
                    <img src={afterPhoto} alt="After" className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-teal-600 text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-bold">
                      AFTER
                    </span>
                  </div>
                  <label className="block w-full py-1.5 text-center text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg border border-neutral-300 cursor-pointer">
                    Retake After
                    <input type="file" accept="image/*" onChange={handleAfterUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Sanitation Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Applied lime powder along perimeter; cleaned organic residue."
                  className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalStep(1)}
                  className="px-4 py-2.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setModalStep(3)}
                  className="flex-1 min-h-[48px] py-2.5 text-xs font-bold text-neutral-950 bg-teal-400 hover:bg-teal-300 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Review & Complete Task</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Complete Task Confirmation */}
          {modalStep === 3 ? (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-200">
                  <Check className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 mt-2">
                  Sanitization Ready for Sign-Off
                </h3>
                <p className="text-xs text-neutral-500">
                  Verify hygiene records before advancing to the next route stop.
                </p>
              </div>

              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Location:</span>
                  <span className="font-bold text-neutral-900">{task.binId} · {task.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Completed Time:</span>
                  <span className="font-mono text-neutral-800">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Proof:</span>
                  <span className="font-bold text-teal-700">Before & After Verified</span>
                </div>

                <div className="pt-2 border-t border-neutral-200">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Actions Recorded:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedActions.map((act) => (
                      <span key={act} className="px-2 py-0.5 bg-white border border-neutral-200 rounded font-semibold text-neutral-800 text-[11px]">
                        ✓ {act}
                      </span>
                    ))}
                  </div>
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
                  onClick={() => setModalStep(2)}
                  className="px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-xl"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="flex-1 min-h-[48px] py-2.5 text-xs font-bold text-neutral-950 bg-teal-400 hover:bg-teal-300 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-neutral-950" />
                  <span>CONTINUE TO NEXT TASK</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
