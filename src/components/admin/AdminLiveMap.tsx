import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Filter, 
  Layers, 
  MapPin, 
  Truck, 
  Sparkles, 
  AlertTriangle, 
  Compass, 
  CheckCircle2, 
  PlusCircle, 
  Users,
  Maximize2
} from 'lucide-react';
import { AdminBin, AdminWorker, AdminNewBinRequest } from '../../types/admin';

interface AdminLiveMapProps {
  bins: AdminBin[];
  workers: AdminWorker[];
  newBinRequests: AdminNewBinRequest[];
  selectedBin: AdminBin | null;
  onSelectBin: (bin: AdminBin | null) => void;
  onSelectNewBinRequest?: (req: AdminNewBinRequest) => void;
  heightClass?: string;
}

export type MapFilterType = 'all' | 'bins' | 'collection' | 'sanitation' | 'complaints' | 'new_bins' | 'workers' | 'critical_only';

export const AdminLiveMap: React.FC<AdminLiveMapProps> = ({
  bins,
  workers,
  newBinRequests,
  selectedBin,
  onSelectBin,
  onSelectNewBinRequest,
  heightClass = 'h-[440px] lg:h-[500px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeFilter, setActiveFilter] = useState<MapFilterType>('all');

  // Center on Ward 14 · Sector 68 (Mohali / SAS Nagar)
  const defaultCenter: [number, number] = [30.6892, 76.7265];

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 14,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Keep map cached between tab changes
    };
  }, []);

  // Update Markers when data, filter, or selectedBin changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const layer = markersLayerRef.current;
    layer.clearLayers();

    // 1. Plot Bins
    const showBins = ['all', 'bins', 'critical_only', 'complaints', 'collection', 'sanitation'].includes(activeFilter);

    if (showBins) {
      bins.forEach((bin) => {
        if (activeFilter === 'critical_only' && bin.status !== 'critical') return;
        if (activeFilter === 'complaints' && bin.activeComplaintsCount === 0) return;
        if (activeFilter === 'sanitation' && !bin.wasteTypes.includes('wet') && bin.activeComplaintsCount === 0) return;

        const isSelected = selectedBin?.id === bin.id;
        const isCritical = bin.status === 'critical';
        const isFilling = bin.status === 'filling';

        // Pin styling based on system requirements
        let pinColor = '#10b981'; // GREEN: Normal
        let borderClass = 'border-emerald-600';
        let bgClass = 'bg-emerald-500 text-white';

        if (isCritical) {
          pinColor = '#f43f5e'; // RED: Critical
          borderClass = 'border-rose-700';
          bgClass = 'bg-rose-600 text-white';
        } else if (isFilling) {
          pinColor = '#f59e0b'; // AMBER: Filling / attention
          borderClass = 'border-amber-600';
          bgClass = 'bg-amber-500 text-neutral-950 font-bold';
        }

        const iconHtml = `
          <div class="relative cursor-pointer transition-transform transform ${isSelected ? 'scale-125 z-40' : 'hover:scale-110 z-20'}">
            ${isCritical ? `<div class="absolute -inset-1.5 rounded-full bg-rose-500/40 animate-ping"></div>` : ''}
            <div class="relative w-8 h-8 rounded-full ${bgClass} border-2 ${isSelected ? 'border-white ring-2 ring-neutral-900 shadow-xl' : borderClass} flex items-center justify-center text-[10px] font-mono font-bold shadow-md">
              ${bin.currentFill}%
            </div>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-neutral-800 rotate-45"></div>
          </div>
        `;

        const icon = L.divIcon({
          html: iconHtml,
          className: 'custom-bin-pin',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });

        const marker = L.marker(bin.coordinates, { icon });
        marker.on('click', () => {
          onSelectBin(bin);
        });

        layer.addLayer(marker);
      });
    }

    // 2. Plot Active Workers (BLUE)
    const showWorkers = ['all', 'workers', 'collection', 'sanitation'].includes(activeFilter);

    if (showWorkers) {
      workers.forEach((worker) => {
        if (activeFilter === 'collection' && worker.role !== 'Collection Worker') return;
        if (activeFilter === 'sanitation' && worker.role !== 'Sanitation Worker') return;

        const isCollection = worker.role === 'Collection Worker';
        const roleLabel = isCollection ? 'TRUCK' : 'VAN';

        const workerIconHtml = `
          <div class="relative cursor-pointer group z-30">
            <div class="w-9 h-9 rounded-xl bg-blue-600 border-2 border-white shadow-lg text-white flex items-center justify-center text-xs font-bold ring-2 ring-blue-400/50">
              ${isCollection ? '🚚' : '🧼'}
            </div>
            <div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[9px] font-mono px-1.5 py-0.5 rounded shadow whitespace-nowrap opacity-90 group-hover:opacity-100 font-bold">
              ${worker.vehicle}
            </div>
          </div>
        `;

        const workerIcon = L.divIcon({
          html: workerIconHtml,
          className: 'custom-worker-pin',
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        const workerMarker = L.marker(worker.coordinates, { icon: workerIcon });
        workerMarker.bindPopup(`
          <div class="text-xs p-1 space-y-1">
            <div class="font-bold text-neutral-900">${worker.name} (${worker.role})</div>
            <div class="text-neutral-500 font-mono text-[11px]">${worker.vehicle} · ${worker.team}</div>
            <div class="text-neutral-700">Currently at: <span class="font-semibold">${worker.currentLocationName}</span></div>
            <div class="text-teal-700 font-bold pt-1 border-t border-neutral-200">Progress: ${worker.completedTasks} / ${worker.totalTasks} bins</div>
          </div>
        `);

        layer.addLayer(workerMarker);
      });
    }

    // 3. Plot Citizen New-Bin Requests (PURPLE)
    const showNewBins = ['all', 'new_bins'].includes(activeFilter);

    if (showNewBins) {
      newBinRequests.forEach((req) => {
        const purpleHtml = `
          <div class="relative cursor-pointer group z-25">
            <div class="w-8 h-8 rounded-full bg-purple-600 border-2 border-white shadow-lg text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-purple-300">
              +${req.requestCount}
            </div>
            <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[8px] font-mono px-1 rounded shadow whitespace-nowrap">
              Gap ${req.nearestBinMeters}m
            </div>
          </div>
        `;

        const purpleIcon = L.divIcon({
          html: purpleHtml,
          className: 'custom-newbin-pin',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker(req.coordinates, { icon: purpleIcon });
        marker.on('click', () => {
          if (onSelectNewBinRequest) onSelectNewBinRequest(req);
        });

        layer.addLayer(marker);
      });
    }
  }, [bins, workers, newBinRequests, activeFilter, selectedBin]);

  // Center on selected bin if requested
  useEffect(() => {
    if (selectedBin && mapInstanceRef.current) {
      mapInstanceRef.current.panTo(selectedBin.coordinates, { animate: true, duration: 0.5 });
    }
  }, [selectedBin]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-neutral-200/90 shadow-xs bg-neutral-100 flex flex-col">
      {/* Map Control Bar / Filter Strip */}
      <div className="bg-white/95 backdrop-blur-md px-3 py-2 border-b border-neutral-200 flex items-center justify-between gap-2 overflow-x-auto z-10 scrollbar-none">
        <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
          <span className="text-[10px] font-mono font-bold uppercase text-neutral-400 px-1">Filter:</span>
          
          {[
            { id: 'all' as MapFilterType, label: 'All Elements' },
            { id: 'critical_only' as MapFilterType, label: '🚨 Critical Only', highlight: true },
            { id: 'bins' as MapFilterType, label: 'Bins (128)' },
            { id: 'workers' as MapFilterType, label: 'Workers (18)' },
            { id: 'collection' as MapFilterType, label: 'Collection' },
            { id: 'sanitation' as MapFilterType, label: 'Sanitation' },
            { id: 'complaints' as MapFilterType, label: 'Complaints' },
            { id: 'new_bins' as MapFilterType, label: 'New Requests (14)' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeFilter === f.id
                  ? f.highlight
                    ? 'bg-rose-600 text-white font-bold shadow-2xs'
                    : 'bg-neutral-900 text-white font-bold shadow-2xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80 hover:text-neutral-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="hidden xl:flex items-center gap-3 text-[10px] text-neutral-500 font-medium shrink-0 pl-2 border-l border-neutral-200">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Normal</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Filling</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-600"></span> Critical</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600"></span> Active Worker</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-600"></span> New-Bin Request</span>
        </div>
      </div>

      {/* Map Element */}
      <div ref={mapContainerRef} className={`w-full ${heightClass} z-0`} />

      {/* Map Floating Summary Badge */}
      <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-200 shadow-md text-xs font-mono flex items-center gap-3">
        <span className="text-neutral-500">Sector 68–71 GIS</span>
        <span className="text-neutral-300">|</span>
        <span className="text-rose-600 font-bold">7 Critical Bins</span>
        <span className="text-neutral-300">|</span>
        <span className="text-teal-700 font-bold">18/21 Field Units Active</span>
      </div>
    </div>
  );
};
