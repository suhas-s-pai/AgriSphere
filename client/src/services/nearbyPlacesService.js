import { calculateDistanceKm } from './marketService.js';

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

async function queryOverpass(query) {
  let lastError;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 18000);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: `data=${encodeURIComponent(query)}`,
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`OpenStreetMap search failed (${response.status})`);
      const data = await response.json();
      return data.elements || [];
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError || new Error('Nearby places are temporarily unavailable.');
}

function elementPosition(item) {
  return { lat: item.lat ?? item.center?.lat, lon: item.lon ?? item.center?.lon };
}

export async function findNearbyAgriculturalPlaces(latitude, longitude, radiusKm = 30, kind = 'markets') {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return [];
  const radius = Math.max(1000, Math.min(50000, radiusKm * 1000));
  const selector = kind === 'equipment'
    ? `nwr(around:${radius},${latitude},${longitude})[shop~"^(agrarian|farm|agricultural|garden_centre|garden|hardware|doityourself|seeds|chemical)$"];nwr(around:${radius},${latitude},${longitude})[craft~"^(agricultural_engines|machinery)$"];nwr(around:${radius},${latitude},${longitude})[office~"^(agricultural|company)$"];nwr(around:${radius},${latitude},${longitude})[amenity~"^(marketplace|vehicle_rental)$"];nwr(around:${radius},${latitude},${longitude})[industrial~"^(agricultural|machinery)$"];`
    : `nwr(around:${radius},${latitude},${longitude})[amenity=marketplace];nwr(around:${radius},${latitude},${longitude})[landuse=marketplace];nwr(around:${radius},${latitude},${longitude})[shop~"^(wholesale|farm|agrarian)$"];`;
  let elements = [];
  try {
    elements = await queryOverpass(`[out:json][timeout:20];(${selector});out center tags;`);
  } catch (error) {
    // Keep the curated Bantwal-area fallback available even when Overpass is offline.
    if (kind !== 'equipment') throw error;
  }
  const mapped = elements.map((item) => {
    const pos = elementPosition(item);
    if (!Number.isFinite(pos.lat) || !Number.isFinite(pos.lon)) return null;
    const tags = item.tags || {};
    const name = tags.name || (kind === 'equipment' ? 'Agricultural supplier (name unavailable)' : 'Market place (name unavailable)');
    const distance = calculateDistanceKm(latitude, longitude, pos.lat, pos.lon);
    const address = [tags['addr:street'], tags['addr:suburb'], tags['addr:city'] || tags['addr:town'], tags['addr:postcode']].filter(Boolean).join(', ') || 'Address not listed on OpenStreetMap';
    return {
      id: `osm-${item.type}-${item.id}`,
      name,
      title: name,
      type: kind === 'equipment' ? (tags.shop || tags.craft || 'Agricultural equipment provider') : 'Nearby market place',
      category: kind === 'equipment' ? 'dealers' : 'market',
      color: '#15803D',
      pricingType: 'Contact provider',
      rate: 'Ask provider for rates',
      dealership: 'Details not listed',
      position: [pos.lat, pos.lon],
      distance,
      distanceKm: distance,
      address,
      contact: tags.phone || tags['contact:phone'] || '',
      phone: tags.phone || tags['contact:phone'] || '',
      website: tags.website || tags['contact:website'] || '',
      availableEquipment: [],
      majorCommodities: [],
      hours: tags.opening_hours || 'Hours not listed',
      description: tags.description || 'Place discovered from OpenStreetMap. Confirm services and availability before travelling.',
      source: 'OpenStreetMap',
      osmUrl: `https://www.openstreetmap.org/${item.type}/${item.id}`,
    };
  }).filter(Boolean);

  if (kind !== 'equipment') return mapped.sort((a, b) => a.distance - b.distance);

  // Curated public directory fallback for Bantwal / Panemangalore.
  // Addresses and phone numbers are public listings; exact shop coordinates are not assumed.
  const bantwalCentre = { lat: 12.9014, lon: 75.0368 };
  const fromBantwal = calculateDistanceKm(latitude, longitude, bantwalCentre.lat, bantwalCentre.lon);
  const localDirectory = fromBantwal <= radiusKm + 20 ? [
    {
      id: 'local-gr-kamath',
      title: 'M/s G R Kamath',
      name: 'M/s G R Kamath',
      type: 'Fertilizer & Agri-input Supplier',
      category: 'dealers',
      color: '#15803D',
      address: 'Thyagaraja Road, Bantwal, Karnataka 574211',
      contact: '+91 97398 89933',
      phone: '+91 97398 89933',
      availableEquipment: ['Fertilizers', 'Crop nutrients', 'Agricultural inputs'],
      pricingType: 'Retail / Wholesale',
      rate: 'Contact shop for current prices',
      dealership: 'Agricultural input supplier',
      description: 'Publicly listed fertilizer and agricultural-input supplier. Confirm stock and opening hours before visiting.',
      position: null,
      distanceKm: null,
      distance: null,
      source: 'Public business listing',
      website: '',
    },
    {
      id: 'local-indra-agri',
      title: 'Indra Agri Supplies',
      name: 'Indra Agri Supplies',
      type: 'Fertilizer & Seed Supplier',
      category: 'dealers',
      color: '#15803D',
      address: 'Bantwal Main Road, Panemangalore, Bantwal, Karnataka 574231',
      contact: '+91 94811 41204',
      phone: '+91 94811 41204',
      availableEquipment: ['Fertilizers', 'Seeds', 'Crop protection inputs', 'Farm consumables'],
      pricingType: 'Retail / Wholesale',
      rate: 'Contact shop for current prices',
      dealership: 'Agricultural input supplier',
      description: 'Publicly listed agri-input dealer in Panemangalore. Confirm product availability before travelling.',
      position: null,
      distanceKm: null,
      distance: null,
      source: 'Public business listing',
      website: '',
    },
    {
      id: 'local-svr-agro',
      title: 'SVR Agro Service Centre',
      name: 'SVR Agro Service Centre',
      type: 'Farm Equipment Supplier',
      category: 'dealers',
      color: '#15803D',
      address: 'Sara Arcade, Panemangalore / Melkar, Bantwal, Karnataka 574231',
      contact: '+91 94493 65980',
      phone: '+91 94493 65980',
      availableEquipment: ['Farm equipment', 'Agricultural tools', 'Machinery support'],
      pricingType: 'Sales / Service',
      rate: 'Contact provider for rates',
      dealership: 'Farm equipment supplier',
      description: 'Publicly listed farm-equipment supplier serving the Panemangalore / Melkar area.',
      position: null,
      distanceKm: null,
      distance: null,
      source: 'Public business listing',
      website: '',
    },
    {
      id: 'local-lobo-traders',
      title: 'Lobo Traders',
      name: 'Lobo Traders',
      type: 'Agricultural Machinery & Tools',
      category: 'tools',
      color: '#15803D',
      address: 'Sudhama Complex, near Siddakatte Bus Stop, Sanganabettu, Bantwal, Karnataka 574237',
      contact: '+91 95356 20038',
      phone: '+91 95356 20038',
      availableEquipment: ['Agricultural machinery', 'Horticultural equipment', 'Power tools', 'Service'],
      pricingType: 'Sales / Service',
      rate: 'Contact provider for rates',
      dealership: 'Agricultural machinery supplier',
      description: 'Publicly listed agricultural and horticultural equipment sales and service provider.',
      position: null,
      distanceKm: null,
      distance: null,
      source: 'Public business listing',
      website: '',
    },
    {
      id: 'local-saya-enterprises',
      title: 'Saya Enterprises',
      name: 'Saya Enterprises',
      type: 'Farm Equipment Dealer',
      category: 'dealers',
      color: '#15803D',
      address: 'Bantwal Bypass Road, Amtady, Bantwal, Karnataka 574211',
      contact: '+91 99014 97852',
      phone: '+91 99014 97852',
      availableEquipment: ['Paddy equipment', 'Agricultural machinery parts', 'Farm implements'],
      pricingType: 'Sales / Service',
      rate: 'Contact provider for rates',
      dealership: 'Agricultural equipment outlet',
      description: 'Publicly listed farm-equipment sales and service outlet near Bantwal Bypass.',
      position: null,
      distanceKm: null,
      distance: null,
      source: 'Public business listing',
      website: '',
    },
    {
      id: 'local-pramod-enterprises',
      title: 'Pramod Enterprises',
      name: 'Pramod Enterprises',
      type: 'Irrigation & Hardware Supplier',
      category: 'sprayers',
      color: '#15803D',
      address: 'Near Indian Oil Petrol Pump, Amtady, B.C. Road, Bantwal, Karnataka 574211',
      contact: '+91 94813 92008',
      phone: '+91 94813 92008',
      availableEquipment: ['Water pumps', 'Pipes', 'Irrigation fittings', 'Hardware'],
      pricingType: 'Retail',
      rate: 'Contact shop for current prices',
      dealership: 'Irrigation hardware supplier',
      description: 'Publicly listed hardware and pump supplier; confirm agricultural product availability.',
      position: null,
      distanceKm: null,
      distance: null,
      source: 'Public business listing',
      website: '',
    },
  ] : [];

  const merged = [...mapped, ...localDirectory];
  return merged.filter((item, index, all) =>
    all.findIndex((candidate) => candidate.id === item.id ||
      (candidate.title || candidate.name || '').toLowerCase() === (item.title || item.name || '').toLowerCase()
    ) === index
  ).sort((a, b) => (a.distance ?? 99999) - (b.distance ?? 99999));
}
