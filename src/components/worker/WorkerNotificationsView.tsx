import React from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Truck, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Check, 
  Wrench,
  AlertCircle
} from 'lucide-react';
import { WorkerNotification, WorkerTab, RouteStop } from '../../types/worker';

interface WorkerNotificationsViewProps {
  notifications: WorkerNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  setCurrentTab: (tab: WorkerTab) => void;
  onSelectBinById: (binId: string) => void;
}

export const WorkerNotificationsView: React.FC<WorkerNotificationsViewProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  setCurrentTab,
  onSelectBinById,
}) => {
  const getIcon = (type: WorkerNotification['type']) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'route_update':
        return <Truck className="w-4 h-4 text-emerald-600" />;
      case 'complaint':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'vehicle':
        return <Wrench className="w-4 h-4 text-neutral-700" />;
      default:
        return <Bell className="w-4 h-4 text-neutral-600" />;
    }
  };

  const handleClick = (notif: WorkerNotification) => {
    onMarkAsRead(notif.id);
    if (notif.binId) {
      onSelectBinById(notif.binId);
      setCurrentTab('route');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-200/70 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Field Dispatch Notifications
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Operational dispatches, capacity alerts, and vehicle maintenance reminders
          </p>
        </div>

        {notifications.some((n) => !n.read) && (
          <button
            onClick={onMarkAllAsRead}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center space-y-2">
          <Bell className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="text-sm font-bold text-neutral-800">You're all caught up</h3>
          <p className="text-xs text-neutral-500">No pending dispatch alerts or system updates.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleClick(notif)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 group ${
                notif.read
                  ? 'bg-white border-neutral-200/80 hover:border-neutral-300'
                  : 'bg-emerald-50/30 border-emerald-300 hover:border-emerald-400'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                  {getIcon(notif.type)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-emerald-800 transition-colors">
                      {notif.title}
                    </h3>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                    {notif.message}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-2 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{notif.timestamp}</span>
                  </div>
                </div>
              </div>

              <div className="self-center shrink-0">
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
