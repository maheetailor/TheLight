import React from 'react';
import {
  MapPin,
  Compass,
  PhoneCall,
  RefreshCw,
  Navigation,
  Shield,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { MapSection } from './MapSection';
import {
  LocationCoordinates,
  AwsCloudFrontGeo,
  AwsLocationPlace,
  SafeHaven,
  GeofenceZone,
  EmergencyNumbers,
} from '../types';

interface AreaTabViewProps {
  coordinates: LocationCoordinates;
  edgeGeo: AwsCloudFrontGeo;
  place: AwsLocationPlace;
  safeHavens: SafeHaven[];
  selectedSafeHaven: SafeHaven | null;
  onSelectSafeHaven: (haven: SafeHaven) => void;
  geofences: GeofenceZone[];
  emergencyNumbers: EmergencyNumbers;
  isLocating: boolean;
  onRefreshLocation: () => void;
}

export const AreaTabView: React.FC<AreaTabViewProps> = ({
  coordinates,
  edgeGeo,
  place,
  safeHavens,
  selectedSafeHaven,
  onSelectSafeHaven,
  geofences,
  emergencyNumbers,
  isLocating,
  onRefreshLocation,
}) => {
  const closestHaven = selectedSafeHaven || safeHavens[0];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Friendly Area Card */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 sm:p-7 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">
                Amazon Location Service &bull; Area Locator
              </span>
              <h2 className="font-brand font-bold text-lg sm:text-xl text-white leading-tight">
                {place.municipality || edgeGeo.viewerCity}, {place.country || edgeGeo.viewerCountryName}
              </h2>
            </div>
          </div>

          <button
            onClick={onRefreshLocation}
            disabled={isLocating}
            className="self-start sm:self-auto px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-xs text-white border border-zinc-700 flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating with AWS...' : 'Refresh Area'}</span>
          </button>
        </div>

        {/* Detailed Address Banner */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 space-y-1.5">
          <p className="text-xs font-semibold text-zinc-300">
            {place.label}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-500 font-mono">
            <span>Lat: {coordinates.latitude.toFixed(5)}°</span>
            <span>·</span>
            <span>Lon: {coordinates.longitude.toFixed(5)}°</span>
            <span>·</span>
            <span>Accuracy: ±{coordinates.accuracy}m</span>
          </div>
        </div>

        {/* Emergency Fast Connect & Safe Haven Highlight */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Nearest Haven */}
          {closestHaven && (
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">
                  Nearest Safe Haven ({closestHaven.distanceMeters}m)
                </span>
                <p className="font-brand font-bold text-sm text-white">{closestHaven.name}</p>
                <p className="text-xs text-zinc-400">{closestHaven.address}</p>
              </div>

              <div className="flex flex-col gap-1.5">
                {closestHaven.phone && (
                  <a
                    href={`tel:${closestHaven.phone}`}
                    className="p-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 transition-colors"
                    title="Call"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>
                )}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${closestHaven.latitude},${closestHaven.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
                  title="Navigate"
                >
                  <Navigation className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* 1-Click Police Call */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">
                Local Emergency Dial ({emergencyNumbers.country})
              </span>
              <p className="font-brand font-bold text-lg text-white">
                Police / SOS: {emergencyNumbers.police}
              </p>
              <p className="text-xs text-zinc-400">Ambulance: {emergencyNumbers.ambulance}</p>
            </div>

            <a
              href={`tel:${emergencyNumbers.police}`}
              className="px-5 py-2.5 rounded-full bg-white text-black hover:bg-zinc-200 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-lg"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Now</span>
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Map (Clean & Framed) */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 sm:p-7 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-brand font-bold text-base text-white flex items-center gap-2">
            <span>Tactical Map &amp; Illuminated Corridors</span>
          </h3>
          <span className="text-xs text-zinc-500 font-mono">
            {safeHavens.length} Safe Havens within reach
          </span>
        </div>

        <MapSection
          coordinates={coordinates}
          safeHavens={safeHavens}
          geofences={geofences}
          onSelectSafeHaven={onSelectSafeHaven}
          selectedSafeHaven={selectedSafeHaven}
        />
      </div>
    </div>
  );
};
