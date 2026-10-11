import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, MapPin, Sparkles } from 'lucide-react';
import { AwsLocationPlace, AreaUtilityProfile } from '../types';

interface HumanOnboardingProps {
  onComplete: (userData: { name: string; avatar: string; typicalBill: number }) => void;
  onSkip: () => void;
  detectedPlace?: AwsLocationPlace;
  isLocating?: boolean;
  onDetectLocation?: () => void;
  utilityProfile: AreaUtilityProfile;
}

export const HumanOnboarding: React.FC<HumanOnboardingProps> = ({
  onComplete,
  onSkip,
  detectedPlace,
  isLocating,
  onDetectLocation,
  utilityProfile,
}) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('Mahee');
  const [avatar, setAvatar] = useState('✨');
  const [typicalBill, setTypicalBill] = useState(110);

  const avatarOptions = ['✨', '💡', '🌱', '🌙', '🐱', '🦊'];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete({ name, avatar, typicalBill });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 select-none animate-in fade-in">
      {/* Background Star Twinkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <span className="absolute top-[15%] left-[20%] text-white text-lg animate-twinkle">✦</span>
        <span className="absolute top-[25%] right-[22%] text-white text-xl animate-twinkle" style={{ animationDelay: '0.8s' }}>✦</span>
        <span className="absolute bottom-[20%] left-[25%] text-white text-sm animate-twinkle" style={{ animationDelay: '1.4s' }}>✦</span>
        <span className="absolute bottom-[30%] right-[28%] text-white text-lg animate-twinkle" style={{ animationDelay: '0.5s' }}>✦</span>
      </div>

      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-6">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-cute text-xl text-zinc-400">your savings journey</span>
            <span className="text-zinc-600">&bull;</span>
            <span className="text-xs font-mono text-zinc-400">Step {step} of 3</span>
          </div>

          <button
            onClick={onSkip}
            className="text-xs text-zinc-500 hover:text-zinc-300 font-medium transition-colors"
          >
            Skip for now
          </button>
        </div>

        {/* STEP 1: Name & Avatar */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
            <div>
              <span className="text-2xl mb-1 block">{avatar}</span>
              <h2 className="text-2xl font-brand font-bold text-white tracking-tight">
                Hi friend! What should we call you?
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                TheLight helps you track utility bills and trim costs every month.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1.5">
                  Your Name or Nickname
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name..."
                  autoFocus
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-white transition-colors font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1.5">
                  Pick your profile vibe
                </label>
                <div className="flex items-center gap-2">
                  {avatarOptions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setAvatar(emoji)}
                      className={`w-10 h-10 rounded-2xl text-lg flex items-center justify-center transition-all ${
                        avatar === emoji
                          ? 'bg-white text-black scale-110 shadow-lg'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Location with AWS */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
            <div>
              <span className="text-2xl mb-1 block">📍</span>
              <h2 className="text-2xl font-brand font-bold text-white tracking-tight">
                Where are you located?
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                AWS Location Service detects your area to fetch regional electric &amp; gas tariffs.
              </p>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">
                    Detected by AWS Location
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-white mt-0.5 leading-snug">
                    {detectedPlace?.label || 'Detecting your area...'}
                  </p>
                </div>
              </div>

              {onDetectLocation && (
                <button
                  onClick={onDetectLocation}
                  disabled={isLocating}
                  className="w-full py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 border border-zinc-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>{isLocating ? 'Scanning with AWS...' : 'Refresh Location'}</span>
                </button>
              )}
            </div>

            <p className="text-xs text-zinc-500 font-cute text-base">
              * Localized rates: {utilityProfile.currencySymbol}{utilityProfile.avgElectricityRate}/kWh electric &bull; Peak {utilityProfile.peakHours}
            </p>
          </div>
        )}

        {/* STEP 3: Typical Monthly Light / Utility Bill */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
            <div>
              <span className="text-2xl mb-1 block">💡</span>
              <h2 className="text-2xl font-brand font-bold text-white tracking-tight">
                Typical Monthly Light &amp; Power Bill?
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Give an approximate number. We will help you trim it by 15-25%!
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-center py-2">
                <span className="font-brand font-bold text-4xl sm:text-5xl text-white">
                  {utilityProfile.currencySymbol}
                  {typicalBill}
                </span>
                <span className="text-xs text-zinc-500 font-mono block mt-1">per month</span>
              </div>

              <input
                type="range"
                min="30"
                max="400"
                step="5"
                value={typicalBill}
                onChange={(e) => setTypicalBill(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
              />

              <div className="flex justify-between text-[11px] font-mono text-zinc-500">
                <span>{utilityProfile.currencySymbol}30</span>
                <span>{utilityProfile.currencySymbol}200</span>
                <span>{utilityProfile.currencySymbol}400+</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between pt-2">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-zinc-200 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg active:scale-95"
          >
            <span>{step === 3 ? 'Start Saving Money ✦' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
