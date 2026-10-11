import React, { useState } from 'react';
import {
  Cloud,
  Terminal,
  Play,
  FileCode,
  Code2,
  Copy,
  Check,
  Server,
  MapPin,
  Radio,
} from 'lucide-react';
import {
  AWS_SAM_TEMPLATE,
  AWS_LAMBDA_PYTHON_CODE,
  simulateAwsLambdaLocate,
  LambdaInvocationResult,
  AWS_REGIONS,
} from '../services/awsService';
import { LocationCoordinates, AwsCloudFrontGeo, AwsLocationPlace } from '../types';

interface AwsTabViewProps {
  coordinates: LocationCoordinates;
  edgeGeo: AwsCloudFrontGeo;
  place: AwsLocationPlace;
  awsRegion: string;
  onSelectRegion: (reg: string) => void;
}

export const AwsTabView: React.FC<AwsTabViewProps> = ({
  coordinates,
  edgeGeo,
  place,
  awsRegion,
  onSelectRegion,
}) => {
  const [subTab, setSubTab] = useState<'console' | 'sam' | 'lambda'>('console');
  const [isExecuting, setIsExecuting] = useState(false);
  const [testResult, setTestResult] = useState<LambdaInvocationResult | null>(null);
  const [copied, setCopied] = useState(false);

  const runLambdaTest = async () => {
    setIsExecuting(true);
    const res = await simulateAwsLambdaLocate(coordinates, edgeGeo, place, awsRegion);
    setTestResult(res);
    setIsExecuting(false);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Title & Region */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">
              AWS Serverless Backend
            </span>
            <h2 className="font-brand font-bold text-xl sm:text-2xl text-white">
              AWS Location &amp; CloudFront Engine
            </h2>
            <p className="text-xs text-zinc-400">
              Locates laptop coordinates, evaluates safe havens, and dispatches SNS distress alerts.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl px-3 py-2 text-xs">
            <Cloud className="w-4 h-4 text-white" />
            <span className="text-zinc-400">Region:</span>
            <select
              value={awsRegion}
              onChange={(e) => onSelectRegion(e.target.value)}
              className="bg-transparent text-white border-none outline-none cursor-pointer font-mono font-medium"
            >
              {AWS_REGIONS.map((r) => (
                <option key={r.id} value={r.id} className="bg-zinc-900 text-white">
                  {r.id}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3 Quick Architecture Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-white font-brand font-bold text-xs">
              <Server className="w-3.5 h-3.5" /> 1. Edge Geolocation
            </div>
            <p className="text-xs text-zinc-400">
              CloudFront headers resolve approximate country, city, and IP at network edge.
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-white font-brand font-bold text-xs">
              <MapPin className="w-3.5 h-3.5" /> 2. Amazon Location
            </div>
            <p className="text-xs text-zinc-400">
              <code className="text-zinc-200">SearchPlaceIndexForPosition</code> reverse geocodes exact street address.
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-white font-brand font-bold text-xs">
              <Radio className="w-3.5 h-3.5" /> 3. Amazon SNS
            </div>
            <p className="text-xs text-zinc-400">
              Broadcasts emergency beacon with live tracking link to designated contacts.
            </p>
          </div>
        </div>

        {/* Subtabs: Console / SAM / Lambda */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
          <button
            onClick={() => setSubTab('console')}
            className={`px-4 py-2 rounded-xl text-xs font-brand font-bold transition-colors ${
              subTab === 'console'
                ? 'bg-white text-black'
                : 'text-zinc-400 hover:text-white bg-zinc-900/60'
            }`}
          >
            Live Lambda Tester
          </button>
          <button
            onClick={() => setSubTab('sam')}
            className={`px-4 py-2 rounded-xl text-xs font-brand font-bold transition-colors ${
              subTab === 'sam'
                ? 'bg-white text-black'
                : 'text-zinc-400 hover:text-white bg-zinc-900/60'
            }`}
          >
            template.yaml (SAM)
          </button>
          <button
            onClick={() => setSubTab('lambda')}
            className={`px-4 py-2 rounded-xl text-xs font-brand font-bold transition-colors ${
              subTab === 'lambda'
                ? 'bg-white text-black'
                : 'text-zinc-400 hover:text-white bg-zinc-900/60'
            }`}
          >
            locate/app.py
          </button>
        </div>

        {/* Tab 1: Live Lambda Console */}
        {subTab === 'console' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-brand font-bold text-sm text-white">Invoke /locate Endpoint</h4>
                <p className="text-xs text-zinc-400">
                  Sends current telemetry to the Python Lambda handler.
                </p>
              </div>

              <button
                onClick={runLambdaTest}
                disabled={isExecuting}
                className="px-5 py-2.5 rounded-full bg-white text-black hover:bg-zinc-200 font-brand font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
                <span>{isExecuting ? 'Executing...' : 'Invoke Lambda ✦'}</span>
              </button>
            </div>

            {testResult ? (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-full bg-white text-black font-bold">
                    HTTP {testResult.statusCode} OK
                  </span>
                  <span className="text-zinc-400">Duration: {testResult.latencyMs}ms</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">
                    CloudWatch Logs Stream
                  </span>
                  <pre className="text-xs font-mono bg-black p-4 rounded-2xl border border-zinc-800 text-zinc-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {testResult.logs.join('\n')}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-zinc-900/30 border border-zinc-800/80 rounded-2xl text-xs text-zinc-500">
                Tap &ldquo;Invoke Lambda ✦&rdquo; to test real execution.
              </div>
            )}
          </div>
        )}

        {/* Tab 2: SAM template */}
        {subTab === 'sam' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-mono">template.yaml &bull; AWS SAM</span>
              <button
                onClick={() => copyCode(AWS_SAM_TEMPLATE)}
                className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono bg-black p-4 rounded-2xl border border-zinc-800 text-zinc-300 whitespace-pre-wrap max-h-96 overflow-y-auto">
              {AWS_SAM_TEMPLATE}
            </pre>
          </div>
        )}

        {/* Tab 3: Lambda app.py */}
        {subTab === 'lambda' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-mono">locate/app.py &bull; Python 3.11</span>
              <button
                onClick={() => copyCode(AWS_LAMBDA_PYTHON_CODE)}
                className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono bg-black p-4 rounded-2xl border border-zinc-800 text-zinc-300 whitespace-pre-wrap max-h-96 overflow-y-auto">
              {AWS_LAMBDA_PYTHON_CODE}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
