import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ShieldAlert, Radio, AlertOctagon, Zap } from 'lucide-react';
import { audioAlarm, SirenType } from '../services/audioService';

interface AcousticSirenProps {
  isActive: boolean;
  onToggleActive: () => void;
}

export const AcousticSiren: React.FC<AcousticSirenProps> = ({ isActive, onToggleActive }) => {
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

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white tracking-tight">
              Acoustic Defense Siren
            </h3>
            <p className="text-xs text-slate-400">
              High-decibel synthesized deterrent through laptop speakers
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-slate-500">Press S key</span>
      </div>

      {/* Main Activation Banner with Soundwave */}
      <div
        className={`rounded-xl p-4 border transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isActive
            ? 'bg-rose-950/40 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
            : 'bg-slate-950/50 border-slate-800'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleActive}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isActive
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40 animate-pulse'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isActive ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </button>

          <div>
            <p className="font-bold text-sm text-white flex items-center gap-2">
              <span>{isActive ? 'SIREN IS BLARING' : 'Siren Disarmed'}</span>
              {isActive && (
                <span className="text-[10px] font-mono uppercase bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/40">
                  Loud Speaker Output
                </span>
              )}
            </p>
            <p className="text-xs text-slate-400">
              {isActive
                ? 'Soundwaves transmitting to disorient attackers & alert bystanders'
                : 'Arm to instantly project high-frequency distress tone'}
            </p>
          </div>
        </div>

        {/* Visual Audio Waveform Simulation */}
        {isActive ? (
          <div className="flex items-center gap-1 h-8 px-2">
            {[40, 75, 95, 60, 100, 85, 45, 90, 70, 95, 80, 50].map((h, i) => (
              <div
                key={i}
                className="w-1 bg-rose-500 rounded-full animate-pulse"
                style={{
                  height: `${h}%`,
                  animationDuration: `${0.3 + (i % 4) * 0.15}s`,
                }}
              />
            ))}
          </div>
        ) : (
          <button
            onClick={onToggleActive}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wide transition-colors"
          >
            SOUND ALARM
          </button>
        )}
      </div>

      {/* Siren Profile Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { id: 'wail', label: 'Police Wail', desc: 'Continuous 650-1550Hz sweep', icon: ShieldAlert },
          { id: 'horn', label: 'Deterrent Horn', desc: 'Pulsed aggressive square wave', icon: AlertOctagon },
          { id: 'chirp', label: 'Piercing Chirp', desc: '2400Hz ultrasonic deterrent', icon: Zap },
          { id: 'sos', label: 'Morse SOS', desc: 'Audible international distress code', icon: Radio },
        ].map((item) => {
          const Icon = item.icon;
          const isSelected = sirenType === item.id;
          return (
            <button
              key={item.id}
              onClick={() => selectType(item.id as SirenType)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-rose-950/30 border-rose-500/50 text-white'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-rose-400' : 'text-slate-500'}`} />
                <span className="font-semibold text-xs text-slate-200">{item.label}</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">{item.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
