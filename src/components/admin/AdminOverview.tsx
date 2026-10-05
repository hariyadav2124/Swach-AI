import React, { useState } from 'react';
import { ArrowRight, MapPin, UserPlus } from 'lucide-react';
import {
  AdminBin,
  AdminWorker,
  AdminComplaint,
  AdminNewBinRequest,
  AdminKPIs,
  AdminTab,
} from '../../types/admin';
import { AdminLiveMap } from './AdminLiveMap';
import { AdminBinDetailPanel } from './AdminBinDetailPanel';

interface AdminOverviewProps {
  bins: AdminBin[];
  workers: AdminWorker[];
  complaints: AdminComplaint[];
  newBinRequests: AdminNewBinRequest[];
  kpis: AdminKPIs;
  setCurrentTab: (tab: AdminTab) => void;
  onOpenAssignModal: (bin: AdminBin) => void;
  onSelectBinForDetail: (bin: AdminBin | null) => void;
  selectedBin: AdminBin | null;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  bins,
  workers,
  complaints,
  newBinRequests,
  kpis,
  setCurrentTab,
  onOpenAssignModal,
  onSelectBinForDetail,
  selectedBin,
}) => {
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string | null>(null);
  const criticalBins = bins.filter((bin) => bin.status === 'critical');
  const predictedBins = [...bins]
    .filter((bin) => bin.predictedFillNext12h >= 90)
    .sort((a, b) => b.predictedFillNext12h - a.predictedFillNext12h);
  const sectors = [...new Set(bins.map((bin) => bin.sector))];
  const filteredBins = selectedAreaFilter
    ? bins.filter((bin) => bin.sector === selectedAreaFilter)
    : bins;

  const kpiCards: { label: string; value: string; detail: string; tab: AdminTab }[] = [
    {
      label: 'Community Bins',
      value: String(kpis.totalBins),
      detail: `${kpis.normalBins} normal · ${kpis.highRiskBins} at risk`,
      tab: 'bins',
    },
    {
      label: 'Critical Bins',
      value: String(kpis.criticalBins),
      detail: `${criticalBins.length} records`,
      tab: 'bins',
    },
    {
      label: 'Pending Requests',
      value: String(kpis.pendingRequests),
      detail: `${complaints.length} complaints · ${newBinRequests.length} bin requests`,
      tab: 'complaints',
    },
    {
      label: 'Active Workers',
      value: `${kpis.activeWorkers} / ${kpis.totalWorkers}`,
      detail: `${workers.length} worker records`,
      tab: 'workers',
    },
    {
      label: "Today's Collections",
      value: `${kpis.todayCollectionsDone} / ${kpis.todayCollectionsTotal}`,
      detail: 'Collection records',
      tab: 'collection',
    },
    {
      label: 'Sanitation Tasks',
      value: `${kpis.todaySanitationDone} / ${kpis.todaySanitationTotal}`,
      detail: 'Sanitation records',
      tab: 'sanitation',
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
            Municipal Operations Command Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-0.5">
            Municipal Operations
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Live operational records and service status.
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl border border-neutral-200 bg-white text-xs font-semibold text-neutral-700">
          {kpis.criticalBins > 0 ? 'Attention Required' : 'No urgent records'}
          <span className="text-[11px] text-neutral-500 block font-normal">
            {kpis.criticalBins} critical bins
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpiCards.map((card) => (
          <button
            key={card.label}
            onClick={() => setCurrentTab(card.tab)}
            className="p-3.5 rounded-xl bg-white border border-neutral-200/80 hover:border-neutral-300 text-left transition-all hover:shadow-xs"
          >
            <span className="text-[11px] font-medium text-neutral-500 block">{card.label}</span>
            <span className="text-2xl font-bold font-mono text-neutral-900 mt-0.5 block">{card.value}</span>
            <span className="text-[10px] text-neutral-400 font-mono mt-1 block">{card.detail}</span>
          </button>
        ))}
      </div>

      <section className="space-y-3">
        {sectors.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedAreaFilter(null)}
              className={`px-3 py-1.5 rounded-lg text-xs border ${
                selectedAreaFilter === null ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-700'
              }`}
            >
              All areas
            </button>
            {sectors.map((sector) => (
              <button
                key={sector}
                onClick={() => setSelectedAreaFilter(selectedAreaFilter === sector ? null : sector)}
                className={`px-3 py-1.5 rounded-lg text-xs border ${
                  selectedAreaFilter === sector ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-700'
                }`}
              >
                {sector}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 min-w-0">
            <AdminLiveMap
              bins={filteredBins}
              workers={workers}
              newBinRequests={newBinRequests}
              selectedBin={selectedBin}
              onSelectBin={onSelectBinForDetail}
              onSelectNewBinRequest={() => setCurrentTab('new_bins')}
              heightClass="h-[460px] lg:h-[540px]"
            />
          </div>
          {selectedBin && (
            <div className="w-full lg:w-96 shrink-0">
              <AdminBinDetailPanel
                bin={selectedBin}
                onClose={() => onSelectBinForDetail(null)}
                onAssignTask={onOpenAssignModal}
                onViewRoute={() => setCurrentTab('routes')}
              />
            </div>
          )}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Critical Bins</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Current records requiring attention.</p>
          </div>
          <button
            onClick={() => setCurrentTab('bins')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            View bins <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        {criticalBins.length === 0 ? (
          <p className="text-sm text-neutral-500 py-4">No critical bin records.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {criticalBins.slice(0, 3).map((bin) => (
              <div key={bin.id} className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3">
                <div>
                  <div className="font-bold text-neutral-900 text-sm">{bin.id} · {bin.name}</div>
                  <div className="text-xs text-neutral-600 mt-1">{bin.sector} · {bin.currentFill}% full</div>
                  <p className="text-xs text-neutral-500 mt-1">{bin.predictionReason}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onSelectBinForDetail(bin)}
                    className="flex-1 py-2 px-3 text-xs font-semibold bg-white border border-neutral-200 rounded-lg"
                  >
                    View details
                  </button>
                  {workers.length > 0 && (
                    <button
                      onClick={() => onOpenAssignModal(bin)}
                      className="py-2 px-3 text-xs font-semibold text-white bg-teal-700 rounded-lg flex items-center gap-1"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Assign
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900">Predicted Risk</h2>
            <button onClick={() => setCurrentTab('predictions')} className="text-xs text-teal-700 flex items-center gap-1">
              View analysis <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          {predictedBins.length === 0 ? (
            <p className="text-sm text-neutral-500 py-3">No forecast records available.</p>
          ) : (
            predictedBins.slice(0, 4).map((bin) => (
              <div key={bin.id} className="flex items-center justify-between border-t border-neutral-100 pt-2 text-xs">
                <span className="font-medium text-neutral-800">{bin.id} · {bin.name}</span>
                <span className="font-mono text-neutral-600">{bin.predictedFillNext12h}% in 12h</span>
              </div>
            ))
          )}
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 space-y-3">
          <h2 className="text-sm font-bold text-neutral-900">Areas with Bin Records</h2>
          {sectors.length === 0 ? (
            <p className="text-sm text-neutral-500 py-3">No area records available.</p>
          ) : (
            sectors.map((sector) => {
              const sectorBins = bins.filter((bin) => bin.sector === sector);
              const reports = complaints.filter((complaint) => complaint.sector === sector).length;
              return (
                <button
                  key={sector}
                  onClick={() => setSelectedAreaFilter(sector)}
                  className="w-full flex items-center justify-between border-t border-neutral-100 pt-2 text-xs text-left"
                >
                  <span className="flex items-center gap-1.5 font-medium text-neutral-800">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" /> {sector}
                  </span>
                  <span className="text-neutral-500">{sectorBins.length} bins · {reports} complaints</span>
                </button>
              );
            })
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setCurrentTab('collection')}
          className="bg-white rounded-2xl border border-neutral-200/90 p-5 text-left hover:border-neutral-300"
        >
          <h2 className="text-sm font-bold text-neutral-900">Collections</h2>
          <p className="text-lg font-mono mt-2">{kpis.todayCollectionsDone} / {kpis.todayCollectionsTotal}</p>
          <p className="text-xs text-neutral-500">Recorded today</p>
        </button>
        <button
          onClick={() => setCurrentTab('sanitation')}
          className="bg-white rounded-2xl border border-neutral-200/90 p-5 text-left hover:border-neutral-300"
        >
          <h2 className="text-sm font-bold text-neutral-900">Sanitation</h2>
          <p className="text-lg font-mono mt-2">{kpis.todaySanitationDone} / {kpis.todaySanitationTotal}</p>
          <p className="text-xs text-neutral-500">Recorded today</p>
        </button>
      </section>
    </div>
  );
};
