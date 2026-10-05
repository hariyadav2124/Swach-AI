import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  MapPin, 
  Upload, 
  Camera, 
  Check, 
  CheckCircle2, 
  ArrowRight, 
  Info,
  Bug,
  SprayCan,
  Wind
} from 'lucide-react';
import { CommunityBin, CitizenRequest, LanguageCode } from '../types';
import { translations } from '../translations';

interface SanitizationModalProps {
  initialBin?: CommunityBin | null;
  bins: CommunityBin[];
  onClose: () => void;
  onSubmitCleaningRequest: (newRequest: CitizenRequest) => void;
  language: LanguageCode;
}

const CLEANING_SERVICES = [
  { id: 'bin_wash', title: 'Bin cleaning & pressure wash', desc: 'Internal scrubbing and detergent washing of container' },
  { id: 'area_cleaning', title: 'Surrounding area cleaning', desc: 'Sweeping, scrubbing sidewalk within 10 meters' },
  { id: 'disinfection', title: 'Disinfection & bleaching', desc: 'Spraying sodium hypochlorite/lime powder' },
  { id: 'spillage', title: 'Waste spillage cleanup', desc: 'Removal of decomposed organic spillage or stained liquid' },
  { id: 'odour', title: 'Odour issue neutralizer', desc: 'Application of bio-enzyme odor eliminator' },
  { id: 'pest', title: 'Pest / insect infestation', desc: 'Flies, larvae or rodent containment' },
];

export const SanitizationModal: React.FC<SanitizationModalProps> = ({
  initialBin,
  bins,
  onClose,
  onSubmitCleaningRequest,
  language,
}) => {
  const t = translations[language];

  const [selectedService, setSelectedService] = useState<string>(CLEANING_SERVICES[0].title);
  const [selectedBinId, setSelectedBinId] = useState<string>(initialBin?.id || bins[0]?.id || '');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [submittedRequest, setSubmittedRequest] = useState<CitizenRequest | null>(null);

  const selectedBin = bins.find((b) => b.id === selectedBinId);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const refId = `SAN-2026-${randomNum}`;

    const newRequest: CitizenRequest = {
      id: refId,
      type: 'cleaning',
      title: `${selectedService} · ${selectedBinId}`,
      binId: selectedBinId,
      location: selectedBin?.locationDescription || 'Not specified',
      sector: selectedBin?.sector || 'Not specified',
      submittedAt: 'Just now',
      updatedAt: 'Just now',
      status: 'submitted',
      issueCategory: selectedService,
      description: description.trim(),
      ...(photoUrl ? { photoUrl } : {}),
      timeline: [
        { title: 'Request Submitted', time: 'Just now', done: true },
        { title: 'Assignment', time: 'Pending', done: false },
        { title: 'Service', time: 'Pending', done: false },
        { title: 'Resolution', time: 'Pending', done: false },
      ],
    };

    onSubmitCleaningRequest(newRequest);
    setSubmittedRequest(newRequest);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-neutral-100 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600"></span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-teal-700 font-semibold">
                Municipal Hygiene & Cleaning
              </span>
            </div>
            <h2 className="text-base font-bold text-neutral-900 mt-0.5">
              {submittedRequest ? 'Request Received' : t.requestCleaning}
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
          {submittedRequest ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-200">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-neutral-900">
                  Sanitization Request Submitted
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Reference Request ID for Municipal Corporation SAS Nagar:
                </p>
                <div className="mt-2.5 inline-block font-mono text-sm font-bold bg-neutral-100 text-neutral-900 px-3.5 py-1.5 rounded-lg border border-neutral-200">
                  {submittedRequest.id}
                </div>
              </div>

              {/* Expected Workflow Visualizer */}
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-left space-y-3">
                <div className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                  Request Status
                </div>
                <div className="grid grid-cols-4 gap-1 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-[11px] font-bold">1</div>
                    <span className="text-[10px] font-semibold text-teal-800 mt-1">Submitted</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center text-[11px] font-bold">2</div>
                    <span className="text-[10px] text-neutral-500 mt-1">Assigned</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center text-[11px] font-bold">3</div>
                    <span className="text-[10px] text-neutral-500 mt-1">In Progress</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center text-[11px] font-bold">4</div>
                    <span className="text-[10px] text-neutral-500 mt-1">Resolved</span>
                  </div>
                </div>
                <div className="text-[11px] text-neutral-500 pt-2 border-t border-neutral-200/70">
                  No crew assignment has been recorded yet.
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full mt-4 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm transition-colors"
              >
                Track in My Requests
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Select Service */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                  Select Sanitization Service
                </label>
                <div className="space-y-2">
                  {CLEANING_SERVICES.map((srv) => (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => setSelectedService(srv.title)}
                      className={`w-full flex items-start justify-between p-3 rounded-xl border text-left transition-all ${
                        selectedService === srv.title
                          ? 'border-teal-700 bg-teal-50/50 ring-1 ring-teal-700'
                          : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-neutral-900">{srv.title}</div>
                        <div className="text-[11px] text-neutral-500 mt-0.5">{srv.desc}</div>
                      </div>
                      {selectedService === srv.title && (
                        <div className="w-5 h-5 rounded-full bg-teal-700 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Bin */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Selected Nearby Community Bin
                </label>
                <select
                  value={selectedBinId}
                  onChange={(e) => setSelectedBinId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
                >
                  {bins.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.id} — {b.name} ({b.sector})
                    </option>
                  ))}
                </select>
              </div>

              {/* Optional Photo */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Photo Evidence (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 py-2 px-3 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200/70 border border-neutral-300/80 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Picture</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {photoUrl && (
                    <span className="text-xs text-teal-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Attached
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Specific Instructions (Optional)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Foul smell near children's playground. Please spray disinfectant and wash concrete base."
                  className="w-full text-xs p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                ></textarea>
              </div>

              {/* Submit CTA */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Request Sanitization</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
