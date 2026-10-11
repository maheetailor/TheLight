import React, { useState } from 'react';
import {
  Cloud,
  X,
  Code2,
  FileCode,
  Terminal,
  Play,
  Copy,
  Check,
  Server,
  Database,
  Radio,
  MapPin,
  Shield,
  Layers,
} from 'lucide-react';
import {
  AWS_SAM_TEMPLATE,
  AWS_LAMBDA_PYTHON_CODE,
  simulateAwsLambdaLocate,
  LambdaInvocationResult,
} from '../services/awsService';
import { LocationCoordinates, AwsCloudFrontGeo, AwsLocationPlace } from '../types';

interface AwsArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  coordinates: LocationCoordinates;
  edgeGeo: AwsCloudFrontGeo;
  place: AwsLocationPlace;
  awsRegion: string;
}

export const AwsArchitectureModal: React.FC<AwsArchitectureModalProps> = ({
  isOpen,
  onClose,
  coordinates,
  edgeGeo,
  place,
  awsRegion,
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'tester' | 'sam' | 'lambda'>('architecture');
  const [testResult, setTestResult] = useState<LambdaInvocationResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const runTest = async () => {
    setIsExecuting(true);
    const res = await simulateAwsLambdaLocate(coordinates, edgeGeo, place, awsRegion);
    setTestResult(res);
    setIsExecuting(false);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-950 border border-slate-800 rounded-2xl flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-white">AWS Cloud Architecture & Stack</h2>
              <p className="text-xs text-slate-400">
                Amazon Location Service &bull; CloudFront Edge Geo &bull; Serverless Lambda
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-800 px-4 sm:px-6 bg-slate-900/50 gap-2 overflow-x-auto">
          {[
            { id: 'architecture', label: 'Architecture Diagram', icon: Layers },
            { id: 'tester', label: 'Live Lambda Console', icon: Terminal },
            { id: 'sam', label: 'template.yaml (SAM)', icon: FileCode },
            { id: 'lambda', label: 'locate/app.py', icon: Code2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'border-sky-500 text-sky-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              {/* Architecture diagram nodes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                    <Server className="w-4 h-4" /> 1. Edge & Ingress
                  </div>
                  <h4 className="font-bold text-sm text-white">AWS CloudFront & API Gateway</h4>
                  <p className="text-xs text-slate-400">
                    Captures IP and injects Viewer Location Headers (Country, City, Lat/Lon) before forwarding payload to Lambda.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <MapPin className="w-4 h-4" /> 2. Spatial Engine
                  </div>
                  <h4 className="font-bold text-sm text-white">Amazon Location Service</h4>
                  <p className="text-xs text-slate-400">
                    Executes SearchPlaceIndexForPosition reverse geocoding, updates DeviceTracker telemetry, and checks Geofence perimeters.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <Radio className="w-4 h-4" /> 3. Persistence & Alert
                  </div>
                  <h4 className="font-bold text-sm text-white">DynamoDB & Amazon SNS</h4>
                  <p className="text-xs text-slate-400">
                    Stores chronological breadcrumbs in DynamoDB and broadcasts distress notifications via Amazon SNS SMS/Email topics.
                  </p>
                </div>
              </div>

              {/* Data Flow Description */}
              <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 text-xs space-y-3">
                <h4 className="font-bold text-sm text-slate-200">How "The Light" Locates Laptop Users:</h4>
                <ul className="space-y-2 text-slate-400 list-disc list-inside">
                  <li>
                    <strong className="text-white">Laptop Hardware Adaptability:</strong> Since laptops lack hardware GPS chips, they rely on Wi-Fi SSID trilateration and IP geolocation. The Light combines HTML5 Geolocation with CloudFront Edge headers for seamless indoor and outdoor resolution.
                  </li>
                  <li>
                    <strong className="text-white">Reverse Geocoding:</strong> Translates raw lat/lon into human-readable street names, districts, and municipalities so emergency dispatches have immediate clarity.
                  </li>
                  <li>
                    <strong className="text-white">Safe Lit Routing:</strong> Evaluates street-level lighting ratings and path distances to route vulnerable pedestrians toward 24/7 monitored sanctuaries.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'tester' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">Test /locate Lambda Endpoint</h4>
                  <p className="text-xs text-slate-400">
                    Invokes the Python Lambda function with your current coordinates and CloudFront headers.
                  </p>
                </div>

                <button
                  onClick={runTest}
                  disabled={isExecuting}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  <Play className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
                  <span>{isExecuting ? 'Executing...' : 'Invoke Lambda'}</span>
                </button>
              </div>

              {testResult ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                      Status: {testResult.statusCode} OK
                    </span>
                    <span className="font-mono text-slate-400">Latency: {testResult.latencyMs}ms</span>
                    <span className="font-mono text-slate-500 truncate">RequestId: {testResult.requestId}</span>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                      CloudWatch Execution Logs
                    </span>
                    <pre className="text-xs font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 text-emerald-400/90 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                      {testResult.logs.join('\n')}
                    </pre>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                      Response JSON Payload
                    </span>
                    <pre className="text-xs font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 text-sky-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {JSON.stringify(testResult.responsePayload, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-900/40 border border-slate-800/80 rounded-xl space-y-2">
                  <Terminal className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">Click &ldquo;Invoke Lambda&rdquo; to test real execution.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'sam' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">template.yaml &bull; AWS SAM</span>
                <button
                  onClick={() => copyCode(AWS_SAM_TEMPLATE)}
                  className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy SAM'}</span>
                </button>
              </div>

              <pre className="text-xs font-mono bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                {AWS_SAM_TEMPLATE}
              </pre>
            </div>
          )}

          {activeTab === 'lambda' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">locate/app.py &bull; Python 3.11</span>
                <button
                  onClick={() => copyCode(AWS_LAMBDA_PYTHON_CODE)}
                  className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              <pre className="text-xs font-mono bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                {AWS_LAMBDA_PYTHON_CODE}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
