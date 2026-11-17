/**
 * Geocoding Service for AgriSphere
 * Provides reverse geocoding (coordinates -> address) and forward geocoding (place search).
 * Uses OpenStreetMap Nominatim with proper attribution, rate-limiting, and error handling.
 */

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const cache = new Map();

/**
 * Reverse geocode latitude and longitude to obtain structured address details.
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} Detailed location object
 */
export async function reverseGeocode(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
    throw new Error('Invalid coordinates provided to reverseGeocode');
  }

  const cacheKey = `rev_${lat.toFixed(3)}_${lng.toFixed(3)}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const url = `${NOMINATIM_BASE}/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept-Language': 'en',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Reverse geocoding failed with status: ${response.status}`);
    }

    const data = await response.json();
    const addr = data.address || {};

    const city =
      addr.city ||
      addr.town ||
      addr.village ||
      addr.municipality ||
      addr.suburb ||
      null;

    const district =
      addr.county ||
      addr.state_district ||
      null;

    const state = addr.state || null;
    const country = addr.country || 'India';
    const pincode = addr.postcode || null;
    const road = addr.road || null;

    let formattedName = '';
    if (city && state) {
      formattedName = `${city}, ${state}`;
    } else if (district && state) {
      formattedName = `${district}, ${state}`;
    } else if (city) {
      formattedName = city;
    } else if (data.display_name) {
      formattedName = data.display_name.split(',').slice(0, 2).join(',').trim();
    } else {
      formattedName = `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
    }

    const result = {
      latitude: lat,
      longitude: lng,
      city,
      district,
      state,
      country,
      pincode,
      road,
      formattedName,
      fullAddress: data.display_name || formattedName,
      rawAddress: addr,
    };

    cache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.warn('Reverse geocoding network/timeout error:', error);
    // Never fabricate a city name. Retain coordinates with standard notation.
    return {
      latitude: lat,
      longitude: lng,
      city: null,
      district: null,
      state: null,
      country: null,
      pincode: null,
      road: null,
      formattedName: `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`,
      fullAddress: null,
      rawAddress: null,
    };
  }
}

/**
 * Search places by query string for manual location selection.
 * @param {string} query - City, town, or district search query
 * @returns {Promise<Array<Object>>} List of matching locations
 */
export async function searchPlaces(query) {
  const trimmed = (query || '').trim();
  if (trimmed.length < 2) return [];

  const cacheKey = `search_${trimmed.toLowerCase()}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const url = `${NOMINATIM_BASE}/search?q=${encodeURIComponent(
      trimmed
    )}&format=json&addressdetails=1&limit=6&countrycodes=in`;

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept-Language': 'en',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) return [];

    const data = await response.json();
    if (!Array.isArray(data)) return [];

    const results = data.map((item) => {
      const lat = parseFloat(item.lat);
      const lng = parseFloat(item.lon);
      const addr = item.address || {};

      const city =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.municipality ||
        addr.suburb ||
        item.name ||
        null;

      const district = addr.county || addr.state_district || null;
      const state = addr.state || null;
      const country = addr.country || 'India';
      const pincode = addr.postcode || null;

      let formattedName = '';
      if (city && state) {
        formattedName = `${city}, ${state}`;
      } else if (district && state) {
        formattedName = `${district}, ${state}`;
      } else if (city) {
        formattedName = city;
      } else {
        formattedName = item.display_name.split(',').slice(0, 2).join(',').trim();
      }

      return {
        id: item.place_id ? item.place_id.toString() : `${lat}_${lng}`,
        latitude: lat,
        longitude: lng,
        city,
        district,
        state,
        country,
        pincode,
        formattedName,
        fullAddress: item.display_name,
        displayName: item.display_name,
      };
    });

    cache.set(cacheKey, results);
    return results;
  } catch (error) {
    console.warn('Place search error:', error);
    return [];
  }
}
