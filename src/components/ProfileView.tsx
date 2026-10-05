import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Bell, 
  Languages, 
  ShieldCheck, 
  HelpCircle, 
  PhoneCall, 
  ExternalLink, 
  Check, 
  Smartphone, 
  Mail, 
  Compass,
  FileText
} from 'lucide-react';
import { LanguageCode } from '../types';
import { AuthSession } from '../types/auth';
import { translations } from '../translations';

interface ProfileViewProps {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  session: AuthSession;
  activeSector: { id: string; name: string; ward: string };
  onOpenLocationModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  language,
  setLanguage,
  session,
  activeSector,
  onOpenLocationModal,
}) => {
  const t = translations[language];

  const [smsAlerts, setSmsAlerts] = useState<boolean>(true);
  const [whatsappUpdates, setWhatsappUpdates] = useState<boolean>(true);
  const [highAccuracyGps, setHighAccuracyGps] = useState<boolean>(true);
  const [showSavedToast, setShowSavedToast] = useState<boolean>(false);

  const handleSavePreferences = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Title */}
      <div className="border-b border-neutral-200/70 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
          Citizen Profile & Settings
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Manage saved residential locations, notification channels, and language
        </p>
      </div>

      {/* Citizen Card */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-neutral-900 text-white font-bold text-lg flex items-center justify-center shadow-xs">
            {session.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-neutral-900">{session.name}</h2>
              <span className="text-[11px] font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                VERIFIED CITIZEN
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 mt-1">
              <span className="flex items-center gap-1 font-mono">
                <Smartphone className="w-3.5 h-3.5 text-neutral-400" />
                {session.identifier}
              </span>
              {session.email && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    {session.email}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleSavePreferences}
          className="px-3.5 py-1.5 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors self-start sm:self-center"
        >
          Edit Profile
        </button>
      </div>

      {/* Language Preferences */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-emerald-700" />
          <h3 className="text-sm font-bold text-neutral-900">
            Interface Language
          </h3>
        </div>
        <p className="text-xs text-neutral-500">
          Select your preferred language for waste scanner instructions, guidelines, and notices.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <button
            onClick={() => setLanguage('en')}
            className={`p-3 rounded-xl border text-left transition-all ${
              language === 'en'
                ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                : 'border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div className="text-xs font-bold text-neutral-900">English</div>
            <div className="text-[10px] text-neutral-500 mt-0.5">Default</div>
          </button>

          <button
            onClick={() => setLanguage('hi')}
            className={`p-3 rounded-xl border text-left transition-all ${
              language === 'hi'
                ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                : 'border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div className="text-xs font-bold text-neutral-900">हिन्दी (Hindi)</div>
            <div className="text-[10px] text-neutral-500 mt-0.5">नगर निगम आधिकारिक</div>
          </button>

          <div className="p-3 rounded-xl border border-dashed border-neutral-200 text-left opacity-60 cursor-not-allowed">
            <div className="text-xs font-bold text-neutral-600">ਪੰਜਾਬੀ (Punjabi)</div>
            <div className="text-[10px] text-neutral-400 mt-0.5">Coming soon</div>
          </div>

          <div className="p-3 rounded-xl border border-dashed border-neutral-200 text-left opacity-60 cursor-not-allowed">
            <div className="text-xs font-bold text-neutral-600">বাংলা / मराठी</div>
            <div className="text-[10px] text-neutral-400 mt-0.5">Coming soon</div>
          </div>
        </div>
      </div>

      {/* Saved Locations */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-neutral-900">
              Current Area
            </h3>
          </div>
          <button
            onClick={onOpenLocationModal}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Switch Active Sector
          </button>
        </div>

        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
          <div className="font-bold text-xs text-neutral-900">{activeSector.name}</div>
          <div className="text-[11px] text-neutral-500 mt-0.5">{activeSector.ward}</div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-700" />
          <h3 className="text-sm font-bold text-neutral-900">
            Notification Preferences
          </h3>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 cursor-pointer">
            <div>
              <div className="text-xs font-semibold text-neutral-900">SMS Resolution Alerts</div>
              <div className="text-[11px] text-neutral-500">Receive dispatch and complaint closure SMS from MC Mohali</div>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="w-4 h-4 accent-neutral-900"
            />
          </label>

          <label className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 cursor-pointer">
            <div>
              <div className="text-xs font-semibold text-neutral-900">WhatsApp Live Updates</div>
              <div className="text-[11px] text-neutral-500">Receive worker photo verification when cleaning is completed</div>
            </div>
            <input
              type="checkbox"
              checked={whatsappUpdates}
              onChange={(e) => setWhatsappUpdates(e.target.checked)}
              className="w-4 h-4 accent-neutral-900"
            />
          </label>

          <label className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 cursor-pointer">
            <div>
              <div className="text-xs font-semibold text-neutral-900">High-Precision Geolocation</div>
              <div className="text-[11px] text-neutral-500">Automatically pin nearest community bin when opening scanner</div>
            </div>
            <input
              type="checkbox"
              checked={highAccuracyGps}
              onChange={(e) => setHighAccuracyGps(e.target.checked)}
              className="w-4 h-4 accent-neutral-900"
            />
          </label>
        </div>
      </div>

      {/* Civic Help & Helplines */}
      <div className="bg-neutral-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">
            Municipal Citizen Helplines
          </h3>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed">
          For emergency biohazard spillage, medical waste dumping, or illegal garbage burning:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 bg-neutral-800 rounded-xl border border-neutral-700">
            <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
              Swachhata Citizen Toll-Free
            </div>
            <div className="font-mono text-base font-bold text-white mt-0.5">1969</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">National 24x7 Citizen Helpline</div>
          </div>

          <div className="p-3 bg-neutral-800 rounded-xl border border-neutral-700">
            <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
              MC SAS Nagar Control Room
            </div>
            <div className="font-mono text-base font-bold text-white mt-0.5">0172-5044911</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Direct Sanitary Inspector Office</div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showSavedToast && (
        <div className="fixed bottom-20 sm:bottom-6 right-6 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Preferences updated successfully</span>
        </div>
      )}
    </div>
  );
};
