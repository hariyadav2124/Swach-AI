import React from 'react';
import { 
  MapPin, 
  Bell, 
  Languages, 
  Home, 
  Map as MapIcon, 
  Camera, 
  AlertCircle, 
  Sparkles, 
  PlusCircle, 
  ClipboardList, 
  User,
  ShieldCheck,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { AppTab, LanguageCode } from '../types';
import { translations } from '../translations';
import { AuthSession } from '../types/auth';

interface NavbarProps {
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;
  activeSector: { id: string; name: string; ward: string };
  onOpenLocationModal: () => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  unreadCount: number;
  session?: AuthSession | null;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  activeSector,
  onOpenLocationModal,
  language,
  setLanguage,
  unreadCount,
  session,
  onSignOut,
}) => {
  const t = translations[language];

  const navItems = [
    { id: 'home' as AppTab, label: 'Home', icon: Home },
    { id: 'map' as AppTab, label: 'Nearby Bins', icon: MapIcon },
    { id: 'scanner' as AppTab, label: 'AI Waste Scanner', icon: Camera, highlight: true },
    { id: 'report' as AppTab, label: 'Report Issue', icon: AlertCircle },
    { id: 'sanitization' as AppTab, label: 'Sanitization', icon: Sparkles },
    { id: 'new_bin' as AppTab, label: 'Request New Bin', icon: PlusCircle },
    { id: 'requests' as AppTab, label: 'My Requests', icon: ClipboardList },
    { id: 'notifications' as AppTab, label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'profile' as AppTab, label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Top Header Bar for Desktop & Mobile */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Municipal Branding */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentTab('home')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:bg-neutral-800 transition-colors">
                <span className="text-emerald-400 text-lg leading-none">❖</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-neutral-900 tracking-tight text-base">CivicWaste</span>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-xs border border-emerald-200/60 font-medium">CITIZEN</span>
                </div>
                <div className="text-[11px] text-neutral-500 font-normal leading-none hidden sm:block">
                  MC SAS Nagar · Swachh Nagar
                </div>
              </div>
            </button>

            {/* Location Indicator (Clickable to switch sectors) */}
            <div className="hidden md:flex items-center ml-4 pl-4 border-l border-neutral-200">
              <button
                onClick={onOpenLocationModal}
                className="flex items-center gap-1.5 text-xs text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200/70 transition-colors px-2.5 py-1.5 rounded-md"
                title="Change location"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-medium text-neutral-600">{t.usingLocation}:</span>
                <span className="font-semibold text-neutral-900 truncate max-w-[140px]">{activeSector.name}</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile location pill */}
            <button
              onClick={onOpenLocationModal}
              className="flex md:hidden items-center gap-1 text-[11px] bg-neutral-100 text-neutral-800 px-2 py-1 rounded font-medium truncate max-w-[130px]"
            >
              <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">{activeSector.name.split(',')[0]}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-neutral-100/80 hover:bg-neutral-100 rounded-md transition-colors border border-neutral-200/60"
              title="Toggle English / Hindi"
            >
              <Languages className="w-3.5 h-3.5 text-neutral-500" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Notifications Button */}
            <button
              onClick={() => setCurrentTab('notifications')}
              className="relative p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
              title={t.notifications}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-600 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {/* User Profile Pill */}
            <button
              onClick={() => setCurrentTab('profile')}
              className="hidden sm:flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-md hover:bg-neutral-100 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-semibold text-neutral-700">
                {session ? session.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'AS'}
              </div>
              <div className="text-left hidden lg:block">
                <div className="text-xs font-semibold text-neutral-900 leading-tight">{session?.name || 'Citizen'}</div>
                <div className="text-[10px] text-neutral-500 leading-none">{session?.identifier || activeSector.name.split(',')[0]}</div>
              </div>
            </button>

            {onSignOut && (
              <button
                onClick={onSignOut}
                title="Sign Out to Login Gateway"
                className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-neutral-100 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Desktop Secondary Horizontal Navigation */}
      <nav className="hidden lg:block bg-white border-b border-neutral-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-1 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors relative ${
                    isActive
                      ? 'bg-neutral-900 text-white shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : item.highlight ? 'text-emerald-600' : 'text-neutral-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && item.badge > 0 ? (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isActive ? 'bg-white text-neutral-900' : 'bg-neutral-200 text-neutral-800'
                    }`}>
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};
