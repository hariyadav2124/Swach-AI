import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Compass, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  AlertTriangle, 
  X,
  Filter
} from 'lucide-react';
import { RouteStop } from '../../types/worker';
import { SECTORS } from '../../data/mockData';

const MAP_CENTER: [number, number] = [SECTORS[0].lat, SECTORS[0].lng];

interface WorkerMapViewProps {
  stops: RouteStop[];
  selectedStop: RouteStop | null;
  onSelectStop: (stop: RouteStop | null) => void;
  onStartCollection: (stop: RouteStop) => void;
  onOpenDetails: (stop: RouteStop) => void;
}

export const WorkerMapView: React.FC<WorkerMapViewProps> = ({
  stops,
  selectedStop,
  onSelectStop,
  onStartCollection,
  onOpenDetails,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const [urgencyFilter, setUrgencyFilter] = useState<'all' | 'critical' | 'pending' | 'completed'>('all');

  const filteredStops = stops.filter((stop) => {
    if (urgencyFilter === 'critical') return stop.urgency === 'critical' || stop.estimatedFill >= 85;
    if (urgencyFilter === 'pending') return stop.status === 'pending' || stop.status === 'in_progress';
    if (urgencyFilter === 'completed') return stop.status === 'completed';
    return true;
  });

  const createIcon = (stop: RouteStop, isSelected: boolean) => {
    const isCompleted = stop.status === 'completed';
    let borderColor = '#059669';
    let fill = `${stop.estimatedFill}%`;

    if (isCompleted) {
      borderColor = '#9ca3af';
      fill = 'DONE';
    } else if (stop.urgency === 'critical' || stop.estimatedFill >= 85) {
      borderColor = '#e11d48';
    } else if (stop.urgency === 'high' || stop.estimatedFill >= 65) {
      borderColor = '#d97706';
    }

    const size = isSelected ? 44 : 36;
    const html = `
      <div style="position: relative; width: ${size}px; height: ${size + 8}px; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
        <div style="
          width: ${size}px; 
          height: ${size}px; 
          background-color: ${isCompleted ? '#f3f4f6' : 'white'}; 
          border: ${isSelected ? '3px' : '2px'} solid ${borderColor}; 
          border-radius: 50%; 
          display: flex; 
          flex-direction: column;
          align-items: center; 
          justify-content: center; 
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          font-family: ui-monospace, SFMono-Regular, monospace;
        ">
          <span style="font-size: ${isCompleted ? '9px' : '11px'}; font-weight: 800; color: #111827; line-height: 1;">${fill}</span>
          <span style="font-size: 8px; font-weight: 700; color: ${borderColor}; text-transform: uppercase;">BIN</span>
        </div>
        <div style="
          width: 0; 
          height: 0; 
          border-left: 5px solid transparent; 
          border-right: 5px solid transparent; 
          border-top: 6px solid ${borderColor}; 
          margin-top: -1px;
        "></div>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'worker-map-marker',
      iconSize: [size, size + 8],
      iconAnchor: [size / 2, size + 8],
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: MAP_CENTER,
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
    }
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    filteredStops.forEach((stop) => {
      const isSelected = selectedStop?.id === stop.id;
      const marker = L.marker(stop.coordinates, {
        icon: createIcon(stop, isSelected),
        zIndexOffset: isSelected ? 800 : 200,
      }).addTo(map);

      marker.on('click', () => {
        onSelectStop(stop);
      });

      markersRef.current[stop.id] = marker;
    });
  }, [filteredStops, selectedStop]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(MAP_CENTER, 14, { animate: true });
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem-4rem)] lg:h-[calc(100vh-4rem-3rem)] bg-neutral-100 overflow-hidden flex flex-col">
      {/* Top Filter Bar */}
      <div className="absolute top-4 inset-x-4 z-20 pointer-events-none flex items-center justify-between gap-2">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-neutral-200 shadow-md rounded-xl p-1 flex items-center gap-1">
          <button
            onClick={() => setUrgencyFilter('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              urgencyFilter === 'all'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            All Bins ({stops.length})
          </button>
          <button
            onClick={() => setUrgencyFilter('critical')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              urgencyFilter === 'critical'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Critical
          </button>
          <button
            onClick={() => setUrgencyFilter('pending')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              urgencyFilter === 'pending'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setUrgencyFilter('completed')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              urgencyFilter === 'completed'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Completed
          </button>
        </div>

        <button
          onClick={handleRecenter}
          className="pointer-events-auto w-10 h-10 bg-white/95 backdrop-blur-md border border-neutral-200 rounded-xl shadow-md flex items-center justify-center text-neutral-800 hover:text-neutral-950 transition-colors"
        >
          <Compass className="w-5 h-5" />
        </button>
      </div>

      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Selected Stop Bottom Card */}
      {selectedStop && (
        <div className="absolute bottom-4 inset-x-4 sm:max-w-md sm:right-4 sm:left-auto z-20 bg-white/98 backdrop-blur-md border border-neutral-200 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-neutral-900">{selectedStop.binId}</span>
                <span className="text-neutral-300">·</span>
                <span className="text-xs font-medium text-neutral-500">{selectedStop.distance}</span>
              </div>
              <h3 className="font-bold text-neutral-900 text-sm mt-0.5">{selectedStop.name}</h3>
              <p className="text-[11px] text-neutral-500 line-clamp-1">{selectedStop.locationDescription}</p>
            </div>
            <button onClick={() => onSelectStop(null)} className="text-neutral-400 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Fill Level</span>
              <span className="font-mono text-lg font-bold text-neutral-900">{selectedStop.estimatedFill}%</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Capacity</span>
              <span className="font-mono text-xs font-bold text-neutral-700">{selectedStop.capacityKg} kg</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Overflow Risk</span>
              <span className="font-mono text-xs font-bold text-amber-700">{selectedStop.predictedCriticalTime || 'Normal'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {selectedStop.status !== 'completed' && (
              <button
                onClick={() => onStartCollection(selectedStop)}
                className="px-3 py-2 text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg text-center"
              >
                Start Collection
              </button>
            )}
            <button
              onClick={() => onOpenDetails(selectedStop)}
              className="px-3 py-2 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-center"
            >
              View Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
