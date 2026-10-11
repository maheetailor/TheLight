import React, { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { TheLightLogo } from './TheLightLogo';

interface SplashScreenProps {
  onDismiss: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onDismiss,
  durationMs = 2800,
}) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Start fading slightly before dismissal
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, durationMs - 400);

    const endTimer = setTimeout(() => {
      onDismiss();
    }, durationMs);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, [durationMs, onDismiss]);

  const handleManualDismiss = () => {
    setIsFading(true);
    setTimeout(onDismiss, 300);
  };

  return (
    <div
      onClick={handleManualDismiss}
      className={`fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 select-none transition-opacity duration-400 cursor-pointer overflow-hidden ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top and Bottom soft white ambient glow matching screenshot */}
      <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />

      {/* Starry Night Sparkles scattered around like screenshot */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Star 1 */}
        <div
          className="absolute top-[18%] left-[22%] text-white/80 text-xl animate-twinkle"
          style={{ animationDelay: '0.2s' }}
        >
          ✦
        </div>
        {/* Star 2 (top right) */}
        <div
          className="absolute top-[20%] right-[25%] text-white text-2xl animate-twinkle"
          style={{ animationDelay: '0.7s' }}
        >
          ✦
        </div>
        {/* Tiny golden/white dots */}
        <div
          className="absolute top-[32%] left-[16%] text-amber-200 text-sm animate-twinkle"
          style={{ animationDelay: '1.4s' }}
        >
          ✦
        </div>
        <div
          className="absolute top-[28%] right-[18%] text-white/50 text-xs animate-twinkle"
          style={{ animationDelay: '2.1s' }}
        >
          ·
        </div>
        <div
          className="absolute top-[42%] left-[30%] text-white/40 text-base animate-twinkle"
          style={{ animationDelay: '0.9s' }}
        >
          ·
        </div>
        <div
          className="absolute top-[38%] right-[32%] text-amber-100/70 text-xs animate-twinkle"
          style={{ animationDelay: '1.6s' }}
        >
          ✦
        </div>
        <div
          className="absolute bottom-[35%] left-[24%] text-white/60 text-sm animate-twinkle"
          style={{ animationDelay: '1.1s' }}
        >
          ·
        </div>
        <div
          className="absolute bottom-[32%] right-[22%] text-amber-200/80 text-xs animate-twinkle"
          style={{ animationDelay: '0.5s' }}
        >
          ✦
        </div>
        <div
          className="absolute bottom-[22%] left-[32%] text-white/70 text-sm animate-twinkle"
          style={{ animationDelay: '1.9s' }}
        >
          ✦
        </div>
        <div
          className="absolute bottom-[24%] right-[35%] text-amber-300 text-xs animate-twinkle"
          style={{ animationDelay: '2.4s' }}
        >
          ·
        </div>
      </div>

      {/* Central Logo Box */}
      <div className="relative z-10 flex flex-col items-center animate-float">
        <TheLightLogo size="lg" showSubtitle={true} />

        {/* Down Arrow Button matching the screenshot */}
        <div className="mt-14 sm:mt-16 flex flex-col items-center">
          <button
            onClick={handleManualDismiss}
            aria-label="Enter App"
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 flex items-center justify-center text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] group"
          >
            <ArrowDown className="w-5 h-5 text-white group-hover:translate-y-0.5 transition-transform" />
          </button>
          <span className="text-[11px] text-white/40 font-cute text-base mt-2 tracking-wide">
            tap anywhere to enter
          </span>
        </div>
      </div>
    </div>
  );
};
