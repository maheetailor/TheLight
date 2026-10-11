import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ShieldAlert, Radio, AlertOctagon, Zap } from 'lucide-react';
import { audioAlarm, SirenType } from '../services/audioService';

interface AlarmTabViewProps {
  isActive: boolean;
  onToggleActive: () => void;
  onTriggerSos: () => void;
}

export const AlarmTabView: React.FC<AlarmTabViewProps> = ({
  isActive,
  onToggleActive,
  onTriggerSos,
}) => {
  const [sirenType, setSirenType] = useState<SirenType>('wail');

  useEffect(() => {
    if (isActive) {
      audioAlarm.start(sirenType);
    } else {
      audioAlarm.stop();
    }
    return () => {
      audioAlarm.stop();
    };
  }, [isActive, sirenType]);

  const selectType = (type: SirenType) => {
    setSirenType(type);
    if (isActive) {
      audioAlarm.start(type);
    }
  };

  const types = [
    { id: 'wail', label: 'Police Wail', desc: 'Sweeping rising-falling tone', icon: ShieldAlert },
    { id: 'horn', label: 'Deterrent Horn', desc: 'Aggressive loud pulsed alert', icon: AlertOctagon },
    { id: 'chirp', label: 'Piercing Chirp', desc: 'High ultrasonic frequency', icon: Zap },
    { id: 'sos', label: 'Morse SOS', desc: 'Audible international code', icon: Radio },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-center">
        {/* Title */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">
            Acoustic Deterrent System
          </span>
          <h2 className="font-brand font-bold text-2xl sm:text-3xl text-white">
            Laptop Speaker Siren
          </h2>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            High-decibel synthesized defense siren projecting through device stereo speakers.
          </p>
        </div>

        {/* Giant Tactile Power Button */}
        <div className="py-6 flex flex-col items-center justify-center">
          <button
            onClick={onToggleActive}
            className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 transition-all duration-200 flex flex-col items-center justify-center gap-2 shadow-2xl active:scale-95 ${
              isActive
                ? 'bg-white text-black border-white shadow-[0_0_60px_rgba(255,255,255,0.7)] animate-pulse'
                : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-500 hover:text-white'
            }`}
          >
            {isActive ? <Volume2 className="w-12 h-12" /> : <VolumeX className="w-12 h-12" />}
            <span className="font-brand font-bold text-sm tracking-wider uppercase">
              {isActive ? 'STOP SIREN' : 'SOUND ALARM'}
            </span>
          </button>

          {/* Sound wave visualizer when active */}
          {isActive && (
            <div className="flex items-center gap-1.5 h-10 mt-6">
              {[30, 70, 95, 60, 100, 80, 50, 90, 65, 85, 40].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-white rounded-full animate-pulse"
                  style={{
                    height: `${h}%`,
                    animationDuration: `${0.3 + (i % 3) * 0.15}s`,
                  }}
                />
              ))}
            </div>
          )}

          <p className="text-xs text-zinc-500 font-mono mt-4">
            Shortcut: Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">S</kbd> anytime
          </p>
        </div>

        {/* Siren Profile Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-left">
          {types.map((t) => {
            const Icon = t.icon;
            const isSelected = sirenType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => selectType(t.id as SirenType)}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-white text-black border-white shadow-lg'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="font-brand font-bold text-xs">{t.label}</span>
                </div>
                <p className={`text-[11px] leading-tight ${isSelected ? 'text-zinc-700' : 'text-zinc-500'}`}>
                  {t.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Big SOS Distress Trigger Banner */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left space-y-1">
            <h4 className="font-brand font-bold text-base text-white">Emergency Distress SOS</h4>
            <p className="text-xs text-zinc-400">
              Dispatches live GPS coordinates and Amazon SNS beacon alert to guardians.
            </p>
          </div>

          <button
            onClick={onTriggerSos}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white text-black hover:bg-zinc-200 font-brand font-bold text-xs uppercase tracking-wider transition-all shadow-xl active:scale-95 shrink-0"
          >
            Trigger SOS Beacon ✦
          </button>
        </div>
      </div>
    </div>
  );
};
