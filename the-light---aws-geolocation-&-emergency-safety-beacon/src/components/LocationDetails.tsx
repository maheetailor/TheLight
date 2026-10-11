import React from 'react';
import {
  MapPin,
  Globe,
  Navigation,
  ShieldCheck,
  PhoneCall,
  RefreshCw,
  Compass,
  Building,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  AwsCloudFrontGeo,
  AwsLocationPlace,
  EmergencyNumbers,
  LocationCoordinates,
} from '../types';

interface LocationDetailsProps {
  coordinates: LocationCoordinates;
  edgeGeo: AwsCloudFrontGeo;
  place: AwsLocationPlace;
  emergencyNumbers: EmergencyNumbers;
  isLocating: boolean;
  onRefreshLocation: () => void;
  safetyScore: number;
}

export const LocationDetails: React.FC<LocationDetailsProps> = ({
  coordinates,
  edgeGeo,
  place,
  emergencyNumbers,
  isLocating,
  onRefreshLocation,
  safetyScore,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-5">
      {/* Top Title & Refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/30">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-base text-white tracking-tight">
              AWS Location & Area Matrix
            </h2>
            <p className="text-xs text-slate-400">
              Amazon Location Service • SearchPlaceIndexForPosition
            </p>
          </div>
        </div>

        <button
          onClick={onRefreshLocation}
          disabled={isLocating}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white border border-slate-700 transition-colors disabled:opacity-50"
          title="Re-query GPS & AWS Location Service"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-sky-400' : ''}`} />
          <span>{isLocating ? 'Locating...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Primary Reverse-Geocoded Address Banner */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
            Resolved Municipal Address
          </span>
          <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
            <CheckCircle2 className="w-3 h-3" /> AWS Verified
          </span>
        </div>
        <p className="font-semibold text-sm sm:text-base text-slate-100 leading-snug">
          {place.label}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-mono">
          <span>
            City:{' '}
            <strong className="text-slate-200">
              {place.municipality || edgeGeo.viewerCity}
            </strong>
          </span>
          <span>
            Region: <strong className="text-slate-200">{place.region || edgeGeo.viewerRegion}</strong>
          </span>
          <span>
            Country: <strong className="text-slate-200">{place.country || edgeGeo.viewerCountryName}</strong>
          </span>
          {place.postalCode && (
            <span>
              Postal: <strong className="text-slate-200">{place.postalCode}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Dual Telemetry Cards: Precision Coordinates & CloudFront Edge Geo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Device GPS Telemetry */}
        <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1 font-medium text-slate-300">
              <Compass className="w-3.5 h-3.5 text-sky-400" /> Device Telemetry
            </span>
            <span className="font-mono text-emerald-400 text-[11px]">±{coordinates.accuracy}m</span>
          </div>

          <div className="space-y-1 font-mono text-xs">
            <div className="flex justify-between py-0.5 border-b border-slate-800/60">
              <span className="text-slate-400">Latitude</span>
              <span className="text-white font-semibold">{coordinates.latitude.toFixed(6)}°</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-800/60">
              <span className="text-slate-400">Longitude</span>
              <span className="text-white font-semibold">{coordinates.longitude.toFixed(6)}°</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-400">Speed / Alt</span>
              <span className="text-slate-200">
                {coordinates.speed !== null && coordinates.speed !== undefined
                  ? `${coordinates.speed} km/h`
                  : 'Stationary'}{' '}
                / {coordinates.altitude ? `${coordinates.altitude}m` : 'Sea Level'}
              </span>
            </div>
          </div>
        </div>

        {/* AWS CloudFront Edge Geolocation Headers */}
        <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1 font-medium text-slate-300">
              <Globe className="w-3.5 h-3.5 text-amber-400" /> CloudFront Edge Pop
            </span>
            <span className="font-mono text-amber-400 text-[11px]">{edgeGeo.viewerCountry}</span>
          </div>

          <div className="space-y-1 font-mono text-xs">
            <div className="flex justify-between py-0.5 border-b border-slate-800/60">
              <span className="text-slate-400">Edge IP</span>
              <span className="text-slate-200">{edgeGeo.viewerIp}</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-800/60">
              <span className="text-slate-400">Time Zone</span>
              <span className="text-slate-200 truncate max-w-[130px]">{edgeGeo.viewerTimeZone}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-400">Provider</span>
              <span className="text-slate-200 truncate max-w-[130px]">{edgeGeo.viewerIsp}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Index Gauge */}
      <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-200">Area Safety Index</span>
          </div>
          <span
            className={`font-mono font-bold text-sm ${
              safetyScore >= 80
                ? 'text-emerald-400'
                : safetyScore >= 60
                ? 'text-amber-400'
                : 'text-rose-400'
            }`}
          >
            {safetyScore} / 100
          </span>
        </div>

        {/* Meter Bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              safetyScore >= 80
                ? 'bg-emerald-500'
                : safetyScore >= 60
                ? 'bg-amber-400'
                : 'bg-rose-500'
            }`}
            style={{ width: `${safetyScore}%` }}
          />
        </div>

        <p className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
          <span>High streetlighting density • 5 monitored safe sanctuaries in perimeter</span>
          <span className="text-emerald-400">Low Risk Zone</span>
        </p>
      </div>

      {/* Local Emergency Hotlines (Country Auto-Detected) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
            <span>Emergency Services ({emergencyNumbers.country})</span>
          </span>
          <span className="text-[11px] text-slate-500 font-mono">1-Click Fast Connect</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <a
            href={`tel:${emergencyNumbers.police}`}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/60 text-center transition-colors group"
          >
            <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Police</span>
            <span className="font-mono text-base font-extrabold text-white group-hover:scale-105 transition-transform">
              {emergencyNumbers.police}
            </span>
          </a>

          <a
            href={`tel:${emergencyNumbers.ambulance}`}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-800/60 text-center transition-colors group"
          >
            <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider">Ambulance</span>
            <span className="font-mono text-base font-extrabold text-white group-hover:scale-105 transition-transform">
              {emergencyNumbers.ambulance}
            </span>
          </a>

          <a
            href={`tel:${emergencyNumbers.fire}`}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/60 text-center transition-colors group"
          >
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Fire Dept</span>
            <span className="font-mono text-base font-extrabold text-white group-hover:scale-105 transition-transform">
              {emergencyNumbers.fire}
            </span>
          </a>

          <a
            href={`tel:${emergencyNumbers.helpline || emergencyNumbers.police}`}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/60 text-center transition-colors group"
          >
            <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Helpline</span>
            <span className="font-mono text-base font-extrabold text-white group-hover:scale-105 transition-transform">
              {emergencyNumbers.helpline || emergencyNumbers.police}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};
