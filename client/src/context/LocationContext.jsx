import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { reverseGeocode, searchPlaces } from '../services/geocodingService.js';

const STORAGE_KEY = 'agrisphere_location_v1';

// Preset locations for quick selection
export const PRESET_REGIONS = [
  {
    id: 'belagavi',
    name: 'Belagavi, Karnataka',
    city: 'Belagavi',
    district: 'Belagavi',
    state: 'Karnataka',
    country: 'India',
    latitude: 15.8497,
    longitude: 74.4977,
  },
  {
    id: 'gokak',
    name: 'Gokak, Karnataka',
    city: 'Gokak',
    district: 'Belagavi',
    state: 'Karnataka',
    country: 'India',
    latitude: 16.1667,
    longitude: 74.8333,
  },
  {
    id: 'chikodi',
    name: 'Chikodi, Karnataka',
    city: 'Chikodi',
    district: 'Belagavi',
    state: 'Karnataka',
    country: 'India',
    latitude: 16.4333,
    longitude: 74.6000,
  },
  {
    id: 'bailhongal',
    name: 'Bailhongal, Karnataka',
    city: 'Bailhongal',
    district: 'Belagavi',
    state: 'Karnataka',
    country: 'India',
    latitude: 15.8167,
    longitude: 74.8667,
  },
  {
    id: 'dharwad',
    name: 'Dharwad, Karnataka',
    city: 'Dharwad',
    district: 'Dharwad',
    state: 'Karnataka',
    country: 'India',
    latitude: 15.4589,
    longitude: 75.0078,
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru, Karnataka',
    city: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    country: 'India',
    latitude: 12.9716,
    longitude: 77.5946,
  },
  {
    id: 'mangaluru',
    name: 'Mangaluru, Karnataka',
    city: 'Mangaluru',
    district: 'Dakshina Kannada',
    state: 'Karnataka',
    country: 'India',
    latitude: 12.9141,
    longitude: 74.8560,
  },
];

const parseWmoCode = (code) => {
  if (code === 0) return { condition: 'Clear Sky', iconType: 'sun' };
  if (code === 1) return { condition: 'Mainly Clear', iconType: 'sun' };
  if (code === 2) return { condition: 'Partly Cloudy', iconType: 'cloud-sun' };
  if (code === 3) return { condition: 'Overcast', iconType: 'cloud' };
  if (code >= 45 && code <= 48) return { condition: 'Foggy', iconType: 'cloud' };
  if (code >= 51 && code <= 55) return { condition: 'Light Drizzle', iconType: 'rain' };
  if (code >= 61 && code <= 65) return { condition: 'Rainy', iconType: 'rain' };
  if (code >= 80 && code <= 82) return { condition: 'Rain Showers', iconType: 'rain' };
  if (code >= 95) return { condition: 'Thunderstorm', iconType: 'rain' };
  return { condition: 'Partly Cloudy', iconType: 'cloud-sun' };
};

