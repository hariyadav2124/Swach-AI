import React from 'react';
import { Home, Map, Camera, ClipboardList, User } from 'lucide-react';
import { AppTab, LanguageCode } from '../types';
import { translations } from '../translations';

interface BottomNavProps {
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;
  language: LanguageCode;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  setCurrentTab,
  language,
}) => {
  const t = translations[language];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 lg:hidden pb-safe">
      <div className="grid grid-cols-5 h-16 items-center max-w-lg mx-auto px-2">
        {/* Home */}
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentTab === 'home' ? 'text-neutral-900 font-medium' : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <Home className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.2px] text-neutral-900' : ''}`} />
          <span className="text-[10px] mt-1">{language === 'hi' ? 'होम' : 'Home'}</span>
        </button>

        {/* Map */}
        <button
          onClick={() => setCurrentTab('map')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentTab === 'map' ? 'text-neutral-900 font-medium' : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <Map className={`w-5 h-5 ${currentTab === 'map' ? 'stroke-[2.2px] text-neutral-900' : ''}`} />
          <span className="text-[10px] mt-1">{language === 'hi' ? 'मैप' : 'Map'}</span>
        </button>

        {/* Central Scan Waste Hero CTA */}
        <div className="flex items-center justify-center -mt-5">
          <button
            onClick={() => setCurrentTab('scanner')}
            className={`w-13 h-13 rounded-full flex flex-col items-center justify-center shadow-lg transition-all transform active:scale-95 ${
              currentTab === 'scanner'
                ? 'bg-neutral-900 text-white ring-4 ring-neutral-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white ring-4 ring-emerald-100'
            }`}
            aria-label="Scan Waste"
          >
            <Camera className="w-5 h-5" />
            <span className="text-[9px] font-semibold tracking-tight mt-0.5">{language === 'hi' ? 'स्कैन' : 'Scan'}</span>
          </button>
        </div>

        {/* Requests */}
        <button
          onClick={() => setCurrentTab('requests')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentTab === 'requests' ? 'text-neutral-900 font-medium' : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <ClipboardList className={`w-5 h-5 ${currentTab === 'requests' ? 'stroke-[2.2px] text-neutral-900' : ''}`} />
          <span className="text-[10px] mt-1">{language === 'hi' ? 'अनुरोध' : 'Requests'}</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => setCurrentTab('profile')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentTab === 'profile' ? 'text-neutral-900 font-medium' : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <User className={`w-5 h-5 ${currentTab === 'profile' ? 'stroke-[2.2px] text-neutral-900' : ''}`} />
          <span className="text-[10px] mt-1">{language === 'hi' ? 'प्रोफ़ाइल' : 'Profile'}</span>
        </button>
      </div>
    </nav>
  );
};
