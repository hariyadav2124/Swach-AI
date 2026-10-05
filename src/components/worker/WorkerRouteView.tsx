import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Truck, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Info, 
  ArrowRight, 
  X, 
  Check, 
  Compass, 
  AlertCircle,
  Footprints,
  ShieldAlert,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { RouteStop, WorkerProfile } from '../../types/worker';
import { SECTORS } from '../../data/mockData';

const MAP_CENTER: [number, number] = [SECTORS[0].lat, SECTORS[0].lng];

interface WorkerRouteViewProps {
  stops: RouteStop[];
  selectedStop: RouteStop | null;
  onSelectStop: (stop: RouteStop | null) => void;
  onStartCollection: (stop: RouteStop) => void;
  onOpenDetails: (stop: RouteStop) => void;
  onReportProblem: (stop: RouteStop) => void;
  workerProfile: WorkerProfile;
}

export const WorkerRouteView: React.FC<WorkerRouteViewProps> = ({
  stops,
  selectedStop,
  onSelectStop,
  onStartCollection,
  onOpenDetails,
  onReportProblem,
  workerProfile,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const routeLineRef = useRef<L.Polyline | null>(null);

  const [simulatedNavActive, setSimulatedNavActive] = useState<boolean>(false);
  const [navigatingStop, setNavigatingStop] = useState<RouteStop | null>(null);
  const [filterView, setFilterView] = useState<'pending' | 'completed' | 'all'>('pending');

  const pendingStops = stops.filter((s) => s.status === 'pending' || s.status === 'in_progress');
  const completedStops = stops.filter((s) => s.status === 'completed');
  const routeDistanceKm = stops.reduce((sum, stop) => sum + stop.distanceMeters, 0) / 1000;

  const displayStops = stops.filter((s) => {
    if (filterView === 'pending') return s.status === 'pending' || s.status === 'in_progress';
    if (filterView === 'completed') return s.status === 'completed';
    return true;
  });

  // Marker icon builder
  const createStopMarkerIcon = (stop: RouteStop, isSelected: boolean, isCurrent: boolean) => {
    const isCompleted = stop.status === 'completed';
    let borderColor = '#059669'; // Emerald
    let textColor = '#111827';
    let fill = `${stop.estimatedFill}%`;

    if (isCompleted) {
      borderColor = '#9ca3af';
      fill = 'DONE';
    } else if (stop.urgency === 'critical' || stop.estimatedFill >= 85) {
      borderColor = '#e11d48'; // Red
    } else if (stop.urgency === 'high' || stop.estimatedFill >= 65) {
      borderColor = '#d97706'; // Amber
    }

    const size = isSelected || isCurrent ? 44 : 36;
    const ringPulse = isCurrent ? '<div style="position: absolute; inset: -5px; border-radius: 50%; border: 2px solid #059669; animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>' : '';

    const html = `
      <div style="position: relative; width: ${size}px; height: ${size + 8}px; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
        ${ringPulse}
        <div style="
          width: ${size}px; 
          height: ${size}px; 
          background-color: ${isCompleted ? '#f3f4f6' : 'white'}; 
          border: ${isSelected || isCurrent ? '3px' : '2px'} solid ${borderColor}; 
          border-radius: 50%; 
          display: flex; 
          flex-direction: column;
          align-items: center; 
          justify-content: center; 
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          font-family: ui-monospace, SFMono-Regular, monospace;
        ">
          <span style="font-size: ${isCompleted ? '9px' : '11px'}; font-weight: 800; color: ${textColor}; line-height: 1;">${fill}</span>
          <span style="font-size: 8px; font-weight: 700; color: ${borderColor}; text-transform: uppercase;">#${stop.order > 0 ? stop.order : '✓'}</span>
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
      className: 'worker-stop-marker',
      iconSize: [size, size + 8],
      iconAnchor: [size / 2, size + 8],
    });
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: MAP_CENTER,
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      // CartoDB Positron clean map tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
    }
  }, []);

  // Update Markers & Polyline Route
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing stop markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    // Remove existing route polyline
    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }

    // Add stop markers
    stops.forEach((stop) => {
      const isSelected = selectedStop?.id === stop.id;
      const isCurrent = pendingStops[0]?.id === stop.id;

      const marker = L.marker(stop.coordinates, {
        icon: createStopMarkerIcon(stop, isSelected, isCurrent),
        zIndexOffset: isSelected ? 800 : isCurrent ? 700 : 300,
      }).addTo(map);

      marker.on('click', () => {
        onSelectStop(stop);
      });

      markersRef.current[stop.id] = marker;
    });

    const routePoints = pendingStops.map((stop) => stop.coordinates);
    if (routePoints.length > 1) {
      routeLineRef.current = L.polyline(routePoints, {
        color: '#059669',
        weight: 3.5,
        dashArray: '6, 6',
        lineCap: 'round',
        opacity: 0.8,
      }).addTo(map);
    }
  }, [stops, selectedStop, pendingStops]);

  // Handle Simulated Navigation Launch
  const handleStartNavigation = (stop: RouteStop) => {
    setNavigatingStop(stop);
    setSimulatedNavActive(true);
    onSelectStop(stop);

    // Zoom map smoothly to vehicle and stop
    if (mapInstanceRef.current) {
      const bounds = L.latLngBounds([MAP_CENTER, stop.coordinates]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [80, 80], maxZoom: 16 });
    }
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(MAP_CENTER, 14, { animate: true });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Route Summary */}
      <section className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-neutral-900">
            Assigned Route
          </h1>
          <p className="text-xs text-neutral-500">
            {workerProfile.name} · {workerProfile.zone}
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div><span className="text-neutral-500">Total stops</span><div className="font-mono font-bold text-neutral-900">{stops.length}</div></div>
          <div><span className="text-neutral-500">Pending</span><div className="font-mono font-bold text-neutral-900">{pendingStops.length}</div></div>
          <div><span className="text-neutral-500">Completed</span><div className="font-mono font-bold text-neutral-900">{completedStops.length}</div></div>
          <div><span className="text-neutral-500">Recorded distance</span><div className="font-mono font-bold text-neutral-900">{routeDistanceKm.toFixed(1)} km</div></div>
        </div>
      </section>

      {/* Main Two-Column Layout (Desktop) / Stacked (Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Route Task List (5 Cols on LG) */}
        <div className="lg:col-span-5 space-y-4 order-2 lg:order-1">
          {/* Segmented Filter */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg border border-neutral-200 text-xs">
              <button
                onClick={() => setFilterView('pending')}
                className={`px-3 py-1.5 font-bold rounded-md transition-colors ${
                  filterView === 'pending'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Pending ({pendingStops.length})
              </button>
              <button
                onClick={() => setFilterView('completed')}
                className={`px-3 py-1.5 font-bold rounded-md transition-colors ${
                  filterView === 'completed'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Completed ({completedStops.length})
              </button>
              <button
                onClick={() => setFilterView('all')}
                className={`px-3 py-1.5 font-bold rounded-md transition-colors ${
                  filterView === 'all'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                All ({stops.length})
              </button>
            </div>

            <span className="text-[11px] text-neutral-400 font-mono">
              Vehicle {workerProfile.vehicle}
            </span>
          </div>

          {/* Stop Cards List */}
          <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
            {displayStops.map((stop, idx) => {
              const isSelected = selectedStop?.id === stop.id;
              const isFirstPending = pendingStops[0]?.id === stop.id;
              const isCompleted = stop.status === 'completed';

              return (
                <div
                  key={stop.id}
                  onClick={() => onSelectStop(stop)}
                  className={`border rounded-2xl p-4 transition-all cursor-pointer relative shadow-xs ${
                    isSelected
                      ? 'bg-neutral-900 text-white border-neutral-900 ring-2 ring-emerald-500'
                      : isFirstPending
                      ? 'bg-white border-emerald-400 ring-1 ring-emerald-300'
                      : isCompleted
                      ? 'bg-neutral-50/70 border-neutral-200 text-neutral-500 opacity-80'
                      : 'bg-white border-neutral-200/90 hover:border-neutral-300'
                  }`}
                >
                  {/* Top Row: Index, Bin ID, Distance, Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                        isSelected 
                          ? 'bg-neutral-800 text-emerald-400' 
                          : isCompleted 
                          ? 'bg-neutral-200 text-neutral-600'
                          : isFirstPending
                          ? 'bg-emerald-500 text-neutral-950'
                          : 'bg-neutral-100 text-neutral-800'
                      }`}>
                        {isCompleted ? '✓' : `0${idx + 1}`}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`font-mono text-xs font-extrabold ${isSelected ? 'text-white' : 'text-neutral-900'}`}>
                            {stop.binId}
                          </span>
                          <span className={isSelected ? 'text-neutral-600' : 'text-neutral-300'}>·</span>
                          <span className={`text-xs font-medium ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                            {stop.distance}
                          </span>
                        </div>
                        <h3 className={`font-semibold text-xs sm:text-sm mt-0.5 line-clamp-1 ${
                          isSelected ? 'text-white' : 'text-neutral-900'
                        }`}>
                          {stop.name}
                        </h3>
                      </div>
                    </div>

                    {/* Status badge */}
                    <div className="text-right">
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          COMPLETED
                        </span>
                      ) : stop.urgency === 'critical' || stop.estimatedFill >= 85 ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                          CRITICAL
                        </span>
                      ) : stop.urgency === 'high' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                          HIGH
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          NORMAL
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Fill Level Metric & Reason */}
                  <div className="mt-3 pt-2.5 border-t border-neutral-100/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={isSelected ? 'text-neutral-400' : 'text-neutral-500'}>
                        Estimated fill:
                      </span>
                      <span className={`font-mono font-bold ${
                        stop.estimatedFill >= 85 ? 'text-rose-600' : 'text-neutral-900'
                      } ${isSelected ? '!text-emerald-400' : ''}`}>
                        {stop.estimatedFill}%
                      </span>
                    </div>

                    {stop.predictedCriticalTime && !isCompleted && (
                      <div className="text-[11px] font-medium text-amber-500">
                        Critical in {stop.predictedCriticalTime}
                      </div>
                    )}
                  </div>

                  {/* Location subtitle */}
                  <div className={`text-[11px] mt-1.5 flex items-center gap-1 ${
                    isSelected ? 'text-neutral-400' : 'text-neutral-500'
                  }`}>
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="line-clamp-1">{stop.locationDescription}</span>
                  </div>

                  {/* Interactive Buttons (Visible when selected or for first pending stop) */}
                  {(isSelected || isFirstPending) && !isCompleted && (
                    <div className="mt-4 pt-3 border-t border-neutral-700/60 flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartCollection(stop);
                        }}
                        className="flex-1 min-h-[42px] px-3 py-2 text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>START COLLECTION</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartNavigation(stop);
                        }}
                        className="min-h-[42px] px-3 py-2 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Navigate</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDetails(stop);
                        }}
                        className="min-h-[42px] px-3 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800/80 rounded-lg border border-neutral-700"
                      >
                        Details
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Map Area (7 Cols on LG) */}
        <div className="lg:col-span-7 order-1 lg:order-2 space-y-3 sticky top-20">
          <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[640px] bg-neutral-100 rounded-2xl overflow-hidden border border-neutral-200/90 shadow-xs">
            {/* The Map Instance */}
            <div ref={mapContainerRef} className="w-full h-full z-10" />

            {/* Recenter Button */}
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={handleRecenter}
                className="w-10 h-10 bg-white/95 backdrop-blur-md border border-neutral-200 rounded-xl shadow-md flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors"
                title="Recenter map"
              >
                <Compass className="w-5 h-5 text-neutral-800" />
              </button>
            </div>

            {/* Map Legend Overlay */}
            <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md border border-neutral-200 rounded-xl p-2.5 shadow-md hidden sm:flex items-center gap-3 text-[11px] font-mono font-medium text-neutral-700">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                <span>Critical</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>High</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span>Normal</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-400"></span>
                <span>Done</span>
              </div>
            </div>

            {/* Simulated Turn-by-Turn Navigation Banner */}
            {simulatedNavActive && navigatingStop && (
              <div className="absolute top-16 inset-x-4 z-30 bg-neutral-950 text-white rounded-2xl p-4 shadow-2xl border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
                    <Navigation className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                        Turn-by-turn guidance
                      </span>
                      <span className="text-neutral-500">·</span>
                      <span className="font-mono text-xs text-neutral-300 font-bold">
                        {navigatingStop.distance} (Est. 2 mins)
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      Head North along Sector 68 Dividing Road toward {navigatingStop.binId}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => {
                      setSimulatedNavActive(false);
                      onStartCollection(navigatingStop);
                    }}
                    className="px-4 py-2 text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-xs"
                  >
                    Arrived at Bin
                  </button>
                  <button
                    onClick={() => setSimulatedNavActive(false)}
                    className="p-2 text-neutral-400 hover:text-white rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Sheet / Quick Inspector for Selected Stop on Mobile/Desktop */}
            {selectedStop && (
              <div className="absolute bottom-4 inset-x-4 sm:max-w-md sm:right-4 sm:left-auto z-20 bg-white/98 backdrop-blur-md border border-neutral-200 rounded-2xl p-4 shadow-xl space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-150">
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
                  <button
                    onClick={() => onSelectStop(null)}
                    className="text-neutral-400 hover:text-neutral-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Fill Level</span>
                    <span className="font-mono text-base font-extrabold text-neutral-900">{selectedStop.estimatedFill}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Capacity</span>
                    <span className="font-mono text-xs font-bold text-neutral-700">{selectedStop.capacityKg} kg</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Overflow Window</span>
                    <span className="font-mono text-xs font-bold text-amber-700">{selectedStop.predictedCriticalTime || 'Normal'}</span>
                  </div>
                </div>

                {/* Quick Action buttons */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => onStartCollection(selectedStop)}
                    className="px-3 py-2 text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg text-center"
                  >
                    Collect
                  </button>
                  <button
                    onClick={() => handleStartNavigation(selectedStop)}
                    className="px-3 py-2 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-center"
                  >
                    Navigate
                  </button>
                  <button
                    onClick={() => onOpenDetails(selectedStop)}
                    className="px-3 py-2 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-center"
                  >
                    Details
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
