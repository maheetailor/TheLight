import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  X,
  Share2,
  Copy,
  Check,
  Send,
  Radio,
  PhoneCall,
} from 'lucide-react';
import {
  LocationCoordinates,
  AwsLocationPlace,
  EmergencyContact,
  EmergencyNumbers,
} from '../types';
import { simulateAwsSnsAlertBroadcast } from '../services/awsService';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  coordinates: LocationCoordinates;
  place: AwsLocationPlace;
  contacts: EmergencyContact[];
  emergencyNumbers: EmergencyNumbers;
}

export const SOSModal: React.FC<SOSModalProps> = ({
  isOpen,
  onClose,
  coordinates,
  place,
  contacts,
  emergencyNumbers,
}) => {
  const [countdown, setCountdown] = useState(5);
  const [isDispatched, setIsDispatched] = useState(false);
  const [snsResult, setSnsResult] = useState<{ messageId: string; timestamp: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setIsDispatched(false);
      setSnsResult(null);
      return;
    }

    if (countdown > 0 && !isDispatched) {
      const timer = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isDispatched) {
      handleBroadcast();
    }
  }, [isOpen, countdown, isDispatched]);

  const handleBroadcast = async () => {
    setIsDispatched(true);
    const result = await simulateAwsSnsAlertBroadcast(coordinates, place, contacts.length);
    setSnsResult(result);
  };

  const mapsLink = `https://maps.google.com/?q=${coordinates.latitude},${coordinates.longitude}`;
  const emergencyMessage = `🚨 EMERGENCY DISTRESS SOS 🚨
I need immediate help!
📍 Area: ${place.label}
🌐 GPS Coordinates: ${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)} (±${coordinates.accuracy}m)
🗺️ Maps Link: ${mapsLink}
⏰ Time: ${new Date().toLocaleString()}
Sent via TheLight (AWS Location & SNS Beacon)`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(emergencyMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareViaWeb = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'EMERGENCY SOS DISTRESS',
          text: emergencyMessage,
          url: mapsLink,
        });
      } catch {
        // ignore
      }
    } else {
      copyToClipboard();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white overflow-hidden space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
              TheLight Emergency Beacon
            </span>
            <h2 className="font-brand font-bold text-xl sm:text-2xl text-white">
              Emergency SOS Dispatch
            </h2>
          </div>
        </div>

        {/* Countdown Phase */}
        {!isDispatched && countdown > 0 ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-24 h-24 rounded-full border-4 border-white flex items-center justify-center mx-auto text-4xl font-brand font-black text-white animate-ping">
              {countdown}
            </div>
            <div>
              <p className="font-brand font-bold text-base text-white">
                Broadcasting distress in {countdown} seconds...
              </p>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto mt-1">
                Take a breath. Click Cancel if triggered by mistake.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleBroadcast}
                className="px-6 py-2.5 rounded-full bg-white text-black font-brand font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-lg active:scale-95"
              >
                Send Now ✦
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium text-xs hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* Dispatched Phase */
          <div className="space-y-4">
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Radio className="w-5 h-5 text-white animate-pulse" />
                <div>
                  <p className="font-brand font-bold text-sm text-white">AWS Distress Beacon Live</p>
                  <p className="text-xs font-mono text-zinc-400">
                    SNS ID: {snsResult?.messageId || 'dispatching...'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white text-black">
                ACTIVE
              </span>
            </div>

            {/* Emergency message snippet */}
            <div className="bg-black border border-zinc-800 rounded-2xl p-3.5 space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">
                Message Payload
              </span>
              <p className="text-xs font-mono text-zinc-300 whitespace-pre-wrap max-h-32 overflow-y-auto">
                {emergencyMessage}
              </p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <button
                onClick={copyToClipboard}
                className="p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-center text-xs flex flex-col items-center justify-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-zinc-300" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                onClick={shareViaWeb}
                className="p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-center text-xs flex flex-col items-center justify-center gap-1 transition-colors"
              >
                <Share2 className="w-4 h-4 text-zinc-300" />
                <span>Share</span>
              </button>

              <a
                href={`sms:?body=${encodeURIComponent(emergencyMessage)}`}
                className="p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-center text-xs flex flex-col items-center justify-center gap-1 transition-colors"
              >
                <Send className="w-4 h-4 text-zinc-300" />
                <span>SMS</span>
              </a>

              <a
                href={`tel:${emergencyNumbers.police}`}
                className="p-3 rounded-2xl bg-white text-black hover:bg-zinc-200 text-center text-xs flex flex-col items-center justify-center gap-1 transition-colors font-bold shadow-lg"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call {emergencyNumbers.police}</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
