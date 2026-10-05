import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Filter, 
  Navigation, 
  AlertCircle, 
  Info, 
  X, 
  Clock, 
  MapPin, 
  Compass, 
  CheckCircle2, 
  Layers,
  ArrowRight,
  Footprints
} from 'lucide-react';
import { CommunityBin, LanguageCode, AppTab } from '../types';
import { translations } from '../translations';

interface NearbyBinsMapProps {
  bins: CommunityBin[];
  selectedBin: CommunityBin | null;
  onSelectBin: (bin: CommunityBin | null) => void;
  onOpenDetailsModal: (bin: CommunityBin) => void;
  onOpenReportModal: (bin: CommunityBin) => void;
  activeDirectionsBin: CommunityBin | null;
  setActiveDirectionsBin: (bin: CommunityBin | null) => void;
  activeSector: { id: string; name: string; lat: number; lng: number };
  language: LanguageCode;
}

export const NearbyBinsMap: React.FC<NearbyBinsMapProps> = ({
  bins,
  selectedBin,
  onSelectBin,
  onOpenDetailsModal,
  onOpenReportModal,
  activeDirectionsBin,
  setActiveDirectionsBin,
  activeSector,
  language,
}) => {
  const t = translations[language];

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const routeLineRef = useRef<L.Polyline | null>(null);

  const [statusFilter, setStatusFilter] = useState<'all' | 'normal' | 'filling' | 'critical'>('all');
  const [streamFilter, setStreamFilter] = useState<'all' | 'dry' | 'wet'>('all');

  // Filtered bins
  const filteredBins = bins.filter((bin) => {
    if (statusFilter !== 'all' && bin.status !== statusFilter) return false;
    if (streamFilter !== 'all' && !bin.binTypes.includes(streamFilter as any)) return false;
    return true;
  });

  // Citizen default coordinates
  const citizenCoords: [number, number] = [activeSector.lat, activeSector.lng];

  // Helper to generate SVG icon for Leaflet marker
  const createBinIcon = (status: CommunityBin['status'], fillLevel: number, isSelected: boolean) => {
    let color = '#059669'; // Emerald (normal)
    let fillBadgeBg = '#d1fae5';
    let fillBadgeText = '#065f46';

    if (status === 'critical' || fillLevel >= 85) {
      color = '#e11d48'; // Red (critical)
      fillBadgeBg = '#ffe4e6';
      fillBadgeText = '#9f1239';
    } else if (status === 'filling' || fillLevel >= 65) {
      color = '#d97706'; // Amber (filling)
      fillBadgeBg = '#fef3c7';
      fillBadgeText = '#92400e';
    } else if (status === 'serviced') {
      color = '#0d9488'; // Teal (serviced)
      fillBadgeBg = '#ccfbf1';
      fillBadgeText = '#115e59';
    }

    const size = isSelected ? 42 : 36;
    const strokeWidth = isSelected ? 3 : 2;

    const html = `
      <div style="position: relative; width: ${size}px; height: ${size + 8}px; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.15s ease;">
        <div style="
          width: ${size}px; 
          height: ${size}px; 
          background-color: white; 
          border: ${strokeWidth}px solid ${color}; 
          border-radius: 50%; 
          display: flex; 
          flex-direction: column;
          align-items: center; 
          justify-content: center; 
          box-shadow: 0 4px 12px rgba(0,0,0,0.18);
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        ">
          <span style="font-size: 11px; font-weight: 700; color: #111827; line-height: 1;">${fillLevel}%</span>
          <span style="font-size: 8px; font-weight: 600; color: ${color}; text-transform: uppercase;">BIN</span>
        </div>
        <div style="
          width: 0; 
          height: 0; 
          border-left: 5px solid transparent; 
          border-right: 5px solid transparent; 
          border-top: 6px solid ${color}; 
          margin-top: -1px;
        "></div>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-bin-marker',
      iconSize: [size, size + 8],
      iconAnchor: [size / 2, size + 8],
      popupAnchor: [0, -(size + 8)],
    });
  };

  // User location marker icon
  const createUserIcon = () => {
    const html = `
      <div style="position: relative; width: 24px; height: 24px;">
        <div style="position: absolute; inset: 0; border-radius: 50%; background-color: rgba(16, 185, 129, 0.25); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: absolute; inset: 4px; border-radius: 50%; background-color: #059669; border: 2.5px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
      </div>
    `;
    return L.divIcon({
      html,
      className: 'user-location-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // CartoDB Positron: Crisp, light, fintech/civic-tech style tiles without visual clutter
      const map = L.map(mapContainerRef.current, {
        center: citizenCoords,
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Add zoom control in top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Add citizen position marker
      L.marker(citizenCoords, { icon: createUserIcon(), zIndexOffset: 1000 })
        .addTo(map)
        .bindTooltip('You are here (Sector 68)', { direction: 'top', offset: [0, -12] });

      mapInstanceRef.current = map;
    }

    return () => {
      // Keep map instance alive across rerenders unless component completely unmounts
    };
  }, []);

  // Update map center when sector changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(citizenCoords, 15);
    }
  }, [activeSector.lat, activeSector.lng]);

  // Sync Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    filteredBins.forEach((bin) => {
      const isSelected = selectedBin?.id === bin.id;
      const marker = L.marker(bin.coordinates, {
        icon: createBinIcon(bin.status, bin.fillLevel, isSelected),
        zIndexOffset: isSelected ? 500 : 100,
      }).addTo(map);

      marker.on('click', () => {
        onSelectBin(bin);
      });

      markersRef.current[bin.id] = marker;
    });
  }, [filteredBins, selectedBin]);

  // Handle Walking Directions Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }

    if (activeDirectionsBin) {
      // Simulated realistic walking route following street grid in Sector 68
      const start = citizenCoords;
      const end = activeDirectionsBin.coordinates;
      const midpoint: [number, number] = [
        start[0] + (end[0] - start[0]) * 0.7,
        start[1] + (end[1] - start[1]) * 0.2,
      ];

      const routePoints: [number, number][] = [start, midpoint, end];

      const polyline = L.polyline(routePoints, {
        color: '#059669',
        weight: 4,
        dashArray: '8, 8',
        lineCap: 'round',
        opacity: 0.85,
      }).addTo(map);

      routeLineRef.current = polyline;

      // Fit map bounds to show route
      const bounds = L.latLngBounds(routePoints);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
    }
  }, [activeDirectionsBin]);

  // Recenter to citizen position
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(citizenCoords, 15, { animate: true });
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem-4rem)] lg:h-[calc(100vh-4rem-2.75rem)] bg-neutral-100 overflow-hidden flex flex-col">
      {/* Top Filter Bar Controls */}
      <div className="absolute top-4 inset-x-4 z-20 pointer-events-none flex flex-wrap items-center justify-between gap-2">
        {/* Status Filters */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-neutral-200/90 shadow-md rounded-lg p-1 flex items-center gap-1">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'all'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {t.all} ({bins.length})
          </button>
          <button
            onClick={() => setStatusFilter('normal')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'normal'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {t.normal}
          </button>
          <button
            onClick={() => setStatusFilter('filling')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'filling'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {t.filling}
          </button>
          <button
            onClick={() => setStatusFilter('critical')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'critical'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {t.critical}
          </button>
        </div>

        {/* Recenter Button */}
        <div className="pointer-events-auto">
          <button
            onClick={handleRecenter}
            className="w-9 h-9 bg-white/95 backdrop-blur-md border border-neutral-200/90 rounded-lg shadow-md flex items-center justify-center text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 transition-colors"
            title="Recenter to my location"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* The Leaflet Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Walking Directions Banner Overlay if Active */}
      {activeDirectionsBin && (
        <div className="absolute top-18 inset-x-4 sm:max-w-md sm:mx-auto z-20 bg-neutral-900 text-white rounded-xl p-3.5 shadow-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Footprints className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Walking Route to {activeDirectionsBin.id}</span>
                <span className="text-emerald-400">· {Math.round(activeDirectionsBin.distanceMeters / 80)} min walk</span>
              </div>
              <div className="text-[11px] text-neutral-300">
                {activeDirectionsBin.distanceMeters} m · Walk straight along Park Road toward Gate 2
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveDirectionsBin(null)}
            className="text-neutral-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bottom Sheet / Card for Selected Bin */}
      {selectedBin && (
        <div className="absolute bottom-4 inset-x-4 sm:max-w-md sm:right-4 sm:left-auto z-20 bg-white/98 backdrop-blur-md border border-neutral-200/90 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-neutral-900">{selectedBin.id}</span>
                <span className="text-neutral-300">·</span>
                <span className="text-xs font-medium text-neutral-500">{selectedBin.distanceMeters} m away</span>
              </div>
              <h3 className="font-semibold text-neutral-900 text-sm mt-0.5">{selectedBin.name}</h3>
              <p className="text-[11px] text-neutral-500 line-clamp-1">{selectedBin.locationDescription}</p>
            </div>
            <button
              onClick={() => onSelectBin(null)}
              className="text-neutral-400 hover:text-neutral-600 p-1 -mr-1 -mt-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Status & Fill Indicator */}
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                {t.estimatedFill}
              </div>
              <div className="font-mono text-lg font-bold text-neutral-900">
                {selectedBin.fillLevel}%
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                {t.lastCollection}
              </div>
              <div className="text-xs font-medium text-neutral-800">
                {selectedBin.lastCollection}
              </div>
            </div>
          </div>

          {/* Prediction estimate badge if present */}
          {selectedBin.predictedCriticalTime && (
            <div className="flex items-center gap-1.5 text-xs text-amber-900 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200/70 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>{t.predictedCritical}: <strong>{selectedBin.predictedCriticalTime}</strong></span>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-2 grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                setActiveDirectionsBin(selectedBin);
              }}
              className="px-2.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Directions</span>
            </button>

            <button
              onClick={() => onOpenReportModal(selectedBin)}
              className="px-2.5 py-2 text-xs font-medium text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 rounded-lg transition-colors text-center"
            >
              {t.reportIssue}
            </button>

            <button
              onClick={() => onOpenDetailsModal(selectedBin)}
              className="px-2.5 py-2 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors text-center"
            >
              {t.viewDetails}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
