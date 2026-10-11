import React, { useState } from 'react';
import {
  MapPin,
  RefreshCw,
  Clock,
  Zap,
  Flame,
  Cloud,
  Leaf,
  Layers,
  Terminal,
  Play,
} from 'lucide-react';
import { MapSection } from './MapSection';
import {
  LocationCoordinates,
  AwsCloudFrontGeo,
  AwsLocationPlace,
  AreaUtilityProfile,
} from '../types';
import { simulateAwsLambdaLocate, LambdaInvocationResult } from '../services/awsService';

interface AreaRatesViewProps {
  coordinates: LocationCoordinates;
  edgeGeo: AwsCloudFrontGeo;
  place: AwsLocationPlace;
  utilityProfile: AreaUtilityProfile;
  isLocating: boolean;
  onRefreshLocation: () => void;
  awsRegion: string;
}

export const AreaRatesView: React.FC<AreaRatesViewProps> = ({
  coordinates,
  edgeGeo,
  place,
  utilityProfile,
  isLocating,
  onRefreshLocation,
  awsRegion,
}) => {
  const [testResult, setTestResult] = useState<LambdaInvocationResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Determine current peak status
  const currentHour = new Date().getHours();
  const isPeak = currentHour >= 16 && currentHour <= 21; // 4 PM - 9 PM

  const runAwsTest = async () => {
    setIsExecuting(true);
    const res = await simulateAwsLambdaLocate(coordinates, edgeGeo, place, awsRegion);
    setTestResult(res);
    setIsExecuting(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Main Detected Area Card */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">
                AWS Location Service &bull; Regional Utility Hub
              </span>
              <h2 className="font-brand font-bold text-xl sm:text-2xl text-white">
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
            <span>{isLocating ? 'Scanning with AWS...' : 'Refresh Area'}</span>
          </button>
        </div>

        {/* Peak Hours Live Card */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-white shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-mono text-zinc-500 block">
                Regional Peak Pricing Window ({utilityProfile.peakHours})
              </span>
              <p className="font-brand font-bold text-sm text-white">
                {isPeak
                  ? 'Currently PEAK HOURS (Higher electricity tariff)'
                  : 'Currently OFF-PEAK (Lowest tariff & cleanest power!)'}
              </p>
              <p className="text-xs text-zinc-400">
                {isPeak
                  ? 'Tip: Delay dishwasher, laundry, and EV charging until after 9:00 PM to save.'
                  : 'Great time to run heavy appliances without extra peak charges.'}
              </p>
            </div>
          </div>

          <span
            className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wide ${
              isPeak ? 'bg-zinc-800 text-zinc-300' : 'bg-white text-black'
            }`}
          >
            {isPeak ? 'Peak Active' : 'Off-Peak Active ✦'}
          </span>
        </div>

        {/* Local Area Tariff Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 space-y-1">
            <div className="flex items-center gap-2 text-zinc-400 text-xs">
              <Zap className="w-3.5 h-3.5 text-white" />
              <span>Electricity Rate</span>
            </div>
            <p className="font-brand font-bold text-xl text-white">
              {utilityProfile.currencySymbol}
              {utilityProfile.avgElectricityRate}
              <span className="text-xs font-normal text-zinc-500"> / kWh</span>
            </p>
            <p className="text-[10px] text-zinc-500 font-mono">AWS Region: {awsRegion}</p>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 space-y-1">
            <div className="flex items-center gap-2 text-zinc-400 text-xs">
              <Flame className="w-3.5 h-3.5 text-white" />
              <span>Gas Heating Rate</span>
            </div>
            <p className="font-brand font-bold text-xl text-white">
              {utilityProfile.currencySymbol}
              {utilityProfile.avgGasRate}
              <span className="text-xs font-normal text-zinc-500"> / unit</span>
            </p>
            <p className="text-[10px] text-zinc-500 font-mono">{utilityProfile.climateZone}</p>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 space-y-1">
            <div className="flex items-center gap-2 text-zinc-400 text-xs">
              <Leaf className="w-3.5 h-3.5 text-white" />
              <span>Grid Cleanliness</span>
            </div>
            <p className="font-brand font-bold text-sm text-white leading-snug">
              {utilityProfile.gridCleanRating}
            </p>
            <p className="text-[10px] text-zinc-500 font-mono">Edge PoP: {edgeGeo.viewerCity}</p>
          </div>
        </div>
      </div>

      {/* 2. Interactive Area Map */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-7 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-brand font-bold text-base text-white">
            Local Climate &amp; Grid Sector Map
          </h3>
          <span className="text-xs font-mono text-zinc-500">
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

      {/* 3. AWS Lambda Console Tester */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-brand font-bold text-sm text-white">
              AWS Location &amp; Lambda Handler
            </h4>
            <p className="text-xs text-zinc-400">
              Test serverless reverse-geocoding resolution for this area.
            </p>
          </div>

          <button
            onClick={runAwsTest}
            disabled={isExecuting}
            className="px-4 py-2 rounded-full bg-white text-black hover:bg-zinc-200 font-brand font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
            <span>{isExecuting ? 'Executing...' : 'Invoke /locate ✦'}</span>
          </button>
        </div>

        {testResult && (
          <div className="space-y-2 pt-1 font-mono text-xs">
            <span className="text-[10px] text-zinc-500 uppercase block">CloudWatch Stream</span>
            <pre className="bg-black p-3.5 rounded-2xl border border-zinc-800 text-zinc-300 whitespace-pre-wrap max-h-36 overflow-y-auto">
              {testResult.logs.join('\n')}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
