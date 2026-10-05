import React from 'react';
import { 
  X, 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowRight,
  ShieldAlert,
  Check
} from 'lucide-react';
import { AdminNotification, AdminTab } from '../../types/admin';

interface AdminNotificationsModalProps {
  notifications: AdminNotification[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onSelectNotification: (notif: AdminNotification) => void;
}

export const AdminNotificationsModal: React.FC<AdminNotificationsModalProps> = ({
  notifications,
  onClose,
  onMarkAllAsRead,
  onSelectNotification,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-neutral-200 animate-in slide-in-from-right duration-150">
        {/* Header */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-teal-700" />
            <h2 className="text-sm font-bold text-neutral-900">Control Room Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-teal-700 hover:text-teal-900 font-semibold"
              >
                Mark all read
              </button>
            )}
            <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.map((notif) => {
            const isCrit = notif.severity === 'critical';
            const isWarn = notif.severity === 'warning';

            return (
              <div
                key={notif.id}
                onClick={() => onSelectNotification(notif)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  !notif.read
                    ? isCrit
                      ? 'bg-rose-50/40 border-rose-200 shadow-2xs'
                      : 'bg-teal-50/40 border-teal-200 shadow-2xs'
                    : 'bg-white border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${
                      isCrit ? 'bg-rose-500' : isWarn ? 'bg-amber-500' : 'bg-teal-500'
                    }`}></span>
                    <span className={`text-[10px] font-mono uppercase font-bold px-1.5 py-0.2 rounded ${
                      isCrit
                        ? 'bg-rose-100 text-rose-800'
                        : isWarn
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-teal-100 text-teal-800'
                    }`}>
                      {notif.type.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">{notif.timestamp}</span>
                </div>

                <h4 className="text-xs font-bold text-neutral-900 mt-1.5">{notif.title}</h4>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{notif.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
