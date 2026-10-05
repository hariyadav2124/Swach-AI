import React from 'react';
import { 
  Camera, 
  AlertCircle, 
  Sparkles, 
  PlusCircle, 
  MapPin, 
  ArrowRight, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Navigation, 
  ExternalLink,
  PhoneCall,
  Activity
} from 'lucide-react';
import { CommunityBin, CitizenRequest, LanguageCode, AppTab } from '../types';
import { translations } from '../translations';

interface HomeDashboardProps {
  bins: CommunityBin[];
  requests: CitizenRequest[];
  userName: string;
  activeSector: { id: string; name: string; ward: string };
  onOpenLocationModal: () => void;
  onSelectBin: (bin: CommunityBin) => void;
  onNavigateToDirections: (bin: CommunityBin) => void;
  onQuickReportIssue: (bin?: CommunityBin) => void;
  onQuickRequestCleaning: (bin?: CommunityBin) => void;
  onQuickRequestNewBin: () => void;
  setCurrentTab: (tab: AppTab) => void;
  language: LanguageCode;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  bins,
  requests,
  userName,
  activeSector,
  onOpenLocationModal,
  onSelectBin,
  onNavigateToDirections,
  onQuickReportIssue,
  onQuickRequestCleaning,
  onQuickRequestNewBin,
  setCurrentTab,
  language,
}) => {
  const t = translations[language];

  // Nearest 2-3 bins
  const nearestBins = [...bins]
    .sort((a, b) => a.distanceMeters - b.distanceMeters)
    .slice(0, 3);

  // Check for critical nearby bin
  const criticalNearbyBin = nearestBins.find((b) => b.status === 'critical' || b.fillLevel >= 85);

  // Latest 2-3 citizen requests
  const recentRequests = requests.slice(0, 3);

  const getStatusBadge = (status: CommunityBin['status'], fillLevel: number) => {
    switch (status) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            {t.critical}
          </span>
        );
      case 'filling':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            {t.filling}
          </span>
        );
      case 'serviced':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
            {t.serviced}
          </span>
        );
      case 'normal':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            {t.normal}
          </span>
        );
    }
  };

  const getFillLevelColor = (fill: number) => {
    if (fill >= 85) return 'bg-rose-600';
    if (fill >= 65) return 'bg-amber-500';
    return 'bg-emerald-600';
  };

  const getRequestStatusBadge = (status: CitizenRequest['status']) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Resolved
          </span>
        );
      case 'assigned':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
            <Clock className="w-3 h-3 text-blue-600" />
            Assigned
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
            <Activity className="w-3 h-3 text-purple-600" />
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-700 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded">
            Submitted
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7">
      {/* Citizen Greeting & Location Header */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-neutral-200/70 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            {t.goodMorning}, {userName}
          </h1>
          <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
            <span>{t.usingLocation}:</span>
            <span className="font-semibold text-neutral-800">{activeSector.name}</span>
            <span className="text-neutral-300">·</span>
            <span className="text-neutral-600">{activeSector.ward}</span>
            <button
              onClick={onOpenLocationModal}
              className="text-emerald-700 hover:text-emerald-800 font-medium underline underline-offset-2 ml-1"
            >
              {t.changeLocation}
            </button>
          </div>
        </div>

        {/* Quick Swachh Helpline Contact Badge */}
        <div className="hidden sm:flex items-center gap-3 bg-neutral-100/90 border border-neutral-200/80 rounded-lg px-3.5 py-2 text-xs">
          <PhoneCall className="w-4 h-4 text-emerald-700 shrink-0" />
          <div>
            <div className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider">Swachhata Citizen Helpline</div>
            <div className="font-mono font-bold text-neutral-900">1969 <span className="font-sans font-normal text-neutral-500">(Toll-free 24x7)</span></div>
          </div>
        </div>
      </section>

      {/* Community Alert (Contextual notification if a bin is critical) */}
      {criticalNearbyBin && (
        <section className="bg-amber-50/70 border border-amber-200/90 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 text-amber-800">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-amber-950">
                {criticalNearbyBin.id} ({criticalNearbyBin.name}) {t.criticalAlert}
              </p>
              <p className="text-xs text-amber-800 mt-0.5">
                Current fill: {criticalNearbyBin.fillLevel}% · This bin requires attention.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              onSelectBin(criticalNearbyBin);
              setCurrentTab('map');
            }}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-950 bg-white hover:bg-amber-100 border border-amber-300 rounded-md transition-colors shrink-0 self-start sm:self-center"
          >
            {t.viewOnMap}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </section>
      )}

      {/* Quick Actions (4 Restrained, Highly Visible Actions) */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Action 1: Scan Waste */}
          <button
            onClick={() => setCurrentTab('scanner')}
            className="flex flex-col text-left p-4 sm:p-5 bg-white hover:bg-neutral-50/80 border border-neutral-200/90 rounded-xl transition-all hover:border-neutral-300 shadow-xs group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-emerald-100">
              <Camera className="w-5 h-5" />
            </div>
            <span className="font-semibold text-neutral-900 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
              {t.scanWaste}
            </span>
            <span className="text-xs text-neutral-500 mt-1 line-clamp-1">
              AI camera identification
            </span>
          </button>

          {/* Action 2: Report Issue */}
          <button
            onClick={() => onQuickReportIssue()}
            className="flex flex-col text-left p-4 sm:p-5 bg-white hover:bg-neutral-50/80 border border-neutral-200/90 rounded-xl transition-all hover:border-neutral-300 shadow-xs group"
          >
            <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-rose-100">
              <AlertCircle className="w-5 h-5" />
            </div>
            <span className="font-semibold text-neutral-900 text-sm sm:text-base group-hover:text-rose-700 transition-colors">
              {t.reportIssue}
            </span>
            <span className="text-xs text-neutral-500 mt-1 line-clamp-1">
              Overflow, damage or spillage
            </span>
          </button>

          {/* Action 3: Request Cleaning */}
          <button
            onClick={() => onQuickRequestCleaning()}
            className="flex flex-col text-left p-4 sm:p-5 bg-white hover:bg-neutral-50/80 border border-neutral-200/90 rounded-xl transition-all hover:border-neutral-300 shadow-xs group"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-teal-100">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-semibold text-neutral-900 text-sm sm:text-base group-hover:text-teal-700 transition-colors">
              {t.requestCleaning}
            </span>
            <span className="text-xs text-neutral-500 mt-1 line-clamp-1">
              Sanitization & disinfection
            </span>
          </button>

          {/* Action 4: Request New Bin */}
          <button
            onClick={() => onQuickRequestNewBin()}
            className="flex flex-col text-left p-4 sm:p-5 bg-white hover:bg-neutral-50/80 border border-neutral-200/90 rounded-xl transition-all hover:border-neutral-300 shadow-xs group"
          >
            <div className="w-10 h-10 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-neutral-200">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="font-semibold text-neutral-900 text-sm sm:text-base group-hover:text-neutral-950 transition-colors">
              {t.requestNewBin}
            </span>
            <span className="text-xs text-neutral-500 mt-1 line-clamp-1">
              Suggest new location
            </span>
          </button>
        </div>
      </section>

      {/* Main Priority Area: Nearby Waste Status */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
              {t.nearbyWasteStatus}
            </h2>
            <p className="text-xs text-neutral-500">
              {t.nearbyWasteSub}
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('map')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>{t.viewOnMap}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nearestBins.map((bin) => {
            return (
              <div
                key={bin.id}
                className="bg-white border border-neutral-200/90 rounded-xl p-4 sm:p-5 flex flex-col justify-between hover:border-neutral-300 transition-all shadow-xs relative"
              >
                {/* Header row: ID & Status */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-neutral-900">
                          {bin.id}
                        </span>
                        <span className="text-neutral-300">·</span>
                        <span className="text-xs font-medium text-neutral-500">
                          {bin.distanceMeters} m away
                        </span>
                      </div>
                      <h3 className="font-semibold text-neutral-800 text-sm mt-0.5 line-clamp-1">
                        {bin.name}
                      </h3>
                    </div>
                    {getStatusBadge(bin.status, bin.fillLevel)}
                  </div>

                  {/* Fill Level Metric & Bar */}
                  <div className="mt-4 pt-3 border-t border-neutral-100">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-neutral-500 font-medium">{t.estimatedFill}</span>
                      <span className="font-mono font-bold text-neutral-900">{bin.fillLevel}%</span>
                    </div>
                    <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getFillLevelColor(bin.fillLevel)}`}
                        style={{ width: `${bin.fillLevel}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Timestamps & Predictive Intelligence */}
                  <div className="mt-3.5 space-y-1.5 text-xs text-neutral-500">
                    <div className="flex items-center justify-between">
                      <span>{t.lastCollection}:</span>
                      <span className="text-neutral-700 font-medium">{bin.lastCollection}</span>
                    </div>
                    {bin.predictedCriticalTime && (
                      <div className="flex items-center justify-between text-amber-800 bg-amber-50/80 px-2 py-1 rounded text-[11px] font-medium border border-amber-200/60">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" />
                          {t.predictedCritical}:
                        </span>
                        <span className="font-bold">{bin.predictedCriticalTime}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-3.5 border-t border-neutral-100 grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onSelectBin(bin)}
                    className="px-2 py-1.5 text-[11px] font-medium text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/70 rounded transition-colors text-center"
                  >
                    {t.viewDetails}
                  </button>
                  <button
                    onClick={() => onNavigateToDirections(bin)}
                    className="px-2 py-1.5 text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 rounded transition-colors flex items-center justify-center gap-1"
                  >
                    <Navigation className="w-3 h-3 text-emerald-700" />
                    <span>Navigate</span>
                  </button>
                  <button
                    onClick={() => onQuickReportIssue(bin)}
                    className="px-2 py-1.5 text-[11px] font-medium text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 rounded transition-colors text-center"
                  >
                    Report
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Requests Section */}
      <section className="bg-white border border-neutral-200/90 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-neutral-900 tracking-tight">
              {t.recentRequests}
            </h2>
            <p className="text-xs text-neutral-500">
              Track your logged complaints & service updates
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('requests')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>{t.viewAllRequests}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentRequests.length === 0 ? (
          <div className="py-6 text-center text-xs text-neutral-500">
            No active requests. Everything in your area is running smoothly!
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {recentRequests.map((req) => (
              <div 
                key={req.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-neutral-50/50 rounded-lg px-2 transition-colors cursor-pointer"
                onClick={() => setCurrentTab('requests')}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {req.type === 'complaint' && <AlertCircle className="w-4 h-4 text-rose-600" />}
                    {req.type === 'cleaning' && <Sparkles className="w-4 h-4 text-teal-600" />}
                    {req.type === 'new_bin' && <PlusCircle className="w-4 h-4 text-neutral-700" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-900 text-xs sm:text-sm">
                        {req.title}
                      </span>
                      <span className="font-mono text-[11px] text-neutral-400">
                        {req.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-0.5">
                      <span>{req.location}</span>
                      <span>·</span>
                      <span>{req.submittedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  {getRequestStatusBadge(req.status)}
                  <span className="text-neutral-400 text-xs hidden sm:inline">→</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Municipal Citizen Transparency Card */}
      <section className="bg-neutral-100/70 border border-neutral-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-600">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-200 flex items-center justify-center text-neutral-700 shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-neutral-900">
              Community Waste Collection Timing
            </div>
            <div>
              Ward 14 commercial & residential community bins are compacted twice daily: 07:00 AM – 09:30 AM & 06:00 PM – 08:30 PM.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-neutral-400">|</span>
          <span className="font-mono font-medium text-neutral-700">MC SLA: &lt; 3 hrs for overflow</span>
        </div>
      </section>
    </div>
  );
};
