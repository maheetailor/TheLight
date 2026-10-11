import React, { useState } from 'react';
import {
  Sun,
  Zap,
  Flame,
  Award,
  ExternalLink,
  CheckCircle2,
  DollarSign,
  ChevronRight,
} from 'lucide-react';
import { AreaUtilityProfile } from '../types';

interface SchemesViewProps {
  utilityProfile: AreaUtilityProfile;
}

interface SchemeItem {
  id: string;
  title: string;
  provider: string;
  savings: string;
  description: string;
  category: 'Solar' | 'Appliances' | 'Tariff' | 'Waste';
  applied: boolean;
}

export const SchemesView: React.FC<SchemesViewProps> = ({ utilityProfile }) => {
  const [schemes, setSchemes] = useState<SchemeItem[]>([
    {
      id: 's1',
      title: 'Rooftop Solar Subsidy (Surya Clean Energy)',
      provider: 'Ministry of New & Renewable Energy / State Utility',
      savings: `Up to ${utilityProfile.currencySymbol}78,000 grant`,
      description: 'Get up to 40% direct capital subsidy to install 2-3 kW rooftop solar panels, slashing your light bill to near zero.',
      category: 'Solar',
      applied: false,
    },
    {
      id: 's2',
      title: 'Smart Geyser & Heat Pump Rebate Scheme',
      provider: 'Municipal Energy Efficiency Council',
      savings: `${utilityProfile.currencySymbol}2,500 bill cashback`,
      description: 'Upgrade your water heater or add a smart programmable timer to receive automatic utility rebates.',
      category: 'Appliances',
      applied: true,
    },
    {
      id: 's3',
      title: 'Time-of-Day (ToD) Off-Peak Tariff Scheme',
      provider: 'Distribution Utility (DISCOM)',
      savings: '15% to 20% discount on off-peak kWh',
      description: 'Register your smart meter for Time-of-Day tariffs to pay drastically lower electricity rates during off-peak hours.',
      category: 'Tariff',
      applied: true,
    },
    {
      id: 's4',
      title: 'BLDC Super-Efficient Fan Replacement Rebate',
      provider: 'National Energy Efficiency Program',
      savings: `${utilityProfile.currencySymbol}800 rebate per fan`,
      description: 'Replaces 75W induction motors with 28W BLDC fans, saving up to 65% electricity on continuous cooling.',
      category: 'Appliances',
      applied: false,
    },
    {
      id: 's5',
      title: 'Municipal Zero Waste Compost Rebate',
      provider: 'City Environmental Services',
      savings: 'Free composting kit & 10% waste fee cut',
      description: 'Get free composting bins for kitchen wet waste, reducing landfill hauling and methane emissions.',
      category: 'Waste',
      applied: false,
    },
  ]);

  const toggleApply = (id: string) => {
    setSchemes(schemes.map((s) => (s.id === id ? { ...s, applied: !s.applied } : s)));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Overview */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-2">
        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
          Government &bull; Utility &bull; Environmental
        </span>
        <h2 className="font-brand font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
          Savings Schemes &amp; Subsidies
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl">
          Active rebates in your area to help lessen energy bills and adopt cleaner household technology.
        </p>
      </div>

      {/* 2. Grid of Schemes: 2-column on laptop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {schemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-3.5 hover:border-slate-300 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                  {scheme.category}
                </span>
                <span className="text-xs text-emerald-700 font-brand font-bold">
                  {scheme.savings}
                </span>
              </div>
              <h3 className="font-brand font-bold text-base text-slate-900">
                {scheme.title}
              </h3>
              <p className="text-[11px] text-slate-500">
                Offered by: {scheme.provider}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {scheme.description}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => toggleApply(scheme.id)}
                className={`px-5 py-2 rounded-full text-xs font-brand font-bold transition-all ${
                  scheme.applied
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {scheme.applied ? 'Enrolled ✦' : 'Check Eligibility'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
