import React, { useState } from 'react';
import {
  Zap,
  Flame,
  Droplets,
  Trash2,
  Plus,
  TrendingDown,
  TrendingUp,
  DollarSign,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { BillRecord, UtilityType, AreaUtilityProfile } from '../types';

interface BillsTrackerViewProps {
  bills: BillRecord[];
  onAddBill: (bill: Omit<BillRecord, 'id'>) => void;
  onNavigateToIdeas: () => void;
  utilityProfile: AreaUtilityProfile;
}

export const BillsTrackerView: React.FC<BillsTrackerViewProps> = ({
  bills,
  onAddBill,
  onNavigateToIdeas,
  utilityProfile,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState<UtilityType>('electricity');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [units, setUnits] = useState('');
  const [month, setMonth] = useState('Oct 2026');

  const totalCurrent = bills.reduce((acc, b) => acc + b.amount, 0);
  const totalPrevious = bills.reduce((acc, b) => acc + (b.previousAmount || b.amount), 0);
  const totalSaved = Math.max(0, totalPrevious - totalCurrent);
  const percentChange = totalPrevious > 0 ? ((totalCurrent - totalPrevious) / totalPrevious) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const unitLabels: Record<UtilityType, string> = {
      electricity: 'kWh',
      gas: 'Therms',
      water: 'Gallons',
      waste: 'Bins/mo',
    };

    onAddBill({
      type: selectedType,
      title: title.trim() || `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Bill`,
      month,
      amount: parseFloat(amount),
      units: parseFloat(units) || 0,
      unitLabel: unitLabels[selectedType],
      date: new Date().toISOString().split('T')[0],
      previousAmount: parseFloat(amount) * 1.12, // estimate previous
    });

    setTitle('');
    setAmount('');
    setUnits('');
    setShowAddModal(false);
  };

  const getIcon = (type: UtilityType) => {
    switch (type) {
      case 'electricity':
        return <Zap className="w-5 h-5" />;
      case 'gas':
        return <Flame className="w-5 h-5" />;
      case 'water':
        return <Droplets className="w-5 h-5" />;
      case 'waste':
        return <Trash2 className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Monthly Summary Card */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">
              Monthly Utility Overview &bull; Sep - Oct
            </span>
            <div className="flex items-baseline gap-2">
              <h2 className="font-brand font-bold text-3xl sm:text-4xl text-white">
                {utilityProfile.currencySymbol}
                {totalCurrent.toFixed(2)}
              </h2>
              <span className="text-xs font-mono text-zinc-400">total bills</span>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="self-start sm:self-auto px-5 py-2.5 rounded-full bg-white text-black hover:bg-zinc-200 font-brand font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Log New Bill</span>
          </button>
        </div>

        {/* Comparison banner */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center shrink-0 font-bold">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <p className="font-brand font-semibold text-sm text-white">
                {totalSaved > 0
                  ? `You trimmed ${utilityProfile.currencySymbol}${totalSaved.toFixed(2)} (${Math.abs(percentChange).toFixed(1)}%) vs last month!`
                  : 'Track your bills to start trimming costs!'}
              </p>
              <p className="text-xs text-zinc-400">
                Reduced consumption directly curbs energy plant emissions.
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToIdeas}
            className="text-xs font-brand font-semibold text-white hover:text-zinc-300 flex items-center gap-1 shrink-0 self-end sm:self-auto"
          >
            <span>Ideas to lessen bills</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Utility Bills Breakdown Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-brand font-bold text-base text-white">Your Tracked Utilities</h3>
          <span className="text-xs font-mono text-zinc-500">{bills.length} active meters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {bills.map((bill) => {
            const hasSaved = bill.previousAmount && bill.amount < bill.previousAmount;
            const diff = bill.previousAmount ? bill.previousAmount - bill.amount : 0;

            return (
              <div
                key={bill.id}
                className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 space-y-3.5 shadow-xl hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
                      {getIcon(bill.type)}
                    </div>
                    <div>
                      <h4 className="font-brand font-bold text-sm text-white">{bill.title}</h4>
                      <span className="text-[11px] font-mono text-zinc-500">{bill.month}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-brand font-bold text-lg text-white">
                      {utilityProfile.currencySymbol}
                      {bill.amount.toFixed(2)}
                    </p>
                    <p className="text-[11px] font-mono text-zinc-400">
                      {bill.units} {bill.unitLabel}
                    </p>
                  </div>
                </div>

                {/* Savings status pill */}
                <div className="border-t border-zinc-900 pt-3 flex items-center justify-between text-xs">
                  {hasSaved ? (
                    <span className="text-zinc-300 flex items-center gap-1 font-medium text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      Trimmed {utilityProfile.currencySymbol}
                      {diff.toFixed(2)} from last bill
                    </span>
                  ) : (
                    <span className="text-zinc-500 text-[11px]">Regular baseline usage</span>
                  )}

                  <button
                    onClick={onNavigateToIdeas}
                    className="text-zinc-400 hover:text-white font-cute text-sm"
                  >
                    reduce this ~
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Add Bill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl text-white"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-brand font-bold text-lg text-white">Log a Utility Bill</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-zinc-500 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            {/* Utility Type Picker */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'electricity', label: 'Light', icon: Zap },
                { id: 'gas', label: 'Gas', icon: Flame },
                { id: 'water', label: 'Water', icon: Droplets },
                { id: 'waste', label: 'Waste', icon: Trash2 },
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = selectedType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedType(t.id as UtilityType)}
                    className={`p-2.5 rounded-2xl border text-center flex flex-col items-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-white text-black border-white shadow-lg'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px] font-brand font-bold">{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Bill Name / Note</label>
                <input
                  type="text"
                  placeholder="e.g. October Light & Power"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">
                    Amount ({utilityProfile.currencySymbol})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="95.50"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">
                    Units (kWh / Therms)
                  </label>
                  <input
                    type="number"
                    placeholder="520"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-white text-black hover:bg-zinc-200 font-brand font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
              >
                Save Bill Record ✦
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