const formatTimeFromIso = (isoStr) => {
  if (!isoStr) return null;
  try {
    const d = new Date(isoStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch {
    return null;
  }
};

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  // Load initial state from localStorage or default to Global mode
  const [locationState, setLocationState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          latitude: parsed.latitude ?? null,
          longitude: parsed.longitude ?? null,
          city: parsed.city ?? null,
          district: parsed.district ?? null,
          state: parsed.state ?? null,
          country: parsed.country ?? null,
          pincode: parsed.pincode ?? null,
          fullAddress: parsed.fullAddress ?? null,
          formattedName: parsed.formattedName || 'Global',
          source: parsed.source || 'global',
          permissionStatus: parsed.permissionStatus || 'prompt',
          loadingStatus: false,
          errorStatus: null,
          lastSuccessfulLocation: parsed.lastSuccessfulLocation || null,
          isStale: parsed.source === 'gps', // Cached GPS is considered stale until refreshed
        };
      }
    } catch (e) {
      console.warn('Failed to parse cached location:', e);
    }

    // Default when no prior selection exists: Global mode (never fabricate GPS coordinates)
    return {
      latitude: null,
      longitude: null,
      city: null,
      district: null,
      state: null,
      country: null,
      pincode: null,
      fullAddress: null,
      formattedName: 'Global',
      source: 'global',
      permissionStatus: 'prompt',
      loadingStatus: false,
      errorStatus: null,
      lastSuccessfulLocation: null,
      isStale: false,
    };
  });

  const [weatherData, setWeatherData] = useState(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      const {
        latitude,
        longitude,
        city,
        district,
        state,
        country,
        pincode,
        fullAddress,
        formattedName,
        source,
        permissionStatus,
        lastSuccessfulLocation,
      } = locationState;

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          latitude,
          longitude,
          city,
          district,
          state,
          country,
          pincode,
          fullAddress,
          formattedName,
          source,
          permissionStatus,
          lastSuccessfulLocation,
        })
      );
    } catch (e) {
      console.warn('Failed to persist location:', e);
    }
  }, [locationState]);

  // Fetch live weather from Open-Meteo when coordinates exist
  const fetchWeather = useCallback(async (lat, lng, locationLabel) => {
    if (lat == null || lng == null) {
      // Global Mode: provide general regional reference data
      setWeatherData({
        isGlobal: true,
        temp: '26°C',
        condition: 'Regional Overview',
        iconType: 'cloud-sun',
        humidity: '72%',
        wind: '12 km/h',
        rain: '0 mm',
        rainSum: '0 mm',
        sunrise: '06:15 AM',
        sunset: '06:10 PM',
        uvIndex: 6,
        locationLabel: 'Regional Outlook (Global Mode)',
        forecast: [
          { day: 'Today', date: 'Today', temp: '26°C', high: '28°', low: '18°', condition: 'Partly Cloudy', iconType: 'cloud-sun', rain: '10%', spray: 'Good Window' },
          { day: 'Tomorrow', date: 'Tomorrow', temp: '27°C', high: '29°', low: '19°', condition: 'Sunny', iconType: 'sun', rain: '5%', spray: 'Ideal Window' },
          { day: 'Day 3', date: 'Day 3', temp: '25°C', high: '27°', low: '18°', condition: 'Partly Cloudy', iconType: 'cloud-sun', rain: '15%', spray: 'Good Window' },
          { day: 'Day 4', date: 'Day 4', temp: '24°C', high: '25°', low: '17°', condition: 'Light Rain', iconType: 'rain', rain: '65%', spray: 'Avoid Spraying' },
          { day: 'Day 5', date: 'Day 5', temp: '26°C', high: '28°', low: '18°', condition: 'Clear', iconType: 'sun', rain: '10%', spray: 'Good Window' },
        ],
        hourly: [
          { time: '06:00', temp: '20°C', condition: 'Clear', iconType: 'sun', rainProb: '0%' },
          { time: '09:00', temp: '24°C', condition: 'Sunny', iconType: 'sun', rainProb: '5%' },
          { time: '12:00', temp: '28°C', condition: 'Partly Cloudy', iconType: 'cloud-sun', rainProb: '10%' },
          { time: '15:00', temp: '27°C', condition: 'Partly Cloudy', iconType: 'cloud-sun', rainProb: '15%' },
          { time: '18:00', temp: '24°C', condition: 'Clear', iconType: 'sun', rainProb: '5%' },
          { time: '21:00', temp: '22°C', condition: 'Clear', iconType: 'sun', rainProb: '0%' },
        ],
      });
      setIsWeatherLoading(false);
      setWeatherError(null);
      return;
    }

    setIsWeatherLoading(true);
    setWeatherError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,sunrise,sunset,uv_index_max&timezone=auto`;

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Weather API returned status ${response.status}`);
      }

      const data = await response.json();
      const currentWmo = parseWmoCode(data.current?.weather_code);
      const temp = Math.round(data.current?.temperature_2m ?? 26);
      const humidity = Math.round(data.current?.relative_humidity_2m ?? 70);
      const wind = Math.round(data.current?.wind_speed_10m ?? 12);
      const rain = (data.current?.precipitation ?? 0).toFixed(1);
      const rainSum = (data.daily?.precipitation_sum?.[0] ?? 0).toFixed(1);
      const sunrise = formatTimeFromIso(data.daily?.sunrise?.[0]) || '06:15 AM';
      const sunset = formatTimeFromIso(data.daily?.sunset?.[0]) || '06:10 PM';
      const uvIndex = Math.round(data.daily?.uv_index_max?.[0] ?? 6);

      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const forecastDays = [];
      if (data.daily?.time) {
        for (let i = 0; i < Math.min(data.daily.time.length, 7); i++) {
          const d = new Date(data.daily.time[i]);
          const dayName = i === 0 ? 'Today' : days[d.getDay()];
          const maxTemp = Math.round(data.daily.temperature_2m_max[i] ?? 28);
          const minTemp = Math.round(data.daily.temperature_2m_min[i] ?? 18);
          const wmo = parseWmoCode(data.daily.weather_code[i]);
          const rainProb = (data.daily.precipitation_probability_max?.[i] ?? 0) + '%';
          forecastDays.push({
            day: dayName,
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            temp: `${maxTemp}°C`,
            high: `${maxTemp}°`,
            low: `${minTemp}°`,
            condition: wmo.condition,
            iconType: wmo.iconType,
            rain: rainProb,
            spray: parseInt(rainProb, 10) > 40 ? 'Avoid Spraying' : 'Good Window',
          });
        }
      }

      // Next 24 hours hourly
      const hourly = [];
      if (data.hourly?.time) {
        const nowMs = Date.now();
        for (let i = 0; i < data.hourly.time.length; i++) {
          const itemMs = new Date(data.hourly.time[i]).getTime();
          if (itemMs >= nowMs - 3600000 && hourly.length < 24) {
            const itemDate = new Date(data.hourly.time[i]);
            const wmo = parseWmoCode(data.hourly.weather_code[i]);
            hourly.push({
              time: itemDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
              temp: `${Math.round(data.hourly.temperature_2m[i] ?? 26)}°C`,
              humidity: `${Math.round(data.hourly.relative_humidity_2m[i] ?? 70)}%`,
              rainProb: `${data.hourly.precipitation_probability[i] ?? 0}%`,
              condition: wmo.condition,
              iconType: wmo.iconType,
            });
          }
        }
      }

      setWeatherData({
        isGlobal: false,
        temp: `${temp}°C`,
        condition: currentWmo.condition,
        iconType: currentWmo.iconType,
        humidity: `${humidity}%`,
        wind: `${wind} km/h`,
        rain: `${rain} mm`,
        rainSum: `${rainSum} mm`,
        sunrise,
        sunset,
        uvIndex,
        locationLabel: locationLabel || `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`,
        forecast: forecastDays,
        hourly,
      });
    } catch (err) {
      console.warn('Weather fetch error:', err);
      setWeatherError('Weather data temporarily unavailable.');
    } finally {
      setIsWeatherLoading(false);
    }
  }, []);

  // Update weather whenever active coordinates change
  useEffect(() => {
    fetchWeather(locationState.latitude, locationState.longitude, locationState.formattedName);
  }, [locationState.latitude, locationState.longitude, locationState.formattedName, fetchWeather]);

  // Action: Request real GPS location via browser Geolocation API
  const requestCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationState((prev) => ({
        ...prev,
        permissionStatus: 'unavailable',
        loadingStatus: false,
        errorStatus: 'Geolocation is not supported by your browser.',
      }));
      return;
    }

    setLocationState((prev) => ({
      ...prev,
      loadingStatus: true,
      errorStatus: null,
    }));

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const geoResult = await reverseGeocode(latitude, longitude);

          if (!isMountedRef.current) return;

          const newLocation = {
            latitude,
            longitude,
            city: geoResult.city,
            district: geoResult.district,
            state: geoResult.state,
            country: geoResult.country,
            pincode: geoResult.pincode || null,
            fullAddress: geoResult.fullAddress || null,
            formattedName: geoResult.formattedName,
            source: 'gps',
            permissionStatus: 'granted',
            loadingStatus: false,
            errorStatus: null,
            lastSuccessfulLocation: {
              latitude,
              longitude,
              city: geoResult.city,
              district: geoResult.district,
              state: geoResult.state,
              country: geoResult.country,
              pincode: geoResult.pincode || null,
              fullAddress: geoResult.fullAddress || null,
              formattedName: geoResult.formattedName,
            },
            isStale: false,
          };

          setLocationState(newLocation);
        } catch (revErr) {
          if (!isMountedRef.current) return;
          // Retain coordinates even if geocoding fails
          const coordsName = `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`;
          setLocationState({
            latitude,
            longitude,
            city: null,
            district: null,
            state: null,
            country: null,
            pincode: null,
            fullAddress: null,
            formattedName: coordsName,
            source: 'gps',
            permissionStatus: 'granted',
            loadingStatus: false,
            errorStatus: null,
            lastSuccessfulLocation: {
              latitude,
              longitude,
              city: null,
              district: null,
              state: null,
              country: null,
              pincode: null,
              fullAddress: null,
              formattedName: coordsName,
            },
            isStale: false,
          });
        }
      },
      (error) => {
        if (!isMountedRef.current) return;

        let errorMsg = 'Unable to determine your GPS location.';
        let permStatus = 'unavailable';

        if (error.code === 1) {
          // PERMISSION_DENIED
          permStatus = 'denied';
          errorMsg =
            'Location permission was denied. Please allow location access in your browser settings (click the lock or site settings icon in your address bar) and click Retry Location.';
        } else if (error.code === 2) {
          // POSITION_UNAVAILABLE
          permStatus = 'unavailable';
          errorMsg = 'GPS signal unavailable. Please ensure your device location is enabled.';
        } else if (error.code === 3) {
          // TIMEOUT
          permStatus = 'unavailable';
          errorMsg = 'GPS request timed out. Please click Retry Location.';
        }

        setLocationState((prev) => {
          // If we had a last successful location, preserve it as stale
          if (prev.lastSuccessfulLocation) {
            return {
              ...prev,
              ...prev.lastSuccessfulLocation,
              permissionStatus: permStatus,
              loadingStatus: false,
              errorStatus: errorMsg,
              isStale: true,
            };
          }

          // Do NOT substitute a fake city
          return {
            ...prev,
            latitude: null,
            longitude: null,
            city: null,
            district: null,
            state: null,
            country: null,
            formattedName: 'Location Denied',
            permissionStatus: permStatus,
            loadingStatus: false,
            errorStatus: errorMsg,
            isStale: false,
          };
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, []);

  // Action: Set a manual location (searched or preset)
  const setManualLocation = useCallback((loc) => {
    if (!loc) return;

    setLocationState({
      latitude: loc.latitude,
      longitude: loc.longitude,
      city: loc.city || null,
      district: loc.district || null,
      state: loc.state || null,
      country: loc.country || 'India',
      pincode: loc.pincode || null,
      fullAddress: loc.fullAddress || loc.displayName || null,
      formattedName: loc.formattedName || loc.name || 'Selected Location',
      source: 'manual',
      permissionStatus: 'prompt',
      loadingStatus: false,
      errorStatus: null,
      lastSuccessfulLocation: {
        latitude: loc.latitude,
        longitude: loc.longitude,
        city: loc.city || null,
        district: loc.district || null,
        state: loc.state || null,
        country: loc.country || 'India',
        pincode: loc.pincode || null,
        fullAddress: loc.fullAddress || loc.displayName || null,
        formattedName: loc.formattedName || loc.name || 'Selected Location',
      },
      isStale: false,
    });
  }, []);

  // Action: Switch to Global Mode
  const setGlobalMode = useCallback(() => {
    setLocationState({
      latitude: null,
      longitude: null,
      city: null,
      district: null,
      state: null,
      country: null,
      pincode: null,
      fullAddress: null,
      formattedName: 'Global',
      source: 'global',
      permissionStatus: 'prompt',
      loadingStatus: false,
      errorStatus: null,
      lastSuccessfulLocation: null,
      isStale: false,
    });
  }, []);

  // Action: Refresh current location
  const refreshLocation = useCallback(() => {
    if (locationState.source === 'gps') {
      requestCurrentLocation();
    } else if (locationState.latitude && locationState.longitude) {
      fetchWeather(
        locationState.latitude,
        locationState.longitude,
        locationState.formattedName
      );
    }
  }, [locationState.source, locationState.latitude, locationState.longitude, locationState.formattedName, requestCurrentLocation, fetchWeather]);

  const value = {
    // Location Data
    latitude: locationState.latitude,
    longitude: locationState.longitude,
    coords: locationState.latitude && locationState.longitude ? { lat: locationState.latitude, lng: locationState.longitude } : null,
    city: locationState.city,
    district: locationState.district,
    state: locationState.state,
    country: locationState.country,
    pincode: locationState.pincode,
    fullAddress: locationState.fullAddress,
    formattedName: locationState.formattedName,
    displayName: locationState.formattedName, // Backwards compatibility
    source: locationState.source,
    isGlobal: locationState.source === 'global',
    isGps: locationState.source === 'gps',
    isManual: locationState.source === 'manual',
    isStale: locationState.isStale,
    permissionStatus: locationState.permissionStatus,
    loadingStatus: locationState.loadingStatus,
    errorStatus: locationState.errorStatus,
    lastSuccessfulLocation: locationState.lastSuccessfulLocation,

    // Weather Data
    weatherData,
    isWeatherLoading,
    weatherError,

    // Actions
    requestCurrentLocation,
    retryLocation: requestCurrentLocation,
    setManualLocation,
    setGlobalMode,
    refreshLocation,
    searchLocations: searchPlaces,
    presetRegions: PRESET_REGIONS,
    // Backwards compatibility helpers
    mode: locationState.source,
    status: locationState.permissionStatus === 'denied' ? 'denied' : locationState.loadingStatus ? 'loading' : 'success',
    selectPreset: (presetId) => {
      const preset = PRESET_REGIONS.find((p) => p.id === presetId);
      if (preset) setManualLocation(preset);
      else if (presetId === 'global') setGlobalMode();
    },
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

export const useLocationContext = () => {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error('useLocationContext must be used within LocationProvider');
  }
  return ctx;
};
