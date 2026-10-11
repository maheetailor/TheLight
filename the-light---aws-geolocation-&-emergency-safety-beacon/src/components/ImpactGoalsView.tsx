import React, { useState } from 'react';
import {
  Trophy,
  Target,
  Leaf,
  DollarSign,
  Sparkles,
  TrendingDown,
  CheckCircle2,
} from 'lucide-react';
import { BillRecord, EcoSavingIdea, AreaUtilityProfile } from '../types';

interface ImpactGoalsViewProps {
  bills: BillRecord[];
  ideas: EcoSavingIdea[];
  utilityProfile: AreaUtilityProfile;
}

export const ImpactGoalsView: React.FC<ImpactGoalsViewProps> = ({
  bills,
  ideas,
  utilityProfile,
}) => {
  const [targetBudget, setTargetBudget] = useState('180');
  const [budgetSet, setBudgetSet] = useState(true);

  const completedIdeas = ideas.filter((i) => i.isCompleted);
  const monthlySavings = completedIdeas.reduce((acc, i) => acc + i.monthlySavings, 0);
  const annualSavings = monthlySavings * 12;
  const co2Monthly = completedIdeas.reduce((acc, i) => acc + i.co2SavedKg, 0);
  const co2Annual = co2Monthly * 12;

  const currentTotal = bills.reduce((acc, b) => acc + b.amount, 0);
  const targetNum = parseFloat(targetBudget) || 200;
  const budgetProgress = Math.min(100, Math.round((currentTotal / targetNum) * 100));

  const badges = [
    {
      id: 'b1',
      title: 'Vampire Slayer',
      desc: 'Killed standby vampire loads on chargers & electronics',
      unlocked: ideas.find((i) => i.id === 'idea-1')?.isCompleted ?? false,
      emoji: '⚡',
    },
    {
      id: 'b2',
      title: 'Off-Peak Master',
      desc: 'Shifted heavy appliances to clean off-peak grid hours',
      unlocked: ideas.find((i) => i.id === 'idea-2')?.isCompleted ?? false,
      emoji: '🌙',
    },
    {
      id: 'b3',
      title: 'Thermostat Whisperer',
      desc: 'Calibrated heater temperature for optimal efficiency',
      unlocked: ideas.find((i) => i.id === 'idea-3')?.isCompleted ?? false,
      emoji: '🔥',
    },
    {
      id: 'b4',
      title: 'Zero Waste Pioneer',
      desc: 'Diverted organic food waste from landfills',
      unlocked: ideas.find((i) => i.id === 'idea-8')?.isCompleted ?? false,
      emoji: '🌱',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Annual Projections Card */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">
            Long-Term Household Impact
          </span>
          <h2 className="font-brand font-bold text-2xl sm:text-3xl text-white">
            Your Annual Savings Forecast
          </h2>
          <p className="text-xs text-zinc-400">
            By keeping your active eco habits, here is what you will accumulate over the next 12 months.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-2">
            <span className="text-xs text-zinc-400 font-medium">Estimated 1-Year Cash Kept</span>
            <p className="font-brand font-bold text-3xl sm:text-4xl text-white">
              {utilityProfile.currencySymbol}
              {annualSavings.toFixed(2)}
            </p>
            <p className="text-xs text-zinc-400 leading-snug">
              Money saved from electricity, heating gas, and municipal waste reduction.
            </p>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-2">
            <span className="text-xs text-zinc-400 font-medium">1-Year Greenhouse Gas Offset</span>
            <p className="font-brand font-bold text-3xl sm:text-4xl text-white">
              {co2Annual.toFixed(0)} kg CO₂
            </p>
            <p className="text-xs text-zinc-400 leading-snug">
              Equivalent to planting {Math.round(co2Annual / 21)} urban trees or skipping {Math.round(co2Annual * 4)} km of gasoline driving.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Monthly Target Budget Tracker */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-brand font-bold text-base text-white">
              Monthly Bill Ceiling Goal
            </h3>
            <p className="text-xs text-zinc-400">
              Keep your combined light and utility bills below this limit.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">{utilityProfile.currencySymbol}</span>
            <input
              type="number"
              value={targetBudget}
              onChange={(e) => setTargetBudget(e.target.value)}
              className="w-24 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-brand font-bold text-white focus:outline-none focus:border-white text-center"
            />
            <span className="text-xs text-zinc-500 font-mono">/ mo</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-zinc-400">
              Current: {utilityProfile.currencySymbol}
              {currentTotal.toFixed(2)}
            </span>
            <span className="text-white font-bold">
              Goal: {utilityProfile.currencySymbol}
              {targetNum.toFixed(2)} ({budgetProgress}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                budgetProgress <= 90 ? 'bg-white' : 'bg-zinc-400'
              }`}
              style={{ width: `${budgetProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Eco Badges & Achievements */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-brand font-bold text-base text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-white" />
            <span>Savings Badges</span>
          </h3>
          <span className="text-xs text-zinc-500 font-mono">
            {badges.filter((b) => b.unlocked).length} of {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border transition-all flex items-center gap-3.5 ${
                b.unlocked
                  ? 'bg-zinc-900/80 border-white/40 shadow-lg'
                  : 'bg-zinc-900/30 border-zinc-800/80 opacity-50'
              }`}
            >
              <div className="text-2xl shrink-0">{b.emoji}</div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-brand font-bold text-sm text-white">{b.title}</h4>
                  {b.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>
                <p className="text-[11px] text-zinc-400 leading-snug">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
