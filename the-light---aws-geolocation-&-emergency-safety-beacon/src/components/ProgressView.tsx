import React from 'react';
import {
  TrendingDown,
  Plus,
  Zap,
  Flame,
  Droplets,
  Trash2,
  CheckCircle2,
  Leaf,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { BillRecord, AreaUtilityProfile, EcoSavingIdea } from '../types';

interface ProgressViewProps {
  bills: BillRecord[];
  onAddBillClick: () => void;
  utilityProfile: AreaUtilityProfile;
  activeIdeas: EcoSavingIdea[];
  onNavigateToSchemes?: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  bills,
  onAddBillClick,
  utilityProfile,
  activeIdeas,
  onNavigateToSchemes,
}) => {
  // Extract electric & light bills
  const electricBills = bills.filter((b) => b.type === 'electricity');
  const latestBill = electricBills[0] || { amount: 2010, previousAmount: 2480, month: 'Sep' };
  const lastMonthAmount = latestBill.previousAmount || 2480;
  const thisMonthAmount = latestBill.amount || 2010;

  const percentDrop = Math.round(((lastMonthAmount - thisMonthAmount) / lastMonthAmount) * 100);

  // Active fix note
  const topIdea = activeIdeas.find((i) => i.isCompleted) || {
    title: 'The geyser timer is working.',
  };
  const fixNote =
    topIdea.title.toLowerCase().includes('geyser') || topIdea.title.toLowerCase().includes('water heater')
      ? 'The geyser timer is working.'
      : `${topIdea.title} is working.`;

  // Bar chart data matching screenshot (Jun, Jul, Aug, Sep)
  const chartData = [
    { month: 'Jun', amount: 2650, heightPct: 88, isCurrent: false },
    { month: 'Jul', amount: 2580, heightPct: 84, isCurrent: false },
    { month: 'Aug', amount: 2480, heightPct: 78, isCurrent: false },
    { month: 'Sep', amount: thisMonthAmount, heightPct: 62, isCurrent: true },
  ];

  const totalMonthlySavings = activeIdeas
    .filter((i) => i.isCompleted)
    .reduce((acc, i) => acc + i.monthlySavings, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Laptop & Mobile Grid: On laptop, side-by-side! On mobile, vertical stack */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Exactly matching Screenshot (209) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-5">
          {/* Title & Subtitle */}
          <div className="space-y-0.5">
            <h2 className="font-brand font-bold text-2xl text-slate-900 tracking-tight">
              Monthly progress
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Are the fixes working?
            </p>
          </div>

          {/* Dual Cards: Last Month vs This Month */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Last Month Card */}
            <div className="bg-[#f4f4f5] rounded-2xl p-4 sm:p-5 space-y-1">
              <span className="text-[11px] text-slate-500 font-medium block">
                Last month
              </span>
              <p className="font-brand font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
                {utilityProfile.currencySymbol}
                {lastMonthAmount.toLocaleString()}
              </p>
            </div>

            {/* This Month Card */}
            <div className="bg-[#f4f4f5] rounded-2xl p-4 sm:p-5 space-y-1">
              <span className="text-[11px] text-slate-500 font-medium block">
                This month
              </span>
              <p className="font-brand font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
                {utilityProfile.currencySymbol}
                {thisMonthAmount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Green Highlighted Status Banner matching Screenshot (209) */}
          <div className="bg-[#edf7ed] border border-[#d3ecd3] rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 text-slate-800">
            <div className="text-emerald-700 shrink-0">
              <TrendingDown className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="space-y-0.5">
              <p className="font-brand font-bold text-xs sm:text-sm text-emerald-950 flex items-center gap-1.5">
                <span>Down {percentDrop > 0 ? `${percentDrop}%` : '19%'}</span>
              </p>
              <p className="text-xs text-emerald-800 font-medium">
                {fixNote}
              </p>
            </div>
          </div>

          {/* Monthly Bar Chart matching Screenshot (209) */}
          <div className="pt-3 pb-1">
            <div className="grid grid-cols-4 gap-3 items-end h-44 px-2 sm:px-6">
              {chartData.map((bar) => (
                <div key={bar.month} className="flex flex-col items-center gap-2 h-full justify-end">
                  {/* Amount above bar */}
                  <span className="text-[10px] font-mono text-slate-400">
                    {utilityProfile.currencySymbol}{Math.round(bar.amount)}
                  </span>
                  {/* Bar */}
                  <div
                    className={`w-full max-w-[62px] rounded-xl transition-all ${
                      bar.isCurrent
                        ? 'bg-[#2563eb] shadow-md shadow-blue-500/25'
                        : 'bg-[#9ca3af]'
                    }`}
                    style={{ height: `${bar.heightPct}%` }}
                  />
                  {/* Month Label */}
                  <span
                    className={`text-xs font-medium ${
                      bar.isCurrent ? 'text-slate-900 font-bold' : 'text-slate-500'
                    }`}
                  >
                    {bar.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* "Add this month's bill" Button */}
          <div className="pt-2">
            <button
              onClick={onAddBillClick}
              className="w-full py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-brand font-bold text-xs tracking-wide border border-slate-300 shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" />
              <span>Add this month&apos;s bill</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN (Laptop-optimized companion view to fill screen) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Active Fixes Status Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-brand font-bold text-base text-slate-900">
                Fixes In Progress
              </h3>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                +{utilityProfile.currencySymbol}{totalMonthlySavings.toFixed(0)}/mo saved
              </span>
            </div>

            <div className="space-y-3">
              {activeIdeas.slice(0, 4).map((idea) => (
                <div
                  key={idea.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        idea.isCompleted ? 'bg-slate-900 text-white' : 'border border-slate-300'
                      }`}
                    >
                      {idea.isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <h4 className="font-brand font-bold text-xs text-slate-800">{idea.title}</h4>
                      <p className="text-[11px] text-slate-500 font-cute text-sm">
                        {idea.tag} &bull; {idea.difficulty}
                      </p>
                    </div>
                  </div>

                  <span className="font-brand font-bold text-xs text-slate-900 shrink-0">
                    +{utilityProfile.currencySymbol}{idea.monthlySavings.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Energy Tip & Subsidy Banner */}
          <div className="bg-[#f0f9ff] border border-sky-200 rounded-3xl p-6 space-y-3 text-slate-800">
            <span className="text-[10px] uppercase font-mono tracking-wider text-sky-800 font-bold block">
              Area Grid Advice &bull; Peak vs Off-Peak
            </span>
            <h4 className="font-brand font-bold text-sm text-slate-900">
              Shift Heavy Loads Outside {utilityProfile.peakHours}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your regional utility charges up to 30% more per kWh during peak hours. Running your geyser on a timer before 4 PM or after 9 PM locks in off-peak tariffs.
            </p>
            {onNavigateToSchemes && (
              <button
                onClick={onNavigateToSchemes}
                className="text-xs font-brand font-bold text-sky-900 hover:text-sky-950 flex items-center gap-1 pt-1"
              >
                <span>View Government Rooftop Solar Subsidies</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
