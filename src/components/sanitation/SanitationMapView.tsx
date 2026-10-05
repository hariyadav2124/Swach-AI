import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Compass, 
  MapPin, 
  Navigation, 
  Sparkles, 
  AlertTriangle, 
  X,
  Filter
} from 'lucide-react';
import { SanitationTask } from '../../types/sanitation';
import { SECTORS } from '../../data/mockData';

const MAP_CENTER: [number, number] = [SECTORS[0].lat, SECTORS[0].lng];

interface SanitationMapViewProps {
  tasks: SanitationTask[];
  selectedTask: SanitationTask | null;
  onSelectTask: (task: SanitationTask | null) => void;
  onStartTask: (task: SanitationTask) => void;
  onOpenDetails: (task: SanitationTask) => void;
}

export const SanitationMapView: React.FC<SanitationMapViewProps> = ({
  tasks,
  selectedTask,
  onSelectTask,
  onStartTask,
  onOpenDetails,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const [riskFilter, setRiskFilter] = useState<'all' | 'critical' | 'high' | 'completed'>('all');

  const filteredTasks = tasks.filter((t) => {
    if (riskFilter === 'critical') return t.urgency === 'critical';
    if (riskFilter === 'high') return t.urgency === 'high';
    if (riskFilter === 'completed') return t.status === 'completed';
    return true;
  });

  const createIcon = (task: SanitationTask, isSelected: boolean) => {
    const isCompleted = task.status === 'completed';
    let borderColor = '#0d9488';
    let badgeText = 'NORM';

    if (isCompleted) {
      borderColor = '#9ca3af';
      badgeText = 'DONE';
    } else if (task.urgency === 'critical') {
      borderColor = '#e11d48';
      badgeText = 'CRIT';
    } else if (task.urgency === 'high') {
      borderColor = '#d97706';
      badgeText = 'HIGH';
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
          <span style="font-size: ${isCompleted ? '9px' : '10px'}; font-weight: 800; color: #111827; line-height: 1;">${badgeText}</span>
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
      className: 'sanitation-map-marker',
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

    filteredTasks.forEach((task) => {
      const isSelected = selectedTask?.id === task.id;
      const marker = L.marker(task.coordinates, {
        icon: createIcon(task, isSelected),
        zIndexOffset: isSelected ? 800 : 200,
      }).addTo(map);

      marker.on('click', () => {
        onSelectTask(task);
      });

      markersRef.current[task.id] = marker;
    });
  }, [filteredTasks, selectedTask]);

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
            onClick={() => setRiskFilter('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              riskFilter === 'all'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            All Locations ({tasks.length})
          </button>
          <button
            onClick={() => setRiskFilter('critical')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              riskFilter === 'critical'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Critical
          </button>
          <button
            onClick={() => setRiskFilter('high')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              riskFilter === 'high'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            High Risk
          </button>
          <button
            onClick={() => setRiskFilter('completed')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              riskFilter === 'completed'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Sanitized
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

      {/* Selected Task Bottom Card */}
      {selectedTask && (
        <div className="absolute bottom-4 inset-x-4 sm:max-w-md sm:right-4 sm:left-auto z-20 bg-white/98 backdrop-blur-md border border-neutral-200 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-neutral-900">{selectedTask.binId}</span>
                <span className="text-neutral-300">·</span>
                <span className="text-xs font-medium text-neutral-500">{selectedTask.distance}</span>
              </div>
              <h3 className="font-bold text-neutral-900 text-sm mt-0.5">{selectedTask.name}</h3>
              <p className="text-[11px] text-neutral-500 line-clamp-1">{selectedTask.locationDescription}</p>
            </div>
            <button onClick={() => onSelectTask(null)} className="text-neutral-400 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Sanitation Action Required</span>
            <div className="font-bold text-neutral-900">{selectedTask.primaryIssue}</div>
            <div className="text-[11px] text-neutral-500">Last cleaned: {selectedTask.lastCleaned}</div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {selectedTask.status !== 'completed' && (
              <button
                onClick={() => onStartTask(selectedTask)}
                className="px-3 py-2 text-xs font-bold text-neutral-950 bg-teal-400 hover:bg-teal-300 rounded-lg text-center"
              >
                Start Task
              </button>
            )}
            <button
              onClick={() => onOpenDetails(selectedTask)}
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
