import React, { useState } from 'react';
import { 
  Trash2, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Sparkles, 
  ArrowUpDown, 
  ChevronRight,
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import { AdminBin } from '../../types/admin';

interface AdminBinsViewProps {
  bins: AdminBin[];
  onSelectBin: (bin: AdminBin) => void;
  onAssignTask: (bin: AdminBin) => void;
}

export const AdminBinsView: React.FC<AdminBinsViewProps> = ({
  bins,
  onSelectBin,
  onAssignTask,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sectorFilter, setSectorFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'fill_desc' | 'fill_asc' | 'id'>('fill_desc');

  const filteredBins = bins
    .filter((bin) => {
      if (sectorFilter !== 'All' && bin.sector !== sectorFilter) return false;
      if (statusFilter !== 'All' && bin.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          bin.id.toLowerCase().includes(q) ||
          bin.name.toLowerCase().includes(q) ||
          bin.locationDescription.toLowerCase().includes(q) ||
          (bin.assignedTeam && bin.assignedTeam.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'fill_desc') return b.currentFill - a.currentFill;
      if (sortBy === 'fill_asc') return a.currentFill - b.currentFill;
      return a.id.localeCompare(b.id);
    });

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
              Municipal Asset Registry
            </span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight mt-0.5">
            Community Bins Management ({bins.length})
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time ultrasonic sensor fill levels, predictive overflow intervals, and assigned collection teams.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-700 font-bold">
            7 Critical
          </span>
          <span className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 font-bold">
            16 Filling
          </span>
          <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
            105 Normal
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search bin ID, location, or assigned team..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Sector Filter */}
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="text-xs bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-2 font-medium text-neutral-700 focus:outline-none"
          >
            <option value="All">All Sectors</option>
            <option value="Sector 68">Sector 68</option>
            <option value="Sector 69">Sector 69</option>
            <option value="Sector 70">Sector 70</option>
            <option value="Sector 71">Sector 71</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-2 font-medium text-neutral-700 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="critical">Critical (≥85%)</option>
            <option value="filling">Filling (70-84%)</option>
            <option value="normal">Normal (&lt;70%)</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-2 font-medium text-neutral-700 focus:outline-none font-mono"
          >
            <option value="fill_desc">Sort: Fill (High to Low)</option>
            <option value="fill_asc">Sort: Fill (Low to High)</option>
            <option value="id">Sort: Bin ID</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 font-semibold">Bin ID & Name</th>
                <th className="py-3 px-4 font-semibold">Sector</th>
                <th className="py-3 px-4 font-semibold">Current Fill</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Last Collection</th>
                <th className="py-3 px-4 font-semibold">Last Cleaning</th>
                <th className="py-3 px-4 font-semibold">Predicted Critical</th>
                <th className="py-3 px-4 font-semibold">Assigned Team</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredBins.map((bin) => {
                const isCrit = bin.status === 'critical' || bin.currentFill >= 85;
                const isFilling = bin.status === 'filling';

                return (
                  <tr
                    key={bin.id}
                    onClick={() => onSelectBin(bin)}
                    className="hover:bg-neutral-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-900 group-hover:text-teal-700 transition-colors">
                        {bin.id}
                      </div>
                      <div className="text-[11px] text-neutral-500 truncate max-w-[200px]">
                        {bin.name}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-neutral-700">
                      {bin.sector}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold w-9 text-right ${
                          isCrit ? 'text-rose-600' : isFilling ? 'text-amber-600' : 'text-emerald-700'
                        }`}>
                          {bin.currentFill}%
                        </span>
                        <div className="w-16 bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isCrit ? 'bg-rose-500' : isFilling ? 'bg-amber-400' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${bin.currentFill}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        isCrit
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : isFilling
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {bin.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-600">
                      {bin.lastCollectionTime}
                    </td>

                    <td className="py-3.5 px-4 text-neutral-600">
                      {bin.lastSanitationTime}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`font-mono text-xs font-semibold ${
                        bin.predictedCriticalIn.includes('min') || bin.predictedCriticalIn.includes('1.') || bin.predictedCriticalIn.includes('2 ')
                          ? 'text-rose-600'
                          : 'text-neutral-600'
                      }`}>
                        {bin.predictedCriticalIn}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-neutral-800">{bin.assignedTeam || '—'}</div>
                      {bin.assignedWorker && (
                        <div className="text-[10px] text-neutral-400 font-mono">{bin.assignedWorker.split(' ')[0]}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onAssignTask(bin)}
                          className="px-2.5 py-1 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors border border-neutral-200"
                        >
                          Assign
                        </button>
                        <button
                          onClick={() => onSelectBin(bin)}
                          className="p-1 text-neutral-400 hover:text-neutral-900 rounded"
                          title="Open panel"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
