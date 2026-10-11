import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Compass,
  Layers,
  MapPin,
  Shield,
  Navigation,
  ExternalLink,
  Phone,
  Crosshair,
  Sun,
} from 'lucide-react';
import { LocationCoordinates, SafeHaven, GeofenceZone } from '../types';

interface MapSectionProps {
  coordinates: LocationCoordinates;
  safeHavens: SafeHaven[];
  geofences: GeofenceZone[];
  onSelectSafeHaven: (haven: SafeHaven) => void;
  selectedSafeHaven: SafeHaven | null;
}

export const MapSection: React.FC<MapSectionProps> = ({
  coordinates,
  safeHavens,
  geofences,
  onSelectSafeHaven,
  selectedSafeHaven,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const safeHavenMarkersRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const geofenceLayersRef = useRef<L.LayerGroup | null>(null);

  const [showSafeHavens, setShowSafeHavens] = useState(true);
  const [showSafeRoute, setShowSafeRoute] = useState(true);
  const [showGeofences, setShowGeofences] = useState(true);
  const [mapStyle, setMapStyle] = useState<'dark' | 'standard'>('dark');

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    const map = L.map(mapContainerRef.current, {
      center: [coordinates.latitude, coordinates.longitude],
      zoom: 16,
      zoomControl: false,
    });

    // Dark CartoDB tile layer for high-contrast emergency theme
    const darkTileLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO &copy; AWS Location',
        subdomains: 'abcd',
        maxZoom: 20,
      }
    );

    darkTileLayer.addTo(map);

    // Zoom control at bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;
    safeHavenMarkersRef.current = L.layerGroup().addTo(map);
    geofenceLayersRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Style
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    const tileUrl =
      mapStyle === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, {
      attribution: '&copy; OpenStreetMap &copy; AWS Location Service',
      maxZoom: 19,
    }).addTo(map);
  }, [mapStyle]);

  // Update User Marker & Accuracy Circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const latLng: [number, number] = [coordinates.latitude, coordinates.longitude];

    // Custom pulsing SVG User Marker
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 32px; height: 32px; border-radius: 9999px; background: rgba(56, 189, 248, 0.35); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: absolute; width: 22px; height: 22px; border-radius: 9999px; background: rgba(2, 132, 199, 0.8); border: 2px solid #ffffff; box-shadow: 0 0 10px rgba(56, 189, 248, 0.8);"></div>
          <div style="width: 8px; height: 8px; border-radius: 9999px; background: #ffffff;"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    if (!userMarkerRef.current) {
      userMarkerRef.current = L.marker(latLng, { icon: userIcon }).addTo(map);
    } else {
      userMarkerRef.current.setLatLng(latLng);
    }

    // Accuracy Circle
    if (!accuracyCircleRef.current) {
      accuracyCircleRef.current = L.circle(latLng, {
        radius: coordinates.accuracy,
        color: '#0284c7',
        fillColor: '#38bdf8',
        fillOpacity: 0.12,
        weight: 1.5,
        dashArray: '4, 4',
      }).addTo(map);
    } else {
      accuracyCircleRef.current.setLatLng(latLng);
      accuracyCircleRef.current.setRadius(coordinates.accuracy);
    }
  }, [coordinates]);

  // Render Safe Havens Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = safeHavenMarkersRef.current;
    if (!map || !group) return;

    group.clearLayers();
    if (!showSafeHavens) return;

    safeHavens.forEach((haven) => {
      const getColors = () => {
        if (haven.type === 'police') return { bg: '#2563eb', border: '#60a5fa', text: 'POLICE' };
        if (haven.type === 'hospital') return { bg: '#dc2626', border: '#f87171', text: 'MED' };
        if (haven.type === 'transit') return { bg: '#d97706', border: '#fbbf24', text: 'TRANSIT' };
        if (haven.type === 'lit_station') return { bg: '#059669', border: '#34d399', text: 'SAFE-LIT' };
        return { bg: '#475569', border: '#94a3b8', text: 'FIRE' };
      };

      const c = getColors();

      const havenIcon = L.divIcon({
        className: 'custom-haven-marker',
        html: `
          <div style="background: ${c.bg}; border: 2px solid ${c.border}; border-radius: 8px; padding: 3px 6px; font-weight: 700; font-size: 10px; color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.5); white-space: nowrap; cursor: pointer; text-align: center; transform: translate(-50%, -100%);">
            ${c.text}
          </div>
        `,
        iconSize: [40, 20],
        iconAnchor: [20, 10],
      });

      const marker = L.marker([haven.latitude, haven.longitude], { icon: havenIcon });
      marker.on('click', () => {
        onSelectSafeHaven(haven);
      });

      group.addLayer(marker);
    });
  }, [safeHavens, showSafeHavens, onSelectSafeHaven]);

  // Render Geofences
  useEffect(() => {
    const group = geofenceLayersRef.current;
    if (!group) return;
    group.clearLayers();

    if (!showGeofences) return;

    geofences.forEach((zone) => {
      const isSafe = zone.type === 'safe_haven';
      const circle = L.circle([zone.latitude, zone.longitude], {
        radius: zone.radiusMeters,
        color: isSafe ? '#10b981' : '#f59e0b',
        fillColor: isSafe ? '#10b981' : '#f59e0b',
        fillOpacity: 0.08,
        weight: 1.5,
      });
      group.addLayer(circle);
    });
  }, [geofences, showGeofences]);

  // Render Safe Lit Route to selected or nearest safe haven
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }

    if (!showSafeRoute) return;

    const targetHaven = selectedSafeHaven || safeHavens[0];
    if (!targetHaven) return;

    // Simulate illuminated walking waypoints through high-visibility grid
    const start: [number, number] = [coordinates.latitude, coordinates.longitude];
    const end: [number, number] = [targetHaven.latitude, targetHaven.longitude];
    const mid1: [number, number] = [
      coordinates.latitude + (targetHaven.latitude - coordinates.latitude) * 0.45,
      coordinates.longitude,
    ];
    const mid2: [number, number] = [
      coordinates.latitude + (targetHaven.latitude - coordinates.latitude) * 0.45,
      targetHaven.longitude,
    ];

    const polyline = L.polyline([start, mid1, mid2, end], {
      color: '#fbbf24',
      weight: 4,
      dashArray: '8, 8',
      opacity: 0.9,
    }).addTo(map);

    routePolylineRef.current = polyline;
  }, [coordinates, selectedSafeHaven, safeHavens, showSafeRoute]);

  const recenterMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([coordinates.latitude, coordinates.longitude], 16, {
        animate: true,
      });
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/80 flex flex-col h-[440px] sm:h-[480px]">
      {/* Top Map Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex items-center justify-between pointer-events-none">
        {/* Layer Toggles */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-950/80 backdrop-blur-md border border-slate-800/90 rounded-xl p-1 shadow-lg">
          <button
            onClick={() => setShowSafeHavens(!showSafeHavens)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              showSafeHavens
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Police & Emergency Havens"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Havens</span>
          </button>

          <button
            onClick={() => setShowSafeRoute(!showSafeRoute)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              showSafeRoute
                ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle AWS Illuminated Safe Path"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lit Route</span>
          </button>

          <button
            onClick={() => setShowGeofences(!showGeofences)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              showGeofences
                ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle AWS Geofence Perimeters"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Geofences</span>
          </button>
        </div>

        {/* Right Toolbar Actions */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setMapStyle(mapStyle === 'dark' ? 'standard' : 'dark')}
            className="p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white shadow-lg transition-colors"
            title="Toggle Map Style"
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            onClick={recenterMap}
            className="p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-sky-400 hover:text-sky-300 shadow-lg transition-colors"
            title="Recenter on My Location"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Actual Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="flex-1 w-full h-full z-0" />

      {/* Bottom Floating Safe Haven Card if selected */}
      {selectedSafeHaven && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md z-[1000] bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3.5 shadow-2xl text-slate-100 flex items-start justify-between gap-3 animate-in fade-in slide-in-from-bottom-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/40">
                {selectedSafeHaven.type.toUpperCase()}
              </span>
              <span className="text-xs text-amber-400 font-medium">
                {selectedSafeHaven.distanceMeters}m away
              </span>
              {selectedSafeHaven.isOpen247 && (
                <span className="text-[10px] text-emerald-400 font-mono">24/7 OPEN</span>
              )}
            </div>
            <p className="font-semibold text-sm text-white">{selectedSafeHaven.name}</p>
            <p className="text-xs text-slate-400">{selectedSafeHaven.address}</p>
          </div>

          <div className="flex flex-col gap-1.5">
            {selectedSafeHaven.phone && (
              <a
                href={`tel:${selectedSafeHaven.phone}`}
                className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-colors"
                title="Call Emergency Haven"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            )}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedSafeHaven.latitude},${selectedSafeHaven.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors"
              title="Open Navigation in Maps"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
