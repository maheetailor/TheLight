import React from 'react';

interface TheLightLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
  theme?: 'dark' | 'light';
}

export const TheLightLogo: React.FC<TheLightLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  theme = 'dark',
}) => {
  const isLarge = size === 'lg';
  const isSmall = size === 'sm';
  const textColor = theme === 'light' ? 'text-slate-900' : 'text-white';
  const subColor = theme === 'light' ? 'text-slate-700' : 'text-white/95';

  return (
    <div className={`relative inline-flex flex-col items-center select-none text-center ${className}`}>
      {/* Decorative Sparkles */}
      <div className="relative inline-block">
        {/* Sparkles around TheLight */}
        <span
          className={`absolute -top-3.5 -right-6 ${theme === 'light' ? 'text-slate-800' : 'text-white'} animate-twinkle pointer-events-none ${
            isLarge ? 'text-3xl' : isSmall ? 'text-xs' : 'text-base'
          }`}
        >
          ✦
        </span>

        <span
          className={`absolute -top-1 -left-5 ${theme === 'light' ? 'text-slate-500' : 'text-white/70'} animate-twinkle pointer-events-none ${
            isLarge ? 'text-xs' : 'text-[8px]'
          }`}
          style={{ animationDelay: '0.8s' }}
        >
          ·
        </span>

        {isLarge && (
          <span
            className="absolute top-3 -left-9 text-amber-200/90 animate-twinkle pointer-events-none text-sm"
            style={{ animationDelay: '1.2s' }}
          >
            ✦
          </span>
        )}

        {/* TheLight Centered Brand */}
        <h1
          className={`font-brand font-bold tracking-tight ${textColor} leading-none ${
            isLarge
              ? 'text-5xl sm:text-6xl md:text-7xl'
              : isSmall
              ? 'text-xl'
              : 'text-3xl sm:text-4xl'
          }`}
        >
          TheLight
        </h1>

        {/* Hand-Drawn Wavy Underline */}
        <div className="w-full flex justify-center mt-1 sm:mt-1.5">
          <svg
            className={`w-full overflow-visible ${theme === 'light' ? 'text-slate-800' : 'text-white'} ${
              isLarge ? 'h-3.5 max-w-[230px]' : isSmall ? 'h-1.5 max-w-[90px]' : 'h-2.5 max-w-[150px]'
            }`}
            viewBox="0 0 160 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 8 C 25 2, 45 14, 75 8 C 105 2, 130 12, 157 7"
              stroke="currentColor"
              strokeWidth={isLarge ? '3' : '2'}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* "Your Savings Partner" in DOODLY font on next line */}
      {showSubtitle && (
        <div className="relative mt-2 sm:mt-3 flex items-center justify-center">
          <p
            className={`font-doodle tracking-wide ${subColor} font-bold ${
              isLarge
                ? 'text-2xl sm:text-3xl md:text-4xl'
                : isSmall
                ? 'text-xs'
                : 'text-base sm:text-xl'
            }`}
          >
            Your Savings Partner
          </p>

          {isLarge && (
            <>
              <span
                className="absolute -bottom-5 -left-7 text-white/70 animate-twinkle pointer-events-none text-xs"
                style={{ animationDelay: '1.5s' }}
              >
                ·
              </span>
              <span
                className="absolute -bottom-6 right-3 text-amber-200/90 animate-twinkle pointer-events-none text-xs"
                style={{ animationDelay: '0.4s' }}
              >
                ✦
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
