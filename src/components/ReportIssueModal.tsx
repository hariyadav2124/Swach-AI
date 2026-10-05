import React, { useState } from 'react';
import { 
  X, 
  AlertCircle, 
  Camera, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  Check,
  Sparkles,
  Info
} from 'lucide-react';
import { CommunityBin, CitizenRequest, LanguageCode } from '../types';
import { translations } from '../translations';

interface ReportIssueModalProps {
  initialBin?: CommunityBin | null;
  bins: CommunityBin[];
  onClose: () => void;
  onSubmitReport: (newRequest: CitizenRequest) => void;
  language: LanguageCode;
}

const ISSUE_OPTIONS = [
  { id: 'overflow', title: 'Overflowing bin', desc: 'Waste spilling outside or above rim' },
  { id: 'scattered', title: 'Waste scattered around bin', desc: 'Litter on street or sidewalk near station' },
  { id: 'damaged', title: 'Damaged bin', desc: 'Crack, dent, broken wheel or frame' },
  { id: 'odour', title: 'Bad odour', desc: 'Severe pungent smell requiring lime/disinfectant' },
  { id: 'lid', title: 'Missing or damaged lid', desc: 'Exposed to rain, birds or stray animals' },
  { id: 'other', title: 'Other civic issue', desc: 'Illegal commercial dumping, blockage, etc.' },
];

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  initialBin,
  bins,
  onClose,
  onSubmitReport,
  language,
}) => {
  const t = translations[language];

  const [step, setStep] = useState<number>(1);
  const [selectedIssue, setSelectedIssue] = useState<string>(ISSUE_OPTIONS[0].title);
  const [selectedBinId, setSelectedBinId] = useState<string>(initialBin?.id || bins[0]?.id || '');
  const [customLocation, setCustomLocation] = useState<string>(initialBin?.locationDescription || bins[0]?.locationDescription || '');
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

  const handleFinalSubmit = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const refId = `REP-2026-${randomNum}`;

    const newRequest: CitizenRequest = {
      id: refId,
      type: 'complaint',
      title: `${selectedIssue} · ${selectedBinId || 'Community Bin'}`,
      binId: selectedBinId,
      location: customLocation || selectedBin?.locationDescription || 'Not specified',
      sector: selectedBin?.sector || 'Not specified',
      submittedAt: 'Just now',
      updatedAt: 'Just now',
      status: 'submitted',
      issueCategory: selectedIssue,
      description: description.trim(),
      ...(photoUrl ? { photoUrl } : {}),
      timeline: [
        { title: 'Complaint Submitted', time: 'Just now', done: true },
        { title: 'Assignment', time: 'Pending', done: false },
        { title: 'Resolution', time: 'Pending', done: false },
      ],
    };

    onSubmitReport(newRequest);
    setSubmittedRequest(newRequest);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-neutral-100 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-rose-700 font-semibold">
                Municipal Complaint
              </span>
            </div>
            <h2 className="text-base font-bold text-neutral-900 mt-0.5">
              {submittedRequest ? 'Report Submitted' : `Report Issue · Step ${step} of 5`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Content */}
        <div className="p-6">
          {submittedRequest ? (
            /* Success confirmation screen */
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-neutral-900">
                  Complaint Successfully Logged
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Assigned reference tracking number for Municipal Corporation SAS Nagar:
                </p>
                <div className="mt-2.5 inline-block font-mono text-sm font-bold bg-neutral-100 text-neutral-900 px-3.5 py-1.5 rounded-lg border border-neutral-200">
                  {submittedRequest.id}
                </div>
              </div>

              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-100 text-left text-xs space-y-1.5 text-neutral-600">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Issue:</span>
                  <span className="font-semibold text-neutral-900">{submittedRequest.issueCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Location:</span>
                  <span className="font-semibold text-neutral-900 truncate max-w-[200px]">{submittedRequest.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Standard Municipal SLA:</span>
                  <span className="font-semibold text-emerald-700">&lt; 3 Hours</span>
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
            <div className="space-y-6">
              {/* Step 1: Select Issue */}
              {step === 1 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Step 1: What is the issue?
                  </h3>
                  <div className="space-y-2">
                    {ISSUE_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedIssue(opt.title)}
                        className={`w-full flex items-start justify-between p-3 rounded-xl border text-left transition-all ${
                          selectedIssue === opt.title
                            ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                            : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-neutral-900">{opt.title}</div>
                          <div className="text-[11px] text-neutral-500 mt-0.5">{opt.desc}</div>
                        </div>
                        {selectedIssue === opt.title && (
                          <div className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Location */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Step 2: Verify Bin & Location
                  </h3>

                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs flex items-center gap-2.5 text-emerald-900">
                    <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Auto-detected nearest community bin within 350 meters.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Select Community Bin
                    </label>
                    <select
                      value={selectedBinId}
                      onChange={(e) => {
                        setSelectedBinId(e.target.value);
                        const bin = bins.find((b) => b.id === e.target.value);
                        if (bin) setCustomLocation(bin.locationDescription);
                      }}
                      className="w-full text-xs p-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
                    >
                      {bins.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.id} — {b.name} ({b.sector})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Specific Spot / Landmark Description
                    </label>
                    <input
                      type="text"
                      value={customLocation}
                      onChange={(e) => setCustomLocation(e.target.value)}
                      placeholder="e.g. Near park entrance gate 2, opposite chemist shop"
                      className="w-full text-xs p-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Photo */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Step 3: Attach Photo Evidence
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Photos help the sanitation crew prepare the correct equipment (e.g. shovel, pressure wash, compactor).
                  </p>

                  <div className="relative aspect-16/9 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 flex items-center justify-center">
                    {photoUrl ? (
                      <img src={photoUrl} alt="Issue preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-4">
                        <Camera className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                        <span className="text-xs text-neutral-500">No photo selected</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex-1 py-2 px-3 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200/70 border border-neutral-300/80 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                  </div>
                </div>
              )}

              {/* Step 4: Description */}
              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Step 4: Additional Notes (Optional)
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                      Description for the municipal team
                    </label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g. Plastic bottles overflowing on walking track. Stray animals are gathering. Please clear before evening walkers arrive."
                      className="w-full text-xs p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Step 5: Review & Submit */}
              {step === 5 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Step 5: Review & Submit Complaint
                  </h3>

                  <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 space-y-3 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-400">Issue Category</span>
                      <div className="font-bold text-neutral-900">{selectedIssue}</div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-400">Assigned Community Station</span>
                      <div className="font-semibold text-neutral-900">{selectedBinId} · {customLocation}</div>
                    </div>

                    {photoUrl && (
                      <div>
                        <span className="text-[10px] uppercase font-bold text-neutral-400">Attached Photo</span>
                        <div className="w-20 h-14 rounded-md overflow-hidden border border-neutral-200 mt-1">
                          <img src={photoUrl} alt="Attached" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    )}

                    {description && (
                      <div>
                        <span className="text-[10px] uppercase font-bold text-neutral-400">Citizen Note</span>
                        <div className="text-neutral-700 italic">"{description}"</div>
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-neutral-100 rounded-lg text-[11px] text-neutral-600 flex items-center gap-2">
                    <Info className="w-4 h-4 text-neutral-500 shrink-0" />
                    <span>Your registered contact (+91 98765 43210) will receive SMS resolution updates.</span>
                  </div>
                </div>
              )}

              {/* Wizard Bottom Controls */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-3.5 py-2 text-xs font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div></div>
                )}

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 ml-auto"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 ml-auto"
                  >
                    <span>Submit Complaint</span>
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
