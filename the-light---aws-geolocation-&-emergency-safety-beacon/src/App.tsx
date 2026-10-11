import React, { useState, useEffect, useCallback } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { AuthScreen } from './components/AuthScreen';
import { ProgressView } from './components/ProgressView';
import { HomeView } from './components/HomeView';
import { StreetView } from './components/StreetView';
import { SchemesView } from './components/SchemesView';
import {
  Menu,
  Home,
  Users,
  BarChart2,
  Gift,
  RotateCcw,
  ArrowDown,
  X,
  Plus,
  LogOut,
  MapPin,
  Sparkles,
} from 'lucide-react';
import {
  LocationCoordinates,
  AwsCloudFrontGeo,
  AwsLocationPlace,
  BillRecord,
  EcoSavingIdea,
  AreaUtilityProfile,
  UtilityType,
  UserSession,
} from './types';
import {
  fetchCloudFrontEdgeGeo,
  getDeviceCoordinates,
  reverseGeocodeAwsLocation,
  getAreaUtilityProfile,
} from './services/locationService';
import { INITIAL_BILLS, INITIAL_IDEAS } from './services/savingsData';

type AppTab = 'home' | 'street' | 'progress' | 'schemes';

export default function App() {
  // 1. Splash Screen on initial open (2.8s) displaying "TheLight" and "Your Savings Partner" in doodly font
  const [showSplash, setShowSplash] = useState(true);

  // 2. Authentication Session State
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('thelight_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return null;
  });

  // 3. Active Tab matching Screenshot (209): defaults to 'progress'
  const [activeTab, setActiveTab] = useState<AppTab>('progress');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // 4. Bills & Ideas State
  const [bills, setBills] = useState<BillRecord[]>(() => {
    const saved = localStorage.getItem('thelight_bills');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return INITIAL_BILLS;
  });

  const [ideas, setIdeas] = useState<EcoSavingIdea[]>(() => {
    const saved = localStorage.getItem('thelight_ideas');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return INITIAL_IDEAS;
  });

  // Add bill modal state
  const [showAddBillModal, setShowAddBillModal] = useState(false);
  const [newBillAmount, setNewBillAmount] = useState('2010');
  const [newBillMonth, setNewBillMonth] = useState('Sep');
  const [newBillType, setNewBillType] = useState<UtilityType>('electricity');

  useEffect(() => {
    localStorage.setItem('thelight_bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem('thelight_ideas', JSON.stringify(ideas));
  }, [ideas]);

  // 5. AWS Location & Area Telemetry State
  const [coordinates, setCoordinates] = useState<LocationCoordinates>({
    latitude: 19.076,
    longitude: 72.8777,
    accuracy: 35,
  });

  const [edgeGeo, setEdgeGeo] = useState<AwsCloudFrontGeo>({
    viewerCountry: 'IN',
    viewerCountryName: 'India',
    viewerCity: 'Mumbai',
    viewerRegion: 'Maharashtra',
    viewerPostalCode: '400001',
    viewerTimeZone: 'Asia/Kolkata',
    viewerLatitude: 19.076,
    viewerLongitude: 72.8777,
    viewerIp: '198.51.100.42',
    viewerIsp: 'AWS CloudFront Global Edge Network',
  });

  const [place, setPlace] = useState<AwsLocationPlace>({
    label: 'Bandra West, Mumbai, Maharashtra, India',
    municipality: 'Mumbai',
    region: 'Maharashtra',
    country: 'India',
    countryCode: 'IN',
    postalCode: '400050',
  });

  const [isLocating, setIsLocating] = useState(false);

  // Query location with AWS
  const refreshLocation = useCallback(async () => {
    setIsLocating(true);
    try {
      const edge = await fetchCloudFrontEdgeGeo();
      setEdgeGeo(edge);

      let coords: LocationCoordinates;
      try {
        coords = await getDeviceCoordinates();
      } catch {
        coords = {
          latitude: edge.viewerLatitude,
          longitude: edge.viewerLongitude,
          accuracy: 45,
        };
      }

      setCoordinates(coords);

      const resolvedPlace = await reverseGeocodeAwsLocation(coords.latitude, coords.longitude);
      setPlace(resolvedPlace);
    } catch {
      // handled
    } finally {
      setIsLocating(false);
    }
  }, []);

  useEffect(() => {
    refreshLocation();
  }, [refreshLocation]);

  const utilityProfile = getAreaUtilityProfile(place.countryCode || edgeGeo.viewerCountry);

  const handleAuthSuccess = (newSession: UserSession) => {
    setSession(newSession);
    localStorage.setItem('thelight_session', JSON.stringify(newSession));
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem('thelight_session');
  };

  const handleAddBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBillAmount) return;

    const amt = parseFloat(newBillAmount);
    const newBill: BillRecord = {
      id: 'bill-' + Date.now(),
      type: newBillType,
      title: `${newBillMonth} Utility Bill`,
      month: newBillMonth,
      amount: amt,
      units: Math.round(amt / (utilityProfile.avgElectricityRate || 7.5)),
      unitLabel: 'kWh',
      date: new Date().toISOString().split('T')[0],
      previousAmount: amt * 1.23, // 19% drop
    };

    setBills([newBill, ...bills]);
    setShowAddBillModal(false);
  };

  // Keyboard navigation for laptop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      if (e.key === '1') setActiveTab('home');
      else if (e.key === '2') setActiveTab('street');
      else if (e.key === '3') setActiveTab('progress');
      else if (e.key === '4') setActiveTab('schemes');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, shortcut: '1' },
    { id: 'street', label: 'Street', icon: Users, shortcut: '2' },
    { id: 'progress', label: 'Progress', icon: BarChart2, shortcut: '3' },
    { id: 'schemes', label: 'Schemes', icon: Gift, shortcut: '4' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 flex flex-col justify-between font-sans selection:bg-slate-900 selection:text-white relative">
      {/* 1. Splash Screen on Launch (2.8s) displaying "TheLight" and "Your Savings Partner" in doodly font */}
      {showSplash && <SplashScreen onDismiss={() => setShowSplash(false)} durationMs={2800} />}

      {/* 2. Login & Sign Up Flow (if user is not authenticated) */}
      {!showSplash && !session && (
        <AuthScreen onAuthSuccess={handleAuthSuccess} />
      )}

      {/* 3. Main Authenticated App */}
      {!showSplash && session && (
        <div className="flex-1 flex flex-col w-full">
          {/* TOP HEADER: Full-width on laptop, compact on mobile */}
          <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-xs px-4 sm:px-8 py-3 select-none">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              {/* Brand Logo & Name */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="sm:hidden p-1.5 -ml-1 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  title="Menu"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setShowSplash(true)}
                  className="flex items-center gap-2 group cursor-pointer"
                  title="View Intro"
                >
                  <h1 className="font-brand font-bold text-lg sm:text-xl text-slate-900 tracking-tight">
                    TheLight
                  </h1>
                  <span className="font-doodle text-slate-500 font-bold text-sm hidden sm:inline ml-1">
                    ~ your savings partner
                  </span>
                </button>
              </div>

              {/* LAPTOP NAVIGATION BAR: Fills screen naturally on laptop! */}
              <nav aria-label="Desktop Navigation" className="hidden sm:flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isCurrent = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as AppTab)}
                      className={`px-4 py-1.5 rounded-full text-xs font-brand font-bold flex items-center gap-2 transition-all ${
                        isCurrent
                          ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* User Profile & Actions */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-brand text-slate-700">
                  <span>{session.avatar}</span>
                  <span className="font-bold text-slate-900 max-w-[100px] truncate">
                    {session.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>

          {/* MAIN CONTENT AREA: Laptop fits wide screen (max-w-6xl), Mobile is full touch view */}
          <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 pb-28 sm:pb-12">
            {activeTab === 'progress' && (
              <ProgressView
                bills={bills}
                onAddBillClick={() => setShowAddBillModal(true)}
                utilityProfile={utilityProfile}
                activeIdeas={ideas}
                onNavigateToSchemes={() => setActiveTab('schemes')}
              />
            )}

            {activeTab === 'home' && (
              <HomeView
                userName={session.name}
                userAvatar={session.avatar}
                utilityProfile={utilityProfile}
                activeIdeas={ideas}
                onNavigateToProgress={() => setActiveTab('progress')}
                onNavigateToSchemes={() => setActiveTab('schemes')}
              />
            )}

            {activeTab === 'street' && (
              <StreetView
                coordinates={coordinates}
                edgeGeo={edgeGeo}
                place={place}
                utilityProfile={utilityProfile}
                isLocating={isLocating}
                onRefreshLocation={refreshLocation}
              />
            )}

            {activeTab === 'schemes' && (
              <SchemesView utilityProfile={utilityProfile} />
            )}
          </main>

          {/* MOBILE BOTTOM NAVIGATION BAR: Only on mobile (< 640px) */}
          <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg">
            <nav aria-label="Mobile Navigation" className="grid grid-cols-4 gap-1 px-2 py-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isCurrent = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as AppTab)}
                    className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                      isCurrent
                        ? 'text-[#2563eb] font-bold bg-blue-50/60'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-0.5" />
                    <span className="text-[11px] font-brand">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile Replay Button */}
            <div className="bg-slate-50 border-t border-slate-100 py-1.5 px-4 flex items-center justify-center">
              <button
                onClick={() => setShowSplash(true)}
                className="flex items-center gap-1 text-[11px] font-brand font-medium text-slate-600 bg-white border border-slate-200 px-3 py-0.5 rounded-full shadow-xs"
              >
                <RotateCcw className="w-3 h-3 mr-0.5" />
                <span>Replay loading screen</span>
                <ArrowDown className="w-3 h-3 ml-0.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* LAPTOP FOOTER BAR: Replay loading screen button on laptop */}
          <div className="hidden sm:flex max-w-6xl mx-auto w-full px-6 py-4 items-center justify-end">
            <button
              onClick={() => setShowSplash(true)}
              className="flex items-center gap-1.5 text-xs font-brand font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-xs hover:shadow-sm transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-0.5" />
              <span>Replay loading screen</span>
              <ArrowDown className="w-3.5 h-3.5 ml-0.5 text-slate-400" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Add Bill Modal */}
      {showAddBillModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddBill}
            className="w-full max-w-sm bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-brand font-bold text-base text-slate-900">
                Add This Month&apos;s Bill
              </h3>
              <button
                type="button"
                onClick={() => setShowAddBillModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">
                  Month
                </label>
                <input
                  type="text"
                  value={newBillMonth}
                  onChange={(e) => setNewBillMonth(e.target.value)}
                  placeholder="e.g. Sep"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">
                  Bill Amount ({utilityProfile.currencySymbol})
                </label>
                <input
                  type="number"
                  step="1"
                  required
                  value={newBillAmount}
                  onChange={(e) => setNewBillAmount(e.target.value)}
                  placeholder="2010"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-brand font-bold text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-black text-white font-brand font-bold text-xs uppercase tracking-wide transition-all shadow-md active:scale-95"
            >
              Update Progress ✦
            </button>
          </form>
        </div>
      )}

      {/* 5. Signature in Bottom Left as requested: "Bharat Builds tour: Environmental Hacks(Waste and Energy)  built by Mahee Tailor" */}
      <div className="fixed bottom-3 left-4 z-40 pointer-events-none select-none text-[11px] sm:text-xs font-cute text-slate-700 sm:text-zinc-300 flex items-center gap-1.5 bg-white/95 sm:bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-300 sm:border-zinc-800 shadow-lg max-w-[95vw] truncate">
        <span>Bharat Builds tour: Environmental Hacks(Waste and Energy)&nbsp;&nbsp;built by Mahee Tailor</span>
        <span className="text-slate-800 sm:text-white text-xs animate-twinkle">✦</span>
      </div>
    </div>
  );
}
