import React from 'react';
import { X, MapPin, Check, Navigation, Compass } from 'lucide-react';
import { SECTORS } from '../data/mockData';
import { LanguageCode } from '../types';
import { translations } from '../translations';

interface LocationPickerModalProps {
  activeSector: { id: string; name: string; ward: string; lat: number; lng: number };
  onSelectSector: (sector: typeof SECTORS[0]) => void;
  onClose: () => void;
  language: LanguageCode;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  activeSector,
  onSelectSector,
  onClose,
  language,
}) => {
  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-neutral-900 text-base">
              Select Sector / Location
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-neutral-500">
          Bin distances, predicted critical overflow times, and municipal rapid response units adapt to your active municipal sector.
        </p>

        {/* GPS Auto-detect button */}
        <button
          onClick={() => {
            onSelectSector(SECTORS[0]);
            onClose();
          }}
          className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 transition-colors text-xs font-semibold text-left"
        >
          <Compass className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Use Current GPS Location (Sector 68, Mohali)</span>
        </button>

        {/* Sector list */}
        <div className="space-y-2 pt-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Available Municipal Wards & Sectors
          </div>
          {SECTORS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => {
                onSelectSector(sec);
                onClose();
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                activeSector.id === sec.id
                  ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900 font-semibold text-neutral-900'
                  : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:bg-neutral-50/50'
              }`}
            >
              <div>
                <div className="font-bold">{sec.name}</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">{sec.ward} · Municipal Corporation SAS Nagar</div>
              </div>
              {activeSector.id === sec.id && (
                <Check className="w-4 h-4 text-neutral-900 shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
