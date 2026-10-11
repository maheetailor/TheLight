import {
  AwsCloudFrontGeo,
  AwsLocationPlace,
  LocationCoordinates,
  AreaUtilityProfile,
} from '../types';

export const REGIONAL_UTILITY_PROFILES: Record<string, AreaUtilityProfile> = {
  US: {
    currency: 'USD',
    currencySymbol: '$',
    avgElectricityRate: 0.17, // $0.17 / kWh
    avgGasRate: 1.45, // $1.45 / therm
    peakHours: '4:00 PM – 9:00 PM',
    gridCleanRating: 'Moderate (38% Clean Renewables)',
    climateZone: 'Varied Continental & Coastal',
  },
  IN: {
    currency: 'INR',
    currencySymbol: '₹',
    avgElectricityRate: 7.5, // ₹7.5 / kWh
    avgGasRate: 48.0, // ₹48 / unit
    peakHours: '6:00 PM – 10:00 PM',
    gridCleanRating: 'Developing (43% Non-Fossil Capacity)',
    climateZone: 'Tropical & Subtropical Monsoon',
  },
  GB: {
    currency: 'GBP',
    currencySymbol: '£',
    avgElectricityRate: 0.28, // £0.28 / kWh
    avgGasRate: 0.07, // £0.07 / kWh gas equivalent
    peakHours: '4:30 PM – 8:30 PM',
    gridCleanRating: 'High (51% Wind, Solar & Nuclear)',
    climateZone: 'Temperate Maritime',
  },
  DE: {
    currency: 'EUR',
    currencySymbol: '€',
    avgElectricityRate: 0.38,
    avgGasRate: 0.12,
    peakHours: '5:00 PM – 9:00 PM',
    gridCleanRating: 'High (55% Renewable Energiewende)',
    climateZone: 'Central European Temperate',
  },
  CA: {
    currency: 'CAD',
    currencySymbol: 'CA$',
    avgElectricityRate: 0.14,
    avgGasRate: 1.25,
    peakHours: '7:00 AM – 11:00 AM & 5:00 PM – 7:00 PM',
    gridCleanRating: 'Very High (68% Hydroelectric Clean)',
    climateZone: 'Northern Cold & Maritime',
  },
};

export const DEFAULT_UTILITY_PROFILE: AreaUtilityProfile = {
  currency: 'USD',
  currencySymbol: '$',
  avgElectricityRate: 0.18,
  avgGasRate: 1.40,
  peakHours: '5:00 PM – 9:00 PM',
  gridCleanRating: 'Global Average (40% Clean)',
  climateZone: 'Temperate Urban',
};

export function getAreaUtilityProfile(countryCode?: string): AreaUtilityProfile {
  if (!countryCode) return DEFAULT_UTILITY_PROFILE;
  const upper = countryCode.toUpperCase();
  return REGIONAL_UTILITY_PROFILES[upper] || DEFAULT_UTILITY_PROFILE;
}

/**
 * Fetch Edge IP Geolocation simulating AWS CloudFront Viewer Geolocation headers
 */
export async function fetchCloudFrontEdgeGeo(): Promise<AwsCloudFrontGeo> {
  try {
    const res = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success !== false) {
        return {
          viewerCountry: data.country_code || 'US',
          viewerCountryName: data.country || 'United States',
          viewerCity: data.city || 'Local Area',
          viewerRegion: data.region || 'Region',
          viewerPostalCode: data.postal || '00000',
          viewerTimeZone: data.timezone?.id || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          viewerLatitude: Number(data.latitude) || 37.7749,
          viewerLongitude: Number(data.longitude) || -122.4194,
          viewerIp: data.ip || '127.0.0.1',
          viewerIsp: data.connection?.isp || data.connection?.org || 'AWS CloudFront Route 53 Edge',
        };
      }
    }
  } catch {
    // fallback
  }

  return {
    viewerCountry: 'US',
    viewerCountryName: 'United States',
    viewerCity: 'San Francisco',
    viewerRegion: 'California',
    viewerPostalCode: '94103',
    viewerTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Los_Angeles',
    viewerLatitude: 37.7749,
    viewerLongitude: -122.4194,
    viewerIp: '198.51.100.42',
    viewerIsp: 'AWS CloudFront Global Edge Network',
  };
}

/**
 * Request high-precision device coordinates using Browser Geolocation API
 */
export async function getDeviceCoordinates(): Promise<LocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
        });
      },
      (err) => {
        reject(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 10000,
      }
    );
  });
}

/**
 * Reverse Geocode coordinates to AWS Location Place format
 */
export async function reverseGeocodeAwsLocation(lat: number, lon: number): Promise<AwsLocationPlace> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`;
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'en' },
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const countryCode = (addr.country_code || 'US').toUpperCase();
      const country = addr.country || 'Unknown';
      const city = addr.city || addr.town || addr.village || addr.municipality || 'Urban Area';
      const region = addr.state || addr.province || '';
      const postalCode = addr.postcode || '';

      const label = [city, region, country].filter(Boolean).join(', ');

      return {
        label: label || data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
        municipality: city,
        region,
        country,
        countryCode,
        postalCode,
      };
    }
  } catch {
    // fallback
  }

  return {
    label: `Local District (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
    municipality: 'Metro City',
    region: 'Region',
    country: 'United States',
    countryCode: 'US',
    postalCode: '94103',
  };
}
