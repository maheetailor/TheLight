import React from 'react';
import {
  Zap,
  Clock,
  TrendingDown,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Leaf,
  ShieldCheck,
} from 'lucide-react';
import { AreaUtilityProfile, EcoSavingIdea } from '../types';

interface HomeViewProps {
  userName: string;
  userAvatar: string;
  utilityProfile: AreaUtilityProfile;
  activeIdeas: EcoSavingIdea[];
  onNavigateToProgress: () => void;
  onNavigateToSchemes: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  userName,
  userAvatar,
  utilityProfile,
  activeIdeas,
  onNavigateToProgress,
  onNavigateToSchemes,
}) => {
  const currentHour = new Date().getHours();
  const isPeak = currentHour >= 16 && currentHour <= 21;
  const completedCount = activeIdeas.filter((i) => i.isCompleted).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols on laptop) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Friendly Greeting Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <span className="text-3xl sm:text-4xl">{userAvatar}</span>
                <div>
                  <h2 className="font-brand font-bold text-xl sm:text-2xl text-slate-900">
                    Hi, {userName}!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-cute text-base">
                    your light &amp; power habits are paying off ~
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                {utilityProfile.currency}
              </span>
            </div>

            {/* Peak Hours Status Callout */}
            <div className="bg-[#f4f4f5] rounded-2xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-slate-700 shrink-0" />
                <div>
                  <p className="font-brand font-bold text-xs sm:text-sm text-slate-900">
                    {isPeak
                      ? 'Peak Pricing Hours Active (4 PM – 9 PM)'
                      : 'Off-Peak Hours Active (Lowest Tariff)'}
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-500">
                    {isPeak
                      ? 'Avoid running water geyser, heavy wash, or AC until after 9 PM to save.'
                      : 'Great time to run laundry, charge devices, or pre-cool rooms.'}
                  </p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-[11px] font-bold font-mono shrink-0 ${
                  isPeak ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {isPeak ? 'Peak' : 'Off-Peak ✦'}
              </span>
            </div>

            {/* Quick Progress Teaser Card */}
            <div
              onClick={onNavigateToProgress}
              className="bg-[#edf7ed] border border-[#d3ecd3] rounded-2xl p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-[#e4f3e4] transition-colors"
            >
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-800 font-bold block">
                  Bill Savings Status
                </span>
                <p className="font-brand font-bold text-sm sm:text-base text-emerald-950">
                  Down 19% this month &bull; The geyser timer is working!
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-800 shrink-0" />
            </div>
          </div>

          {/* Explore Subsidies on Left */}
          <div
            onClick={onNavigateToSchemes}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex items-center justify-between cursor-pointer hover:border-slate-400 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-xl shrink-0">
                🎁
              </div>
              <div>
                <h4 className="font-brand font-bold text-sm sm:text-base text-slate-900">
                  Government &amp; Solar Subsidy Schemes
                </h4>
                <p className="text-xs text-slate-500">
                  Save up to 40% on solar rooftop, BLDC fans &amp; smart geyser rebates.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
        </div>

        {/* Right Column (5 cols on laptop): Active Fixes Checklist */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-brand font-bold text-base text-slate-900">
              Active Household Fixes
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {completedCount} / {activeIdeas.length} active
            </span>
          </div>

          <div className="space-y-3">
            {activeIdeas.map((idea) => (
              <div
                key={idea.id}
                className="p-3.5 rounded-2xl bg-[#f8f9fa] border border-slate-200 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      idea.isCompleted ? 'bg-slate-900 text-white' : 'border border-slate-400'
                    }`}
                  >
                    {idea.isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <h4 className="font-brand font-bold text-xs text-slate-900">{idea.title}</h4>
                    <p className="text-[11px] text-slate-500 truncate max-w-[200px] sm:max-w-xs">{idea.description}</p>
                  </div>
                </div>

                <span className="font-brand font-bold text-xs text-slate-900 shrink-0">
                  +{utilityProfile.currencySymbol}
                  {idea.monthlySavings.toFixed(0)}/mo
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
