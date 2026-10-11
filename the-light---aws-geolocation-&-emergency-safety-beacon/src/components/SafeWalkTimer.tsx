import React, { useState, useEffect } from 'react';
import { Timer, Play, Square, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SafeWalkTimerProps {
  onAutoTriggerSos: () => void;
}

export const SafeWalkTimer: React.FC<SafeWalkTimerProps> = ({ onAutoTriggerSos }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(900); // 15 mins default
  const [remainingSeconds, setRemainingSeconds] = useState(900);
  const [selectedPresetMinutes, setSelectedPresetMinutes] = useState(15);

  useEffect(() => {
    let interval: number | null = null;

    if (isRunning && remainingSeconds > 0) {
      interval = window.setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onAutoTriggerSos();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, remainingSeconds, onAutoTriggerSos]);

  const startTimer = (minutes: number) => {
    const secs = minutes * 60;
    setSelectedPresetMinutes(minutes);
    setTotalSeconds(secs);
    setRemainingSeconds(secs);
    setIsRunning(true);
  };

  const cancelTimer = () => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
  };

  const arrivedSafely = () => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
    });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPct = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white tracking-tight">Walk Home Safe Companion</h3>
            <p className="text-xs text-slate-400">
              Auto-dispatches AWS distress alert if you don't check in
            </p>
          </div>
        </div>

        {isRunning && (
          <span className="flex items-center gap-1.5 text-xs text-amber-400 font-mono bg-amber-950/60 border border-amber-600/40 px-2 py-0.5 rounded-lg animate-pulse">
            <Clock className="w-3 h-3" /> ACTIVE WATCH
          </span>
        )}
      </div>

      {isRunning ? (
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Auto-Alert Countdown:</span>
            <span className="font-mono text-2xl font-black text-amber-400 tracking-wider">
              {formatTime(remainingSeconds)}
            </span>
          </div>

          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                remainingSeconds < 120 ? 'bg-red-500' : 'bg-amber-400'
              }`}
              style={{ width: `${100 - progressPct}%` }}
            />
          </div>

          <p className="text-xs text-slate-400 leading-snug">
            {remainingSeconds < 120 ? (
              <span className="text-red-400 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Less than 2 minutes remaining! Check in or alert dispatches.
              </span>
            ) : (
              'Continuous location tracker active. Click "I Arrived Safely" when you reach home or safe haven.'
            )}
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={arrivedSafely}
              className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-emerald-900/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>I ARRIVED SAFELY</span>
            </button>

            <button
              onClick={cancelTimer}
              className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center justify-center gap-1 transition-colors"
            >
              <Square className="w-3.5 h-3.5 text-slate-400" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Choose Walking Duration:</span>
            <span className="font-mono text-slate-300">{selectedPresetMinutes} minutes</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[5, 15, 30, 45].map((mins) => (
              <button
                key={mins}
                onClick={() => setSelectedPresetMinutes(mins)}
                className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                  selectedPresetMinutes === mins
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900'
                }`}
              >
                {mins} min
              </button>
            ))}
          </div>

          <button
            onClick={() => startTimer(selectedPresetMinutes)}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-950/50"
          >
            <Play className="w-3.5 h-3.5" />
            <span>START SAFE WALK TRACKER</span>
          </button>
        </div>
      )}
    </div>
  );
};
