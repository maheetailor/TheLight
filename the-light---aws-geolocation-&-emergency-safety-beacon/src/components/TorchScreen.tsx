import React, { useState, useEffect, useRef } from 'react';
import {
  Lightbulb,
  Maximize2,
  Minimize2,
  Sliders,
  Radio,
  Zap,
  Moon,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { BeaconMode } from '../types';
import { audioAlarm } from '../services/audioService';

interface TorchScreenProps {
  isActive: boolean;
  onToggleActive: () => void;
  activeMode: BeaconMode;
  onSelectMode: (mode: BeaconMode) => void;
}

export const TorchScreen: React.FC<TorchScreenProps> = ({
  isActive,
  onToggleActive,
  activeMode,
  onSelectMode,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [audioSync, setAudioSync] = useState(false);
  const [flashOn, setFlashOn] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // Fullscreen monitor
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current) {
          await containerRef.current.requestFullscreen();
        } else {
          await document.documentElement.requestFullscreen();
        }
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // ignore
    }
  };

  // Strobe & SOS loop
  useEffect(() => {
    if (!isActive) return;

    if (activeMode === 'strobe') {
      const interval = setInterval(() => {
        setFlashOn((prev) => !prev);
      }, 70); // 14Hz rapid strobe
      return () => clearInterval(interval);
    }

    if (activeMode === 'sos') {
      const pattern = [
        { on: true, dur: 180 },
        { on: false, dur: 120 },
        { on: true, dur: 180 },
        { on: false, dur: 120 },
        { on: true, dur: 180 },
        { on: false, dur: 380 },
        { on: true, dur: 520 },
        { on: false, dur: 150 },
        { on: true, dur: 520 },
        { on: false, dur: 150 },
        { on: true, dur: 520 },
        { on: false, dur: 380 },
        { on: true, dur: 180 },
        { on: false, dur: 120 },
        { on: true, dur: 180 },
        { on: false, dur: 120 },
        { on: true, dur: 180 },
        { on: false, dur: 850 },
      ];

      let idx = 0;
      let timer: number;

      const loop = () => {
        const item = pattern[idx];
        setFlashOn(item.on);
        idx = (idx + 1) % pattern.length;
        timer = window.setTimeout(loop, item.dur);
      };

      loop();
      return () => clearTimeout(timer);
    }

    if (activeMode === 'torch' || activeMode === 'night') {
      setFlashOn(true);
    }
  }, [isActive, activeMode]);

  // Audio SOS sync
  useEffect(() => {
    if (isActive && activeMode === 'sos' && audioSync) {
      audioAlarm.start('sos');
    } else {
      if (audioAlarm.getCurrentType() === 'sos') {
        audioAlarm.stop();
      }
    }
    return () => {
      if (audioAlarm.getCurrentType() === 'sos') {
        audioAlarm.stop();
      }
    };
  }, [isActive, activeMode, audioSync]);

  const modes = [
    { id: 'torch', label: 'Floodlight', icon: Lightbulb, desc: 'Steady bright glow' },
    { id: 'sos', label: 'SOS Morse', icon: Radio, desc: 'International distress' },
    { id: 'strobe', label: 'Strobe', icon: Zap, desc: 'Fast optical flash' },
    { id: 'night', label: 'Night Soft', icon: Moon, desc: 'Gentle low glare' },
  ];

  // Visual screen background
  const getScreenBg = () => {
    if (!isActive) return 'bg-zinc-950 text-zinc-500';

    if (activeMode === 'torch') {
      return 'bg-white text-black shadow-[0_0_80px_rgba(255,255,255,0.4)]';
    }
    if (activeMode === 'night') {
      return 'bg-zinc-300 text-black';
    }
    if (activeMode === 'strobe' || activeMode === 'sos') {
      return flashOn
        ? 'bg-white text-black shadow-[0_0_80px_rgba(255,255,255,0.6)]'
        : 'bg-black text-white';
    }
    return 'bg-white text-black';
  };

  return (
    <div
      ref={containerRef}
      className={`relative select-none flex flex-col ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-black w-screen h-screen'
          : 'bg-zinc-950 border border-zinc-800 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl'
      }`}
    >
      {/* Fullscreen Close */}
      {isFullscreen && (
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={toggleFullscreen}
            className="p-3 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-white/20"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Main Flashlight Surface (The Light Canvas) */}
      <div
        className={`relative w-full rounded-2xl sm:rounded-3xl transition-all duration-100 flex flex-col items-center justify-center overflow-hidden border border-zinc-800 ${
          isFullscreen ? 'flex-1 rounded-none border-none' : 'h-64 sm:h-80'
        } ${getScreenBg()}`}
        style={{ opacity: isActive ? brightness / 100 : 1 }}
      >
        {/* Subtle star in center */}
        <div className="relative z-10 flex flex-col items-center text-center p-6 space-y-3">
          {isActive ? (
            <div className="space-y-2">
              <span className="text-4xl sm:text-5xl block animate-bounce">
                {activeMode === 'torch' ? '💡' : activeMode === 'sos' ? '🚨' : activeMode === 'strobe' ? '⚡' : '🌙'}
              </span>
              <h3 className="font-brand font-bold text-2xl sm:text-3xl tracking-tight uppercase">
                {activeMode === 'torch' && 'The Light is ON'}
                {activeMode === 'sos' && '• • •  — — —  • • •'}
                {activeMode === 'strobe' && 'Optical Strobe Active'}
                {activeMode === 'night' && 'Soft Night Light'}
              </h3>
              <p className="text-xs sm:text-sm font-medium opacity-80 max-w-xs mx-auto">
                {activeMode === 'torch' && 'Maximum display luminance for dark paths and emergencies'}
                {activeMode === 'sos' && 'Flashing international Morse code distress signal'}
                {activeMode === 'strobe' && 'Rapid disorienting deterrent pulses'}
                {activeMode === 'night' && 'Muted contrast light to reduce eye strain'}
              </p>
            </div>
          ) : (
            <div className="space-y-2 text-zinc-500">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                <Lightbulb className="w-8 h-8" />
              </div>
              <h3 className="font-brand font-semibold text-lg text-zinc-300">
                The Light is resting
              </h3>
              <p className="text-xs text-zinc-500">
                Tap the big button below or press Spacebar
              </p>
            </div>
          )}
        </div>

        {/* Floating Master Power Toggle Button */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-3 px-4 z-20">
          <button
            onClick={onToggleActive}
            className={`px-8 py-3 rounded-full font-brand font-bold text-sm tracking-wider uppercase transition-all shadow-xl active:scale-95 flex items-center gap-2 ${
              isActive
                ? 'bg-black text-white border border-zinc-700 hover:bg-zinc-900'
                : 'bg-white text-black hover:bg-zinc-200 shadow-white/10'
            }`}
          >
            <span>{isActive ? 'Turn Off Light' : 'Turn On The Light ✦'}</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-3 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20 hover:bg-zinc-900 transition-colors"
            title="Toggle Fullscreen [F]"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Minimal Mode Selectors */}
      {!isFullscreen && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {modes.map((m) => {
              const Icon = m.icon;
              const isSelected = activeMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onSelectMode(m.id as BeaconMode)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-white text-black border-white shadow-lg'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="font-brand font-bold text-xs">{m.label}</span>
                  </div>
                  <p className={`text-[11px] leading-tight ${isSelected ? 'text-zinc-700' : 'text-zinc-500'}`}>
                    {m.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Simple Luminance Slider & Audio Beep Toggle */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1 min-w-[180px] flex items-center gap-3">
              <Sliders className="w-4 h-4 text-zinc-400" />
              <div className="flex-1">
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>Display Brightness</span>
                  <span className="font-mono text-white font-medium">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>
            </div>

            {activeMode === 'sos' && (
              <button
                onClick={() => setAudioSync(!audioSync)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-colors ${
                  audioSync
                    ? 'bg-white text-black border-white font-semibold'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                }`}
              >
                {audioSync ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{audioSync ? 'Morse Audio ON' : 'Mute Morse'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
