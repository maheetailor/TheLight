import React, { useState, useRef } from 'react';
import { TheLightLogo } from './TheLightLogo';
import { UserSession } from '../types';
import {
  Phone,
  Mail,
  User,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthScreenProps {
  onAuthSuccess: (session: UserSession) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');

  // Sign Up fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Log In fields
  const [loginPhone, setLoginPhone] = useState('+91 98765 43210');
  const [loginEmail, setLoginEmail] = useState('mahee@example.com');
  const [loginPassword, setLoginPassword] = useState('••••••••');

  // OTP Verification state
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['4', '2', '8', '1']);
  const [otpError, setOtpError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(30);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Start OTP verification for Sign Up or Phone Log In
  const handleInitiateOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup' && (!name.trim() || !email.trim() || !phone.trim())) {
      return;
    }
    if (mode === 'login' && loginMethod === 'phone' && !loginPhone.trim()) {
      return;
    }
    setIsVerifyingOtp(true);
    setOtpError('');
  };

  // Verify OTP submission
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpDigits.join('');
    if (entered.length < 4) {
      setOtpError('Please enter all 4 digits');
      return;
    }

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });

    const session: UserSession = {
      name: mode === 'signup' ? name.trim() : (loginMethod === 'phone' ? 'Mahee Tailor' : 'Mahee Tailor'),
      email: mode === 'signup' ? email.trim() : loginEmail.trim(),
      phone: mode === 'signup' ? phone.trim() : loginPhone.trim(),
      avatar: '✨',
      isLoggedIn: true,
    };

    onAuthSuccess(session);
  };

  // Email Direct Log In
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;

    confetti({ particleCount: 40, spread: 50 });

    const session: UserSession = {
      name: 'Mahee Tailor',
      email: loginEmail.trim(),
      phone: '+91 98765 43210',
      avatar: '✨',
      isLoggedIn: true,
    };

    onAuthSuccess(session);
  };

  // Quick Demo Login shortcut
  const handleDemoLogin = () => {
    confetti({ particleCount: 40, spread: 50 });
    onAuthSuccess({
      name: 'Mahee Tailor',
      email: 'mahee@thelight.app',
      phone: '+91 98765 43210',
      avatar: '✨',
      isLoggedIn: true,
    });
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const newDigits = [...otpDigits];
    newDigits[index] = val;
    setOtpDigits(newDigits);
    setOtpError('');

    // Auto advance focus
    if (val && index < 3) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 sm:p-6 select-none relative overflow-hidden animate-in fade-in">
      {/* Background Starry Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
        <span className="absolute top-[12%] left-[18%] text-white text-xl animate-twinkle">✦</span>
        <span className="absolute top-[22%] right-[20%] text-white text-2xl animate-twinkle" style={{ animationDelay: '0.7s' }}>✦</span>
        <span className="absolute bottom-[25%] left-[22%] text-white text-base animate-twinkle" style={{ animationDelay: '1.2s' }}>✦</span>
        <span className="absolute bottom-[18%] right-[26%] text-amber-200 text-lg animate-twinkle" style={{ animationDelay: '0.4s' }}>✦</span>
      </div>

      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Top Logo with doodly subtitle */}
        <div className="text-center pt-2">
          <TheLightLogo size="md" showSubtitle={true} theme="dark" />
        </div>

        {/* OTP VERIFICATION STEP */}
        {isVerifyingOtp ? (
          <form onSubmit={handleVerifyOtp} className="space-y-5 animate-in fade-in duration-200">
            <div className="space-y-1 text-center">
              <h2 className="font-brand font-bold text-xl text-white">
                Verify Your Phone
              </h2>
              <p className="text-xs text-zinc-400">
                Enter the 4-digit verification code sent to{' '}
                <span className="text-white font-mono font-medium">
                  {mode === 'signup' ? phone : loginPhone}
                </span>
              </p>
              <button
                type="button"
                onClick={() => setOtpDigits(['4', '2', '8', '1'])}
                className="text-[11px] text-zinc-400 hover:text-white font-mono underline block mt-1"
              >
                (Demo OTP: 4281 &bull; click to fill)
              </button>
            </div>

            {/* 4 Digit Boxes */}
            <div className="flex justify-center gap-3 py-2">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    otpInputsRef.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-14 h-16 rounded-2xl bg-zinc-900 border-2 border-zinc-800 focus:border-white text-center font-brand font-bold text-2xl text-white focus:outline-none transition-colors"
                />
              ))}
            </div>

            {otpError && (
              <p className="text-xs text-red-400 text-center font-medium">{otpError}</p>
            )}

            <div className="space-y-2 pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-white text-black hover:bg-zinc-200 font-brand font-bold text-xs uppercase tracking-wider transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Verify &amp; Enter TheLight ✦</span>
              </button>

              <div className="flex items-center justify-between text-xs text-zinc-500 pt-1 px-1">
                <button
                  type="button"
                  onClick={() => setIsVerifyingOtp(false)}
                  className="hover:text-zinc-300 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change number</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpDigits(['4', '2', '8', '1']);
                    confetti({ particleCount: 20 });
                  }}
                  className="hover:text-zinc-300 font-mono"
                >
                  Resend OTP
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* REGULAR SIGN UP / LOG IN FORM */
          <div className="space-y-5">
            {/* Mode Switcher: Sign Up vs Log In */}
            <div className="bg-zinc-900 p-1 rounded-full flex items-center border border-zinc-800">
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 py-2 rounded-full text-xs font-brand font-bold transition-all ${
                  mode === 'signup'
                    ? 'bg-white text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sign Up (New User)
              </button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-2 rounded-full text-xs font-brand font-bold transition-all ${
                  mode === 'login'
                    ? 'bg-white text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Log In (Existing)
              </button>
            </div>

            {/* 1. SIGN UP (NEW USER) */}
            {mode === 'signup' && (
              <form onSubmit={handleInitiateOtp} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mahee Tailor"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. mahee@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                    Phone Number (for OTP verification)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-white text-black hover:bg-zinc-200 font-brand font-bold text-xs uppercase tracking-wider transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>Send Verification OTP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* 2. LOG IN (EXISTING USER) */}
            {mode === 'login' && (
              <div className="space-y-4">
                {/* Method Switch: Phone vs Email */}
                <div className="flex items-center justify-center gap-3 text-xs text-zinc-400 pb-1">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('phone')}
                    className={`flex items-center gap-1.5 pb-1 border-b-2 transition-colors ${
                      loginMethod === 'phone'
                        ? 'border-white text-white font-bold'
                        : 'border-transparent text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Phone OTP</span>
                  </button>

                  <span className="text-zinc-700">&bull;</span>

                  <button
                    type="button"
                    onClick={() => setLoginMethod('email')}
                    className={`flex items-center gap-1.5 pb-1 border-b-2 transition-colors ${
                      loginMethod === 'email'
                        ? 'border-white text-white font-bold'
                        : 'border-transparent text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Login</span>
                  </button>
                </div>

                {loginMethod === 'phone' ? (
                  <form onSubmit={handleInitiateOtp} className="space-y-3.5">
                    <div>
                      <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                        Registered Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                        <input
                          type="tel"
                          required
                          value={loginPhone}
                          onChange={(e) => setLoginPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-full bg-white text-black hover:bg-zinc-200 font-brand font-bold text-xs uppercase tracking-wider transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                    >
                      <span>Send Login OTP</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleEmailLogin} className="space-y-3.5">
                    <div>
                      <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="mahee@example.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                        <input
                          type="password"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-full bg-white text-black hover:bg-zinc-200 font-brand font-bold text-xs uppercase tracking-wider transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                    >
                      <span>Log In With Email</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Quick Demo Bypass Button */}
            <div className="pt-2 text-center border-t border-zinc-800/80">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="text-xs text-zinc-400 hover:text-white font-cute text-sm transition-colors py-1 inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Quick demo login (skip to dashboard) ~</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Credit in Bottom Left */}
      <div className="fixed bottom-3 left-4 z-40 pointer-events-none select-none text-[11px] sm:text-xs font-cute text-zinc-300 flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-zinc-800 shadow-lg max-w-[95vw] truncate">
        <span>Bharat Builds tour: Environmental Hacks(Waste and Energy)&nbsp;&nbsp;built by Mahee Tailor</span>
        <span className="text-white text-xs animate-twinkle">✦</span>
      </div>
    </div>
  );
};
