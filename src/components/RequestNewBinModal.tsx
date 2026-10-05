import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  MapPin, 
  Users, 
  Upload, 
  Check, 
  CheckCircle2, 
  Info,
  Building2,
  Navigation
} from 'lucide-react';
import { CitizenRequest, LanguageCode } from '../types';
import { translations } from '../translations';

interface RequestNewBinModalProps {
  onClose: () => void;
  onSubmitNewBinRequest: (newRequest: CitizenRequest) => void;
  activeSector: { id: string; name: string; ward: string };
  language: LanguageCode;
}

const REASON_OPTIONS = [
  'No community bin within 500m radius',
  'High evening footfall (Park / Commercial market)',
  'Heavy residential waste generation',
  'Frequent illegal littering blackspot',
  'Public transit / bus stop commuter area',
  'Other civic infrastructure gap',
];

export const RequestNewBinModal: React.FC<RequestNewBinModalProps> = ({
  onClose,
  onSubmitNewBinRequest,
  activeSector,
  language,
}) => {
  const t = translations[language];

  const [locationText, setLocationText] = useState<string>('');
  const [selectedReason, setSelectedReason] = useState<string>(REASON_OPTIONS[0]);
  const [description, setDescription] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [submittedRequest, setSubmittedRequest] = useState<CitizenRequest | null>(null);

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
    const refId = `REQ-NEW-${randomNum}`;

    const newRequest: CitizenRequest = {
      id: refId,
      type: 'new_bin',
      title: `Suggest New Community Bin · ${locationText.split(' ')[0]}`,
      location: `${locationText}, ${activeSector.name}`,
      sector: activeSector.name.split(',')[0],
      submittedAt: 'Just now',
      updatedAt: 'Just now',
      status: 'submitted',
      issueCategory: selectedReason,
      description: description.trim(),
      ...(photoUrl ? { photoUrl } : {}),
      timeline: [
        { title: 'Suggestion Submitted', time: 'Just now', done: true },
        { title: 'Review', time: 'Pending', done: false },
        { title: 'Decision', time: 'Pending', done: false },
      ],
    };

    onSubmitNewBinRequest(newRequest);
    setSubmittedRequest(newRequest);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-neutral-100 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neutral-900"></span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-600 font-semibold">
                Civic Infrastructure
              </span>
            </div>
            <h2 className="text-base font-bold text-neutral-900 mt-0.5">
              {submittedRequest ? 'Request Sent for Review' : t.suggestNewBinTitle}
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
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-neutral-900">
                  Request Sent for Municipal Review
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Our GIS planning department evaluates pedestrian density and compactor truck access.
                </p>
                <div className="mt-2.5 inline-block font-mono text-sm font-bold bg-neutral-100 text-neutral-900 px-3.5 py-1.5 rounded-lg border border-neutral-200">
                  {submittedRequest.id}
                </div>
              </div>

              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-left text-xs space-y-2 text-neutral-600">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                  <Users className="w-4 h-4 text-emerald-700" />
                  <span>23 similar citizen requests aggregated in this zone.</span>
                </div>
                <p className="text-[11px] text-neutral-500">
                  When 20+ verified residents flag an underserved area, a formal site inspection by the Ward Junior Engineer is automatically triggered within 5 working days.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full mt-4 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <p className="text-xs text-neutral-500">
                  {t.suggestNewBinSub}
                </p>
              </div>

              {/* Contextual Density Indicator */}
              <div className="p-3.5 bg-neutral-50 border border-neutral-200/90 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-neutral-700">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Navigation className="w-3.5 h-3.5 text-neutral-500" />
                    {t.nearestExistingBin}:
                  </span>
                  <span className="font-mono font-bold text-neutral-900">620 m</span>
                </div>
                <div className="flex items-center justify-between text-emerald-800 bg-emerald-50/80 p-2 rounded-lg border border-emerald-200/60 font-medium text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    Civic Demand:
                  </span>
                  <span className="font-bold">23 {t.similarRequestsInArea}</span>
                </div>
              </div>

              {/* Proposed Location */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Proposed Location / Landmark
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={locationText}
                    onChange={(e) => setLocationText(e.target.value)}
                    placeholder="e.g. Near Block C Park jogging track gate 3"
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Primary Civic Need / Reason
                </label>
                <select
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-full text-xs p-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
                >
                  {REASON_OPTIONS.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>

              {/* Photo */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Site Photo (Recommended)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 py-2 px-3 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200/70 border border-neutral-300/80 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Spot Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {photoUrl && (
                    <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Uploaded
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Additional Details & Community Benefit
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Over 200 morning walkers and visitors frequent this gate daily. A segregated pair of dry and wet bins will keep the jogging trail spotless."
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
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Suggest Community Bin</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
