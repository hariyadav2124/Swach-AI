import React from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  PlusCircle, 
  Clock, 
  ArrowRight, 
  Check, 
  Trash2 
} from 'lucide-react';
import { CivicNotification, CommunityBin, CitizenRequest, LanguageCode, AppTab } from '../types';
import { translations } from '../translations';

interface NotificationsViewProps {
  notifications: CivicNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectBinById: (binId: string) => void;
  onSelectRequestById: (reqId: string) => void;
  setCurrentTab: (tab: AppTab) => void;
  language: LanguageCode;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectBinById,
  onSelectRequestById,
  setCurrentTab,
  language,
}) => {
  const t = translations[language];

  const getIcon = (type: CivicNotification['type']) => {
    switch (type) {
      case 'critical_bin':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'request_update':
        return <CheckCircle2 className="w-4 h-4 text-blue-600" />;
      case 'cleaning_assigned':
        return <Sparkles className="w-4 h-4 text-teal-600" />;
      case 'review':
        return <PlusCircle className="w-4 h-4 text-neutral-800" />;
      default:
        return <Bell className="w-4 h-4 text-neutral-600" />;
    }
  };

  const handleNotificationClick = (item: CivicNotification) => {
    onMarkAsRead(item.id);
    if (item.relatedBinId) {
      onSelectBinById(item.relatedBinId);
      setCurrentTab('map');
    } else if (item.relatedRequestId) {
      onSelectRequestById(item.relatedRequestId);
      setCurrentTab('requests');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-200/70 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            {t.notifications}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Real-time municipal alerts, bin threshold warnings, and service progress
          </p>
        </div>

        {notifications.some((n) => !n.read) && (
          <button
            onClick={onMarkAllAsRead}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-emerald-50 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-12 text-center space-y-3">
          <Bell className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="text-sm font-bold text-neutral-800">
            All caught up!
          </h3>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto">
            You have no new alerts or notifications from Municipal Corporation SAS Nagar.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 group ${
                item.read
                  ? 'bg-white border-neutral-200/70 hover:border-neutral-300'
                  : 'bg-emerald-50/30 border-emerald-200 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                  {getIcon(item.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-emerald-800 transition-colors">
                      {item.title}
                    </h3>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                    {item.message}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-2 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{item.timestamp}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 self-center">
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
