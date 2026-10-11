import React from 'react';
import {
  MapPin,
  RefreshCw,
  Users,
  Sun,
  Zap,
  TrendingDown,
  Navigation,
} from 'lucide-react';
import { MapSection } from './MapSection';
import {
  LocationCoordinates,
  AwsCloudFrontGeo,
  AwsLocationPlace,
  AreaUtilityProfile,
} from '../types';

interface StreetViewProps {
  coordinates: LocationCoordinates;
  edgeGeo: AwsCloudFrontGeo;
  place: AwsLocationPlace;
  utilityProfile: AreaUtilityProfile;
  isLocating: boolean;
  onRefreshLocation: () => void;
}

export const StreetView: React.FC<StreetViewProps> = ({
  coordinates,
  edgeGeo,
  place,
  utilityProfile,
  isLocating,
  onRefreshLocation,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Street Intelligence Overview */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#f4f4f5] flex items-center justify-center shrink-0 text-slate-800">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
                  AWS Location Service &bull; Street Intelligence
                </span>
                <h2 className="font-brand font-bold text-lg sm:text-xl text-slate-900 leading-tight">
                  {place.municipality || edgeGeo.viewerCity}, {place.country || edgeGeo.viewerCountryName}
                </h2>
              </div>
            </div>

            <button
              onClick={onRefreshLocation}
              disabled={isLocating}
              className="self-start sm:self-auto px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-xs font-brand font-bold text-white flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Scanning...' : 'Locate Area'}</span>
            </button>
          </div>

          {/* Neighborhood Efficiency Stats */}
          <div className="space-y-3 pt-1">
            <div className="bg-[#f8f9fa] border border-slate-200 rounded-2xl p-4 space-y-1">
              <span className="text-[10px] text-slate-500 font-medium block">
                Street Efficiency Rank
              </span>
              <p className="font-brand font-bold text-base text-slate-900 flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-emerald-600" />
                <span>Top 15% in City</span>
              </p>
              <p className="text-[11px] text-slate-500 font-cute text-sm">
                neighbors are timing heavy appliances ~
              </p>
            </div>

            <div className="bg-[#f8f9fa] border border-slate-200 rounded-2xl p-4 space-y-1">
              <span className="text-[10px] text-slate-500 font-medium block">
                Local Grid Cleanliness
              </span>
              <p className="font-brand font-bold text-base text-slate-900">
                {utilityProfile.gridCleanRating}
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Peak Window: {utilityProfile.peakHours}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Map */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-brand font-bold text-sm text-slate-900">
              Local Sector &amp; Solar Irradiance
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {coordinates.latitude.toFixed(3)}°, {coordinates.longitude.toFixed(3)}°
            </span>
          </div>

          <MapSection
            coordinates={coordinates}
            safeHavens={[]}
            geofences={[]}
            onSelectSafeHaven={() => {}}
            selectedSafeHaven={null}
          />
        </div>
      </div>
    </div>
  );
};
