export type UtilityType = 'electricity' | 'gas' | 'water' | 'waste';
export type BeaconMode = 'torch' | 'sos' | 'strobe' | 'amber' | 'night' | 'rescue';

export interface UserSession {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  isLoggedIn: boolean;
}

export interface BillRecord {
  id: string;
  type: UtilityType;
  title: string;
  month: string;
  amount: number;
  units: number;
  unitLabel: string;
  date: string;
  previousAmount?: number;
}

export interface EcoSavingIdea {
  id: string;
  category: UtilityType;
  title: string;
  description: string;
  monthlySavings: number;
  co2SavedKg: number;
  difficulty: 'Super Easy' | 'Quick Fix' | 'Daily Habit';
  isCompleted: boolean;
  tag: string;
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number | null;
  speed?: number | null;
  heading?: number | null;
}

export interface AwsCloudFrontGeo {
  viewerCountry: string;
  viewerCountryName: string;
  viewerCity: string;
  viewerRegion: string;
  viewerPostalCode: string;
  viewerTimeZone: string;
  viewerLatitude: number;
  viewerLongitude: number;
  viewerIp: string;
  viewerIsp: string;
  viewerMetroCode?: string;
}

export interface AwsLocationPlace {
  label: string;
  municipality?: string;
  region?: string;
  country: string;
  countryCode: string;
  postalCode?: string;
  street?: string;
  neighborhood?: string;
}

export interface AreaUtilityProfile {
  currency: string;
  currencySymbol: string;
  avgElectricityRate: number;
  avgGasRate: number;
  peakHours: string;
  gridCleanRating: string;
  climateZone: string;
}

export interface SafeHaven {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  distanceMeters: number;
  address: string;
  phone?: string;
  isOpen247?: boolean;
}

export interface GeofenceZone {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
}

export interface EmergencyNumbers {
  country: string;
  countryCode: string;
  police: string;
  ambulance: string;
  fire: string;
  helpline?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  email: string;
  notifySms: boolean;
  notifyEmail: boolean;
}

export interface CloudWatchLog {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  service: string;
  message: string;
}
