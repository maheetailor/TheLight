import React from 'react';
import { Leaf, User } from 'lucide-react';
import { TheLightLogo } from './TheLightLogo';

interface HeaderProps {
  onOpenProfile: () => void;
  userAvatar: string;
  userName: string;
  onReplaySplash: () => void;
  monthlySavings: number;
  currencySymbol: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenProfile,
  userAvatar,
  userName,
  onReplaySplash,
  monthlySavings,
  currencySymbol,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-6 py-3 select-none">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Logo & Subtitle matching the user's screenshot */}
        <button
          onClick={onReplaySplash}
          className="flex items-center gap-2 group text-left cursor-pointer transition-transform active:scale-95"
          title="TheLight ~ Your Savings Partner (Click to view intro)"
        >
          <TheLightLogo size="sm" showSubtitle={false} />
          <span className="text-[11px] font-cute text-base text-zinc-400 hidden sm:inline ml-1">
            ~ your savings partner
          </span>
        </button>

        {/* Right Action Items: Savings Pill & Profile Avatar */}
        <div className="flex items-center gap-2.5">
          {/* Active Monthly Savings Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-brand text-white">
            <Leaf className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="font-bold text-white">
              +{currencySymbol}{monthlySavings.toFixed(2)}
            </span>
            <span className="text-[10px] text-zinc-400 hidden md:inline">/mo saved</span>
          </div>

          {/* User Profile Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-white hover:bg-zinc-800 transition-colors"
            title="Profile & Preferences"
          >
            <span className="text-sm">{userAvatar}</span>
            <span className="font-brand font-medium text-xs hidden sm:inline max-w-[80px] truncate">
              {userName}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
