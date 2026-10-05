import React from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  Check, 
  Droplets,
  MessageSquare,
  Wrench
} from 'lucide-react';
import { SanitationNotification, SanitationTab } from '../../types/sanitation';

interface SanitationNotificationsViewProps {
  notifications: SanitationNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  setCurrentTab: (tab: SanitationTab) => void;
  onSelectBinById?: (binId: string) => void;
}

export const SanitationNotificationsView: React.FC<SanitationNotificationsViewProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  setCurrentTab,
  onSelectBinById,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: SanitationNotification['type']) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      case 'complaint':
        return <MessageSquare className="w-5 h-5 text-amber-600" />;
      case 'route_update':
        return <Sparkles className="w-5 h-5 text-teal-600" />;
      case 'equipment':
        return <Droplets className="w-5 h-5 text-blue-600" />;
      case 'task_assigned':
        return <CheckCircle2 className="w-5 h-5 text-teal-600" />;
      default:
        return <Bell className="w-5 h-5 text-neutral-600" />;
    }
  };

  const getBadgeColor = (type: SanitationNotification['type']) => {
    switch (type) {
      case 'critical':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'complaint':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'route_update':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'equipment':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">
              Operational Dispatch Feed
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight mt-0.5">
            Sanitation Alerts & Control Room
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time citizen escalations, route re-optimizations, and chemical inventory updates.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="self-start sm:self-auto px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all read ({unreadCount})</span>
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => onMarkAsRead(notif.id)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              notif.read
                ? 'bg-white border-neutral-200/70 hover:border-neutral-300'
                : 'bg-teal-50/30 border-teal-200/80 shadow-xs ring-1 ring-teal-500/20'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-lg bg-neutral-100 shrink-0">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${getBadgeColor(notif.type)}`}>
                      {notif.type.replace('_', ' ')}
                    </span>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-neutral-400 font-mono shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>{notif.timestamp}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-neutral-900 mt-1">
                  {notif.title}
                </h3>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  {notif.message}
                </p>

                {notif.binId && (
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectBinById) {
                          onSelectBinById(notif.binId!);
                          setCurrentTab('route');
                        }
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-teal-800 bg-teal-100/70 hover:bg-teal-200/80 rounded-md transition-colors flex items-center gap-1"
                    >
                      <span>Locate {notif.binId} on Route</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
