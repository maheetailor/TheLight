import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Zap,
  Flame,
  Droplets,
  Trash2,
  DollarSign,
  Leaf,
  Plus,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EcoSavingIdea, UtilityType, AreaUtilityProfile } from '../types';

interface EcoIdeasViewProps {
  ideas: EcoSavingIdea[];
  onToggleIdea: (id: string) => void;
  onAddCustomIdea: (idea: Omit<EcoSavingIdea, 'id'>) => void;
  utilityProfile: AreaUtilityProfile;
}

export const EcoIdeasView: React.FC<EcoIdeasViewProps> = ({
  ideas,
  onToggleIdea,
  onAddCustomIdea,
  utilityProfile,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | UtilityType>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customCategory, setCustomCategory] = useState<UtilityType>('electricity');
  const [customSavings, setCustomSavings] = useState('10');

  const filteredIdeas = filterCategory === 'all' ? ideas : ideas.filter((i) => i.category === filterCategory);

  const completedIdeas = ideas.filter((i) => i.isCompleted);
  const totalMonthlySavings = completedIdeas.reduce((acc, i) => acc + i.monthlySavings, 0);
  const totalAnnualSavings = totalMonthlySavings * 12;
  const totalCo2Saved = completedIdeas.reduce((acc, i) => acc + i.co2SavedKg, 0);

  const handleToggle = (id: string, currentState: boolean) => {
    onToggleIdea(id);
    if (!currentState) {
      // User just checked it as done!
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle) return;

    onAddCustomIdea({
      category: customCategory,
      title: customTitle.trim(),
      description: customDesc.trim() || 'Custom household habit to trim bills.',
      monthlySavings: parseFloat(customSavings) || 8.0,
      co2SavedKg: 15,
      difficulty: 'Daily Habit',
      isCompleted: true,
      tag: 'Custom Habit',
    });

    setCustomTitle('');
    setCustomDesc('');
    setShowAddForm(false);
    confetti({ particleCount: 30, spread: 50 });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Savings & Eco Impact Dashboard */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">
            Impact Dashboard &bull; Save Money &bull; Save Planet
          </span>
          <h2 className="font-brand font-bold text-2xl sm:text-3xl text-white">
            Ideas to Lessen Your Bills
          </h2>
          <p className="text-xs text-zinc-400 max-w-lg">
            Practical human-proven adjustments for your light, gas, and waste usage. Every kilowatt and therm saved keeps money in your wallet and emissions out of the air.
          </p>
        </div>

        {/* Live Savings Meter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
            <span className="text-[10px] uppercase font-mono text-zinc-500 block">
              Monthly Cash Trimmed
            </span>
            <p className="font-brand font-bold text-2xl text-white mt-1">
              {utilityProfile.currencySymbol}
              {totalMonthlySavings.toFixed(2)}
              <span className="text-xs font-normal text-zinc-400"> / mo</span>
            </p>
            <p className="text-[11px] text-zinc-500 font-cute text-sm">
              ~ {utilityProfile.currencySymbol}
              {totalAnnualSavings.toFixed(0)} saved each year
            </p>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
            <span className="text-[10px] uppercase font-mono text-zinc-500 block">
              Carbon Emissions Avoided
            </span>
            <p className="font-brand font-bold text-2xl text-white mt-1">
              {totalCo2Saved} kg
              <span className="text-xs font-normal text-zinc-400"> CO₂ / mo</span>
            </p>
            <p className="text-[11px] text-zinc-500 font-cute text-sm">
              ~ {Math.round(totalCo2Saved * 1.5)} trees equivalent
            </p>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-mono text-zinc-500 block">
              Habits In Action
            </span>
            <p className="font-brand font-bold text-2xl text-white mt-1">
              {completedIdeas.length} / {ideas.length}
            </p>
            <p className="text-[11px] text-zinc-400">
              {Math.round((completedIdeas.length / ideas.length) * 100)}% habits adopted
            </p>
          </div>
        </div>
      </div>

      {/* 2. Category Filters & Add Custom Habit Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Ideas' },
            { id: 'electricity', label: 'Light & Power 💡' },
            { id: 'gas', label: 'Gas & Heat 🔥' },
            { id: 'water', label: 'Water 💧' },
            { id: 'waste', label: 'Waste 🌱' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id as typeof filterCategory)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-brand font-bold transition-all whitespace-nowrap ${
                filterCategory === cat.id
                  ? 'bg-white text-black shadow-md'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="self-start sm:self-auto px-4 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-xs font-brand font-bold text-white border border-zinc-700 flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showAddForm ? 'Close Habit' : 'Add My Own Idea'}</span>
        </button>
      </div>

      {/* 3. Add Custom Habit Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateCustom}
          className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-4 text-white shadow-xl animate-in fade-in"
        >
          <h4 className="font-brand font-bold text-sm text-white">Share a Household Saving Habit</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[11px] text-zinc-400 block mb-1">Habit Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Line-dry bed sheets on sunny afternoons"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Estimated Savings / mo</label>
              <input
                type="number"
                value={customSavings}
                onChange={(e) => setCustomSavings(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-white text-black font-brand font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors"
            >
              Add To My Plan ✦
            </button>
          </div>
        </form>
      )}

      {/* 4. Ideas List */}
      <div className="space-y-3">
        {filteredIdeas.map((idea) => {
          return (
            <div
              key={idea.id}
              onClick={() => handleToggle(idea.id, idea.isCompleted)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer select-none flex items-start justify-between gap-4 shadow-xl ${
                idea.isCompleted
                  ? 'bg-zinc-900/80 border-white/60 shadow-[0_0_25px_rgba(255,255,255,0.08)]'
                  : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Checkbox circle */}
                <div
                  className={`w-6 h-6 rounded-full border-2 mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
                    idea.isCompleted
                      ? 'bg-white border-white text-black'
                      : 'border-zinc-600 hover:border-white'
                  }`}
                >
                  {idea.isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-brand font-bold text-sm sm:text-base text-white">
                      {idea.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
                      {idea.difficulty}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-500">
                      {idea.tag}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
                    {idea.description}
                  </p>
                </div>
              </div>

              {/* Savings pill on right */}
              <div className="text-right shrink-0">
                <span className="font-brand font-bold text-sm sm:text-base text-white block">
                  +{utilityProfile.currencySymbol}
                  {idea.monthlySavings.toFixed(2)}
                </span>
                <span className="text-[11px] font-mono text-zinc-500 block">
                  -{idea.co2SavedKg} kg CO₂
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
