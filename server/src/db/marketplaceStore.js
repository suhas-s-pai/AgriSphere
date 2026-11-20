import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { supabase, isConfigured } from '../config/supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const STORE_PATH = path.join(DATA_DIR, 'marketplace_store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Haversine distance calculator for server
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Initial default state seeded with real verified Karnataka shops, categories, and verified products
const getInitialState = () => ({
  users: [
    {
      id: 'admin-seed-uuid',
      full_name: 'AgriSphere Administrator',
      email: 'admin@agrisphere.org',
      mobile_number: '+91 831 245 0000',
      password_hash: '$2b$10$EiYBZV8H/8fJSiimgcwt/efmXOZSOy9F.mWRsmZ97.OuKEbA1Vllu',
      role: 'admin',
      district: 'Belagavi',
      state: 'Karnataka',
      created_at: new Date().toISOString(),
    },
    {
      id: 'farmer-patil-seed-id',
      full_name: 'Basavaraj Patil',
      email: 'patil@farm.karnataka.in',
      mobile_number: '+91 98455 33102',
      password_hash: '$2b$10$EiYBZV8H/8fJSiimgcwt/efmXOZSOy9F.mWRsmZ97.OuKEbA1Vllu',
      role: 'farmer',
      district: 'Belagavi',
      state: 'Karnataka',
      pincode: '591102',
      created_at: new Date().toISOString(),
    },
    {
      id: 'shop-kssc-user-id',
      full_name: 'KSSC Depot Manager',
      email: 'belagavi@kssc.karnataka.gov.in',
      mobile_number: '+91 831 245 8820',
      password_hash: '$2b$10$EiYBZV8H/8fJSiimgcwt/efmXOZSOy9F.mWRsmZ97.OuKEbA1Vllu',
      role: 'shop',
      district: 'Belagavi',
      state: 'Karnataka',
      pincode: '590016',
      created_at: new Date().toISOString(),
    },
  ],
  seller_profiles: [
    {
      id: 'seller-patil-id',
      user_id: 'farmer-patil-seed-id',
      seller_type: 'farmer',
      business_name: 'Patil Organic Farms & Produce Hub',
      contact_number: '+91 98455 33102',
      email: 'patil@farm.karnataka.in',
      address: 'Bailhongal Road, Near Toll Plaza',
      village: 'Bailhongal',
      taluk: 'Bailhongal',
      district: 'Belagavi',
      state: 'Karnataka',
      pincode: '591102',
      latitude: 15.8320,
      longitude: 74.5240,
      gstin: null,
      verification_status: 'approved',
      verification_notes: 'Verified landholding via Karnataka Bhoomi RTC Pahani survey 84.',
      is_verified_badge: true,
      bank_account_number: 'XXXXXX5012',
      bank_ifsc: 'SBIN0001234',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'seller-kssc-id',
      user_id: 'shop-kssc-user-id',
      seller_type: 'shop',
      business_name: 'KSSC Certified State Seed Depot',
      contact_number: '+91 831 245 8820',
      email: 'belagavi@kssc.karnataka.gov.in',
      address: 'Gate 2, APMC Market Yard, Belagavi',
      village: 'Belagavi APMC',
      taluk: 'Belagavi',
      district: 'Belagavi',
      state: 'Karnataka',
      pincode: '590016',
      latitude: 15.8595,
      longitude: 74.5075,
      gstin: '29AAACK1234F1Z1',
      verification_status: 'approved',
      verification_notes: 'Official Karnataka State Seed Corporation institutional depot.',
      is_verified_badge: true,
      bank_account_number: 'XXXXXX9800',
      bank_ifsc: 'CNRB0002400',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  seller_verification_documents: [
    {
      id: 'doc-patil-1',
      seller_id: 'seller-patil-id',
      document_type: 'rtc_pahani',
      document_url: 'https://bhoomi.karnataka.gov.in/rtc/bailhongal/84',
      document_name: 'RTC Pahani Survey 84 Bailhongal',
      status: 'verified',
      created_at: new Date().toISOString(),
    },
  ],
  marketplace_categories: [
    { id: 'cat-seeds', slug: 'seeds', name: 'Seeds', description: 'Certified high-germination foundation seeds', icon_name: 'Sprout', display_order: 1, is_active: true },
    { id: 'cat-fertilizers', slug: 'fertilizers', name: 'Fertilizers', description: 'Chemical and mineral macro-nutrients (NPK, Urea, DAP)', icon_name: 'Layers', display_order: 2, is_active: true },
    { id: 'cat-organic-fert', slug: 'organic_fertilizers', name: 'Organic Fertilizers', description: 'Lab-tested vermicompost, cow dung manure, compost', icon_name: 'Leaf', display_order: 3, is_active: true },
    { id: 'cat-bio-fert', slug: 'bio_fertilizers', name: 'Bio-Fertilizers', description: 'Microbial cultures (Trichoderma, Rhizobium, PSB)', icon_name: 'FlaskConical', display_order: 4, is_active: true },
    { id: 'cat-pesticides', slug: 'pesticides_crop_protection', name: 'Pesticides and Crop Protection', description: 'Approved biological, neem, and chemical plant protectors', icon_name: 'ShieldCheck', display_order: 5, is_active: true },
    { id: 'cat-machinery', slug: 'agricultural_machinery', name: 'Agricultural Machinery', description: 'Tractors, power tillers, rotavators, and diesel engines', icon_name: 'Tractor', display_order: 6, is_active: true },
    { id: 'cat-irrigation', slug: 'irrigation_equipment', name: 'Irrigation Equipment', description: 'Drip laterals, micro-sprinklers, filters, and pump units', icon_name: 'Droplets', display_order: 7, is_active: true },
    { id: 'cat-tools', slug: 'farming_tools', name: 'Farming Tools', description: 'Knapsack battery sprayers, tarpaulins, mulching film, shears', icon_name: 'Wrench', display_order: 8, is_active: true },
    { id: 'cat-animal', slug: 'animal_husbandry', name: 'Animal Husbandry Supplies', description: 'Cattle feed, mineral mixtures, fodder seeds, and silage', icon_name: 'HeartHandshake', display_order: 9, is_active: true },
    { id: 'cat-produce', slug: 'harvested_produce', name: 'Harvested Crops and Farm Produce', description: 'Direct farm-gate harvest lots: grains, pulses, fruits, and vegetables', icon_name: 'Package', display_order: 10, is_active: true },
  ],
  marketplace_products: [
    {
      id: 'prod-sona-masoori',
      seller_id: 'seller-kssc-id',
      category_id: 'cat-seeds',
      title: 'Certified Sona Masoori Paddy Seeds (CS-1 Foundation)',
      description: 'Government certified high-germination (98%) foundation seeds with official germination certificate. Resistant to blast disease with uniform crop stand.',
      price: 1450,
      unit: 'bag (25 kg)',
      min_order_quantity: 1,
      status: 'active',
      location_district: 'Belagavi',
      location_state: 'Karnataka',
      latitude: 15.8595,
      longitude: 74.5075,
      contact_number: '+91 831 245 8820',
      is_harvested_produce: false,
      crop_name: 'Paddy / Rice',
      variety: 'Sona Masoori (BPT 5204)',
      quality_grade: 'Foundation Seed Class 1',
      harvest_date: null,
      moisture_percentage: 12.0,
      wholesale_price: 1380,
      retail_price: 1450,
      image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prod-vermicompost-bio',
      seller_id: 'seller-patil-id',
      category_id: 'cat-organic-fert',
      title: 'Enriched Organic Vermicompost (Cow Dung & Trichoderma)',
      description: 'Fully matured cow dung vermicompost enriched with Trichoderma Viride and PSB (Phosphate Solubilizing Bio-culture). Increases water holding capacity and soil carbon.',
      price: 350,
      unit: 'bag (50 kg)',
      min_order_quantity: 2,
      status: 'active',
      location_district: 'Belagavi',
      location_state: 'Karnataka',
      latitude: 15.8320,
      longitude: 74.5240,
      contact_number: '+91 98455 33102',
      is_harvested_produce: false,
      crop_name: null,
      variety: null,
      quality_grade: 'Lab-Tested 1.8% Organic Carbon',
      harvest_date: null,
      moisture_percentage: 18.0,
      wholesale_price: 310,
      retail_price: 350,
      image_url: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=600&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prod-maize-harvest',
      seller_id: 'seller-patil-id',
      category_id: 'cat-produce',
      title: 'Fresh Harvested Hybrid Maize (Grade A Cleaned Grain)',
      description: 'Sun-dried golden maize harvest from Bailhongal black cotton soil. Moisture strictly tested below 13.5%. Cleaned and packaged in 50kg gunny bags for immediate wholesale/retail dispatch.',
      price: 2250,
      unit: 'quintal',
      min_order_quantity: 5,
      status: 'active',
      location_district: 'Belagavi',
      location_state: 'Karnataka',
      latitude: 15.8320,
      longitude: 74.5240,
      contact_number: '+91 98455 33102',
      is_harvested_produce: true,
      crop_name: 'Maize',
      variety: 'Pioneer 900M Gold',
      quality_grade: 'Grade A Export Quality',
      harvest_date: '2026-11-05',
      moisture_percentage: 13.2,
      wholesale_price: 2180,
      retail_price: 2250,
      image_url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prod-battery-sprayer',
      seller_id: 'seller-kssc-id',
      category_id: 'cat-tools',
      title: '16-Liter 12V Battery Powered Knapsack Sprayer',
      description: 'Dual-speed heavy duty knapsack battery sprayer with stainless steel extendable lance, 4 brass nozzle set, high-pressure diaphragm pump, and 6-hour continuous battery charge.',
      price: 2650,
      unit: 'piece',
      min_order_quantity: 1,
      status: 'active',
      location_district: 'Belagavi',
      location_state: 'Karnataka',
      latitude: 15.8595,
      longitude: 74.5075,
      contact_number: '+91 831 245 8820',
      is_harvested_produce: false,
      crop_name: null,
      variety: null,
      quality_grade: 'Heavy Duty 12V 12Ah',
      harvest_date: null,
      moisture_percentage: null,
      wholesale_price: 2450,
      retail_price: 2650,
      image_url: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prod-neem-oil-bio',
      seller_id: 'seller-patil-id',
      category_id: 'cat-pesticides',
      title: 'Cold-Pressed Pure Neem Oil (1500 PPM Azadirachtin)',
      description: '100% water-soluble biological crop protector for controlling sucking pests (whiteflies, thrips, aphids) and preventing leaf miner larvae without chemical residue.',
      price: 420,
      unit: 'litre',
      min_order_quantity: 1,
      status: 'active',
      location_district: 'Belagavi',
      location_state: 'Karnataka',
      latitude: 15.8320,
      longitude: 74.5240,
      contact_number: '+91 98455 33102',
      is_harvested_produce: false,
      crop_name: null,
      variety: null,
      quality_grade: '1500 PPM Certified Botanical',
      harvest_date: null,
      moisture_percentage: null,
      wholesale_price: 380,
      retail_price: 420,
      image_url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prod-tomato-harvest',
      seller_id: 'seller-patil-id',
      category_id: 'cat-produce',
      title: 'Fresh Farm-Harvested Hybrid Tomatoes (Crate Lots)',
      description: 'Firm, ripe, field-fresh tomatoes harvested early morning from drip-irrigated plots. Sorted, washed, and packed into standardized 25kg plastic transport crates.',
      price: 625,
      unit: 'crate (25 kg)',
      min_order_quantity: 2,
      status: 'active',
      location_district: 'Belagavi',
      location_state: 'Karnataka',
      latitude: 15.8320,
      longitude: 74.5240,
      contact_number: '+91 98455 33102',
      is_harvested_produce: true,
      crop_name: 'Tomato',
      variety: 'Abhinav Hybrid (Syngenta)',
      quality_grade: 'Grade A Farm Fresh',
      harvest_date: '2026-11-06',
      moisture_percentage: null,
      wholesale_price: 580,
      retail_price: 625,
      image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  product_images: [],
  inventory: [
    { id: 'inv-1', product_id: 'prod-sona-masoori', stock_quantity: 45, low_stock_threshold: 10, reserved_quantity: 0, last_restocked_at: new Date().toISOString() },
    { id: 'inv-2', product_id: 'prod-vermicompost-bio', stock_quantity: 120, low_stock_threshold: 20, reserved_quantity: 0, last_restocked_at: new Date().toISOString() },
    { id: 'inv-3', product_id: 'prod-maize-harvest', stock_quantity: 80, low_stock_threshold: 15, reserved_quantity: 0, last_restocked_at: new Date().toISOString() },
    { id: 'inv-4', product_id: 'prod-battery-sprayer', stock_quantity: 18, low_stock_threshold: 5, reserved_quantity: 0, last_restocked_at: new Date().toISOString() },
    { id: 'inv-5', product_id: 'prod-neem-oil-bio', stock_quantity: 65, low_stock_threshold: 10, reserved_quantity: 0, last_restocked_at: new Date().toISOString() },
    { id: 'inv-6', product_id: 'prod-tomato-harvest', stock_quantity: 90, low_stock_threshold: 15, reserved_quantity: 0, last_restocked_at: new Date().toISOString() },
  ],
  cart_items: [],
  delivery_addresses: [],
  marketplace_orders: [],
  marketplace_order_items: [],
  marketplace_payments: [],
  marketplace_reviews: [
    {
      id: 'rev-1',
      product_id: 'prod-sona-masoori',
      buyer_id: 'admin-seed-uuid',
      order_id: 'order-demo-completed',
      rating: 5,
      comment: 'Excellent germination rate of 98%. Clean seed bags with official KSSC certification tag.',
      is_reported: false,
      is_moderated: false,
      created_at: '2026-11-06T10:00:00.000Z',
    },
    {
      id: 'rev-2',
      product_id: 'prod-vermicompost-bio',
      buyer_id: 'admin-seed-uuid',
      order_id: 'order-demo-completed',
      rating: 5,
      comment: 'Very high quality compost, noticeable difference in vegetable root vigor within 10 days.',
      is_reported: false,
      is_moderated: false,
      created_at: '2026-11-07T12:00:00.000Z',
    },
  ],
  marketplace_shops: [
    {
      id: 'shop-kssc-belagavi',
      name: 'KSSC Certified Seed Depot (Belagavi)',
      category: 'Seeds',
      shop_type: 'Certified State Seed Depot',
      address: 'Gate 2, APMC Market Yard, Belagavi 590016',
      district: 'Belagavi',
      state: 'Karnataka',
      pincode: '590016',
      contact: '+91 831 245 8820',
      operating_hours: 'Mon - Sat: 08:30 AM - 05:00 PM',
      latitude: 15.8595,
      longitude: 74.5075,
      is_verified: true,
      verification_source: 'Karnataka State Seed Corporation Official Directory',
      inventory_summary: ['Certified Sona Masoori Paddy Seeds (CS-1)', 'Hybrid Maize 900M', 'TMV-2 Groundnut Seeds', 'Vegetable Seeds'],
    },
    {
      id: 'shop-krishi-rasayan',
      name: 'District Krishi Rasayan & Fertilizers',
      category: 'Fertilizers',
      shop_type: 'Licensed Fertilizer Retailer',
      address: 'Near Old Post Office, Khade Bazar, Belagavi 590001',
      district: 'Belagavi',
      state: 'Karnataka',
      pincode: '590001',
      contact: '+91 831 242 7710',
      operating_hours: 'Mon - Sat: 08:00 AM - 07:00 PM',
      latitude: 15.8542,
      longitude: 74.4982,
      is_verified: true,
      verification_source: 'Department of Agriculture Karnataka License #AGR-KA-BEL-1044',
      inventory_summary: ['Neem Coated Urea (46% N)', 'DAP 18:46:0', 'MOP (Potash)', 'Mancozeb Fungicide', 'Micronutrient Mixtures'],
    },
    {
      id: 'shop-green-earth',
      name: 'Green Earth Bio-Inputs & Vermicompost Hub',
      category: 'Bio-Fertilizers',
      shop_type: 'Farmer Cooperative Bio-Depot',
      address: 'Survey No. 88, Sambra Road, Belagavi Rural 591124',
      district: 'Belagavi',
      state: 'Karnataka',
      pincode: '591124',
      contact: '+91 94482 10934',
      operating_hours: 'Mon - Sat: 07:00 AM - 06:00 PM',
      latitude: 15.8672,
      longitude: 74.5310,
      is_verified: true,
      verification_source: 'KVK Organic Cluster Verification #KA-ORG-2025-091',
      inventory_summary: ['Enriched Vermicompost (50kg bags)', 'Trichoderma Viride', 'PSB Bio-Culture', 'Jeevamrutha Preparation Kits'],
    },
    {
      id: 'shop-kisan-hardware',
      name: 'Kisan Agro Supplies & Irrigation Hardware',
      category: 'Equipment',
      shop_type: 'Agricultural Supply & Irrigation Store',
      address: 'Shop 14, Raviwar Peth, Belagavi 590002',
      district: 'Belagavi',
      state: 'Karnataka',
      pincode: '590002',
      contact: '+91 831 242 1904',
      operating_hours: 'Mon - Sat: 08:30 AM - 07:30 PM',
      latitude: 15.8510,
      longitude: 74.5020,
      is_verified: true,
      verification_source: 'Karnataka Horticultural Federation Authorized Vendor #HORT-IRR-348',
      inventory_summary: ['16L Battery Knapsack Sprayers', 'Drip Lateral Pipes 16mm', 'HDPE Tarpaulins (250 GSM)', 'UV-Stabilized Mulching Film'],
    },
    {
      id: 'shop-gokak-organic',
      name: 'Gokak Valley Organic Seeds & Neem Depot',
      category: 'Pesticides',
      shop_type: 'Botanical Crop Protection Center',
      address: 'APMC Complex, Station Road, Gokak 591307',
      district: 'Belagavi',
      state: 'Karnataka',
      pincode: '591307',
      contact: '+91 8332 227 410',
      operating_hours: 'Mon - Sat: 08:00 AM - 06:30 PM',
      latitude: 16.1702,
      longitude: 74.8305,
      is_verified: true,
      verification_source: 'CIBRC Registered Bio-Pesticide Stockist',
      inventory_summary: ['Cold-Pressed Neem Oil (1500 PPM)', 'Native Vegetable Seeds', 'Copper Oxychloride', 'Yellow & Blue Sticky Traps'],
    },
    {
      id: 'shop-apmc-belagavi',
      name: 'Belagavi Main APMC Yard (KSAMB)',
      category: 'APMC',
      shop_type: 'Regulated Agricultural Wholesale Yard',
      address: 'APMC Road, Opposite Railway Overbridge, Belagavi 590016',
      district: 'Belagavi',
      state: 'Karnataka',
      pincode: '590016',
      contact: '+91 831 245 1102',
      operating_hours: 'Mon - Sat: 06:00 AM - 04:00 PM',
      latitude: 15.8583,
      longitude: 74.5062,
      is_verified: true,
      verification_source: 'Karnataka State Agricultural Marketing Board (KSAMB) / e-NAM Mandi Yard',
      inventory_summary: ['Electronic Auction Floors', 'MSP Procurement Counters', 'Cold Storage Facilities', 'Soil & Moisture Testing Counter'],
    },
    {
      id: 'shop-apmc-dharwad',
      name: 'Dharwad APMC Sub-Yard (Amargol Complex)',
      category: 'APMC',
      shop_type: 'Regulated Commodity Trading Terminal',
      address: 'Amargol APMC Complex, PB Road, Hubballi-Dharwad 580025',
      district: 'Dharwad',
      state: 'Karnataka',
      pincode: '580025',
      contact: '+91 836 222 3400',
      operating_hours: 'Mon - Sat: 06:00 AM - 05:00 PM',
      latitude: 15.4124,
      longitude: 75.0512,
      is_verified: true,
      verification_source: 'KSAMB Regulated Mandi #KA-DHW-01',
      inventory_summary: ['Byadagi Chilli Auctioning Shed', 'Grain Silos', 'Electronic Weighbridge', 'e-NAM Spot Trading Terminal'],
    },
    {
      id: 'shop-apmc-bengaluru',
      name: 'Bengaluru Yeshwanthpur APMC Yard',
      category: 'APMC',
      shop_type: 'Apex Terminal Agricultural Market',
      address: 'APMC Yard, Yeshwanthpur, Bengaluru 560022',
      district: 'Bengaluru Urban',
      state: 'Karnataka',
      pincode: '560022',
      contact: '+91 80 2337 1800',
      operating_hours: 'Mon - Sun: 04:00 AM - 02:00 PM',
      latitude: 13.0234,
      longitude: 77.5512,
      is_verified: true,
      verification_source: 'KSAMB Apex Terminal Yard / National Benchmark',
      inventory_summary: ['Wholesale Vegetable Lots', 'Grain Trading Bourse', 'Direct Farmer-Trader Wholesale Auction'],
    },
  ],
});

class MarketplaceStore {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, 'utf8');
        const parsed = JSON.parse(raw);
        // Ensure default seeded products exist if empty
        if (!parsed.marketplace_products || parsed.marketplace_products.length === 0) {
          const initial = getInitialState();
          parsed.marketplace_products = initial.marketplace_products;
          parsed.inventory = initial.inventory;
          parsed.marketplace_reviews = initial.marketplace_reviews;
          this.persist(parsed);
        } else {
          // Deduplicate products on load to prevent any persisted duplicate records
          const seenIds = new Set();
          const seenKeys = new Set();
          parsed.marketplace_products = parsed.marketplace_products.filter((p) => {
            if (!p || !p.id || seenIds.has(p.id)) return false;
            seenIds.add(p.id);
            const key = `${(p.title || '').trim().toLowerCase()}__${(p.seller_id || '').trim().toLowerCase()}`;
            if (seenKeys.has(key)) return false;
            seenKeys.add(key);
            return true;
          });
        }
        return parsed;
      }
    } catch (e) {
      console.warn('⚠️ Error reading store from disk, initializing fresh:', e.message);
    }
    const initial = getInitialState();
    this.persist(initial);
    return initial;
  }

  persist(dataToSave) {
    try {
      fs.writeFileSync(STORE_PATH, JSON.stringify(dataToSave || this.data, null, 2), 'utf8');
    } catch (e) {
      console.error('❌ Failed to persist marketplace store:', e.message);
    }
  }

  // --- Users & Profiles ---
  findUserByEmailOrPhone(identifier) {
    if (!identifier) return null;
    const clean = identifier.trim().toLowerCase();
    return this.data.users.find(
      (u) => (u.email && u.email.toLowerCase() === clean) || (u.mobile_number && u.mobile_number === identifier.trim())
    ) || null;
  }

  findUserById(id) {
    return this.data.users.find((u) => u.id === id) || null;
  }

  createUser(userData) {
    const id = userData.id || crypto.randomUUID();
    const newUser = {
      id,
      full_name: userData.full_name,
      email: userData.email ? userData.email.toLowerCase().trim() : null,
      mobile_number: userData.mobile_number ? userData.mobile_number.trim() : null,
      password_hash: userData.password_hash,
      role: userData.role || 'buyer',
      district: userData.district || 'Belagavi',
      state: userData.state || 'Karnataka',
      pincode: userData.pincode || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.persist();
    return newUser;
  }

  // --- Seller Profiles ---
  findSellerProfileByUserId(userId) {
    return this.data.seller_profiles.find((s) => s.user_id === userId) || null;
  }

  findSellerProfileById(id) {
    return this.data.seller_profiles.find((s) => s.id === id) || null;
  }

  createSellerProfile(profileData) {
    const id = crypto.randomUUID();
    const newProfile = {
      id,
      user_id: profileData.user_id,
      seller_type: profileData.seller_type || 'farmer',
      business_name: profileData.business_name,
      contact_number: profileData.contact_number,
      email: profileData.email || null,
      address: profileData.address,
      village: profileData.village || null,
      taluk: profileData.taluk || null,
      district: profileData.district,
      state: profileData.state || 'Karnataka',
      pincode: profileData.pincode,
      latitude: profileData.latitude ? Number(profileData.latitude) : null,
      longitude: profileData.longitude ? Number(profileData.longitude) : null,
      gstin: profileData.gstin || null,
      verification_status: profileData.verification_status || 'pending',
      verification_notes: profileData.verification_notes || null,
      is_verified_badge: profileData.is_verified_badge || false,
      bank_account_number: profileData.bank_account_number || null,
      bank_ifsc: profileData.bank_ifsc || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.seller_profiles.push(newProfile);
    this.persist();
    return newProfile;
  }

  updateSellerProfile(sellerId, updates) {
    const idx = this.data.seller_profiles.findIndex((s) => s.id === sellerId);
    if (idx === -1) return null;
    this.data.seller_profiles[idx] = {
      ...this.data.seller_profiles[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.persist();
    return this.data.seller_profiles[idx];
  }

  listSellers({ status, district } = {}) {
    return this.data.seller_profiles.filter((s) => {
      const matchStatus = !status || s.verification_status === status;
      const matchDistrict = !district || s.district.toLowerCase() === district.toLowerCase();
      return matchStatus && matchDistrict;
    });
  }

  // --- Verification Documents ---
  addVerificationDocument(docData) {
    const id = crypto.randomUUID();
    const newDoc = {
      id,
      seller_id: docData.seller_id,
      document_type: docData.document_type,
      document_url: docData.document_url,
      document_name: docData.document_name,
      status: docData.status || 'submitted',
      created_at: new Date().toISOString(),
    };
    this.data.seller_verification_documents.push(newDoc);
    this.persist();
    return newDoc;
  }

  getVerificationDocuments(sellerId) {
    return this.data.seller_verification_documents.filter((d) => d.seller_id === sellerId);
  }

  // --- Categories ---
  listCategories() {
    return [...this.data.marketplace_categories].sort((a, b) => a.display_order - b.display_order);
  }

  findCategoryByIdOrSlug(idOrSlug) {
    return this.data.marketplace_categories.find(
      (c) => c.id === idOrSlug || c.slug === idOrSlug || c.name.toLowerCase() === idOrSlug.toLowerCase()
    ) || null;
  }

  // --- Products & Inventory ---
  listProducts({
    category,
    district,
    search,
    minPrice,
    maxPrice,
    inStockOnly,
    isHarvestedProduce,
    userLat,
    userLng,
    maxDistanceKm,
    sort = 'newest',
    sellerId,
  } = {}) {
    let results = this.data.marketplace_products.map((p) => {
      const seller = this.findSellerProfileById(p.seller_id) || {};
      const cat = this.data.marketplace_categories.find((c) => c.id === p.category_id) || {};
      const inv = this.data.inventory.find((i) => i.product_id === p.id) || { stock_quantity: 0, reserved_quantity: 0 };
      const images = this.data.product_images.filter((img) => img.product_id === p.id);
      
      const pLat = p.latitude ?? seller.latitude;
      const pLng = p.longitude ?? seller.longitude;
      const distanceKm = (userLat != null && userLng != null && pLat != null && pLng != null)
        ? calculateDistanceKm(userLat, userLng, pLat, pLng)
        : null;

      const productReviews = this.data.marketplace_reviews.filter((r) => r.product_id === p.id && !r.is_moderated);
      const ratingAvg = productReviews.length > 0
        ? Math.round((productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length) * 10) / 10
        : 5.0;

      return {
        ...p,
        category_name: cat.name || 'General',
        category_slug: cat.slug || '',
        seller_name: seller.business_name || 'Verified Seller',
        seller_type: seller.seller_type || 'farmer',
        is_verified_seller: seller.is_verified_badge || false,
        seller_district: seller.district || p.location_district,
        stock_quantity: inv.stock_quantity,
        available_quantity: Math.max(0, inv.stock_quantity - inv.reserved_quantity),
        low_stock_threshold: inv.low_stock_threshold,
        is_low_stock: inv.stock_quantity <= inv.low_stock_threshold && inv.stock_quantity > 0,
        images: images.length > 0 ? images.map((i) => i.image_url) : [p.image_url].filter(Boolean),
        distanceKm,
        reviews_count: productReviews.length,
        rating_avg: ratingAvg,
      };
    });

    // Filtering
    if (sellerId) {
      results = results.filter((p) => p.seller_id === sellerId);
    }

    if (category && category !== 'All') {
      const cleanCat = category.toLowerCase();
      results = results.filter(
        (p) => p.category_name.toLowerCase() === cleanCat || p.category_slug.toLowerCase() === cleanCat
      );
    }

    if (district) {
      results = results.filter((p) => p.location_district.toLowerCase() === district.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.seller_name.toLowerCase().includes(q) ||
          (p.crop_name && p.crop_name.toLowerCase().includes(q)) ||
          (p.variety && p.variety.toLowerCase().includes(q))
      );
    }

    if (minPrice != null && !isNaN(minPrice)) {
      results = results.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice != null && !isNaN(maxPrice)) {
      results = results.filter((p) => p.price <= Number(maxPrice));
    }

    if (inStockOnly) {
      results = results.filter((p) => p.available_quantity > 0 && p.status === 'active');
    }

    if (isHarvestedProduce != null) {
      results = results.filter((p) => Boolean(p.is_harvested_produce) === Boolean(isHarvestedProduce));
    }

    if (maxDistanceKm != null && !isNaN(maxDistanceKm)) {
      results = results.filter((p) => p.distanceKm != null && p.distanceKm <= Number(maxDistanceKm));
    }

    // Deduplicate results by unique product ID and normalized (title + seller) to ensure no duplicate listings are ever returned
    const seenProductIds = new Set();
    const seenProductKeys = new Set();
    const uniqueResults = [];
    for (const item of results) {
      if (!item || !item.id || seenProductIds.has(item.id)) continue;
      seenProductIds.add(item.id);

      const titleKey = `${(item.title || '').trim().toLowerCase()}__${(item.seller_id || item.seller_name || '').trim().toLowerCase()}`;
      if (seenProductKeys.has(titleKey)) continue;
      seenProductKeys.add(titleKey);

      uniqueResults.push(item);
    }
    results = uniqueResults;

    // Sorting
    if (sort === 'price_asc') {
      results.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      results.sort((a, b) => b.price - a.price);
    } else if (sort === 'distance') {
      results.sort((a, b) => (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999));
    } else if (sort === 'rating') {
      results.sort((a, b) => b.rating_avg - a.rating_avg);
    } else {
      // Newest
      results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return results;
  }

  findProductById(id, { userLat, userLng } = {}) {
    const p = this.data.marketplace_products.find((item) => item.id === id);
    if (!p) return null;

    const seller = this.findSellerProfileById(p.seller_id) || {};
    const cat = this.data.marketplace_categories.find((c) => c.id === p.category_id) || {};
    const inv = this.data.inventory.find((i) => i.product_id === p.id) || { stock_quantity: 0, reserved_quantity: 0 };
    const images = this.data.product_images.filter((img) => img.product_id === p.id);
    
    const pLat = p.latitude ?? seller.latitude;
    const pLng = p.longitude ?? seller.longitude;
    const distanceKm = (userLat != null && userLng != null && pLat != null && pLng != null)
      ? calculateDistanceKm(userLat, userLng, pLat, pLng)
      : null;

    const reviews = this.data.marketplace_reviews
      .filter((r) => r.product_id === p.id && !r.is_moderated)
      .map((r) => {
        const reviewer = this.findUserById(r.buyer_id) || {};
        return {
          ...r,
          reviewer_name: reviewer.full_name || 'Verified Buyer',
        };
      });

    const ratingAvg = reviews.length > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : 5.0;

    return {
      ...p,
      category_name: cat.name || 'General',
      category_slug: cat.slug || '',
      seller_name: seller.business_name || 'Verified Seller',
      seller_type: seller.seller_type || 'farmer',
      is_verified_seller: seller.is_verified_badge || false,
      seller_contact: seller.contact_number || p.contact_number,
      seller_address: seller.address || p.location_district,
      seller_district: seller.district || p.location_district,
      seller_state: seller.state || p.location_state,
      stock_quantity: inv.stock_quantity,
      available_quantity: Math.max(0, inv.stock_quantity - inv.reserved_quantity),
      low_stock_threshold: inv.low_stock_threshold,
      images: images.length > 0 ? images.map((i) => i.image_url) : [p.image_url].filter(Boolean),
      distanceKm,
      reviews,
      reviews_count: reviews.length,
      rating_avg: ratingAvg,
    };
  }

  createProduct(productData, initialStock = 10, imageUrls = []) {
    // Check if an identical product already exists for this seller to prevent accidental duplicate listings
    const existingIndex = this.data.marketplace_products.findIndex((p) => {
      const matchSeller = p.seller_id === productData.seller_id;
      const matchTitle = (p.title || '').trim().toLowerCase() === (productData.title || '').trim().toLowerCase();
      const matchCrop = productData.crop_name && p.crop_name
        ? p.crop_name.trim().toLowerCase() === productData.crop_name.trim().toLowerCase()
        : true;
      return matchSeller && matchTitle && matchCrop;
    });

    if (existingIndex !== -1) {
      const existingProduct = this.data.marketplace_products[existingIndex];
      // Update inventory stock rather than duplicating listing
      const inv = this.data.inventory.find((i) => i.product_id === existingProduct.id);
      if (inv) {
        inv.stock_quantity = Math.max(inv.stock_quantity, Number(initialStock) || inv.stock_quantity);
        inv.last_restocked_at = new Date().toISOString();
      }
      this.persist();
      return existingProduct;
    }

    // Category and crop-appropriate fallback image so non-tomato produce doesn't inherit tomato pictures
    const getFallbackImage = (crop, catId) => {
      const c = (crop || '').toLowerCase();
      if (c.includes('tomato')) return 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80';
      if (c.includes('chilli') || c.includes('chili') || c.includes('mirchi')) return 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80';
      if (c.includes('maize') || c.includes('corn')) return 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80';
      if (c.includes('paddy') || c.includes('rice')) return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80';
      if (catId === 'cat-seeds') return 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80';
      if (catId === 'cat-fertilizers' || catId === 'cat-organic-fert' || catId === 'cat-bio-fert') return 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=600&q=80';
      if (catId === 'cat-machinery' || catId === 'cat-tools') return 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80';
      return 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=600&q=80';
    };

    const resolvedImage = imageUrls[0] || productData.image_url || getFallbackImage(productData.crop_name, productData.category_id);

    const id = `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newProduct = {
      id,
      seller_id: productData.seller_id,
      category_id: productData.category_id,
      title: productData.title,
      description: productData.description,
      price: Number(productData.price),
      unit: productData.unit || 'unit',
      min_order_quantity: Number(productData.min_order_quantity) || 1,
      status: Number(initialStock) > 0 ? 'active' : 'out_of_stock',
      location_district: productData.location_district || 'Belagavi',
      location_state: productData.location_state || 'Karnataka',
      latitude: productData.latitude ? Number(productData.latitude) : null,
      longitude: productData.longitude ? Number(productData.longitude) : null,
      contact_number: productData.contact_number,
      is_harvested_produce: Boolean(productData.is_harvested_produce),
      crop_name: productData.crop_name || null,
      variety: productData.variety || null,
      quality_grade: productData.quality_grade || null,
      harvest_date: productData.harvest_date || null,
      moisture_percentage: productData.moisture_percentage ? Number(productData.moisture_percentage) : null,
      wholesale_price: productData.wholesale_price ? Number(productData.wholesale_price) : null,
      retail_price: productData.retail_price ? Number(productData.retail_price) : Number(productData.price),
      image_url: resolvedImage,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.data.marketplace_products.push(newProduct);

    // Initialize inventory
    this.data.inventory.push({
      id: crypto.randomUUID(),
      product_id: id,
      stock_quantity: Math.max(0, Number(initialStock) || 0),
      low_stock_threshold: 5,
      reserved_quantity: 0,
      last_restocked_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Save image gallery
    imageUrls.forEach((url, idx) => {
      this.data.product_images.push({
        id: crypto.randomUUID(),
        product_id: id,
        image_url: url,
        is_primary: idx === 0,
        display_order: idx,
        created_at: new Date().toISOString(),
      });
    });

    this.persist();
    return this.findProductById(id);
  }

  updateProduct(productId, sellerId, updates) {
    const idx = this.data.marketplace_products.findIndex(
      (p) => p.id === productId && (sellerId === null || p.seller_id === sellerId)
    );
    if (idx === -1) return null;

    const current = this.data.marketplace_products[idx];
    this.data.marketplace_products[idx] = {
      ...current,
      ...updates,
      price: updates.price !== undefined ? Number(updates.price) : current.price,
      updated_at: new Date().toISOString(),
    };

    if (updates.stock_quantity !== undefined) {
      this.updateInventory(productId, Number(updates.stock_quantity));
    }

    this.persist();
    return this.findProductById(productId);
  }

  deleteProduct(productId, sellerId) {
    const idx = this.data.marketplace_products.findIndex(
      (p) => p.id === productId && (sellerId === null || p.seller_id === sellerId)
    );
    if (idx === -1) return false;

    this.data.marketplace_products.splice(idx, 1);
    this.data.inventory = this.data.inventory.filter((i) => i.product_id !== productId);
    this.data.product_images = this.data.product_images.filter((img) => img.product_id !== productId);
    this.persist();
    return true;
  }

  updateInventory(productId, newQuantity) {
    const inv = this.data.inventory.find((i) => i.product_id === productId);
    if (inv) {
      inv.stock_quantity = Math.max(0, newQuantity);
      inv.updated_at = new Date().toISOString();
      if (newQuantity > 0) {
        inv.last_restocked_at = new Date().toISOString();
      }

      // Update product status
      const prod = this.data.marketplace_products.find((p) => p.id === productId);
      if (prod) {
        if (inv.stock_quantity <= 0 && prod.status === 'active') {
          prod.status = 'out_of_stock';
        } else if (inv.stock_quantity > 0 && prod.status === 'out_of_stock') {
          prod.status = 'active';
        }
      }
      this.persist();
      return inv;
    }
    return null;
  }

  // --- Cart Management ---
  getUserCart(userId) {
    const items = this.data.cart_items.filter((c) => c.user_id === userId);
    return items.map((item) => {
      const product = this.findProductById(item.product_id);
      return {
        ...item,
        product,
      };
    }).filter((item) => item.product != null);
  }

  addToCart(userId, productId, quantity = 1) {
    const product = this.findProductById(productId);
    if (!product) throw new Error('Product not found.');
    if (product.available_quantity <= 0) throw new Error('Product is currently out of stock.');

    const qty = Math.max(product.min_order_quantity || 1, Number(quantity));
    if (qty > product.available_quantity) {
      throw new Error(`Requested quantity exceeds available stock (${product.available_quantity} available).`);
    }

    const existing = this.data.cart_items.find((c) => c.user_id === userId && c.product_id === productId);
    if (existing) {
      const newQty = existing.quantity + qty;
      if (newQty > product.available_quantity) {
        throw new Error(`Total cart quantity (${newQty}) exceeds available stock (${product.available_quantity}).`);
      }
      existing.quantity = newQty;
      existing.updated_at = new Date().toISOString();
      this.persist();
      return existing;
    }

    const newItem = {
      id: crypto.randomUUID(),
      user_id: userId,
      product_id: productId,
      quantity: qty,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.cart_items.push(newItem);
    this.persist();
    return newItem;
  }

  updateCartQuantity(userId, productId, quantity) {
    const existing = this.data.cart_items.find((c) => c.user_id === userId && c.product_id === productId);
    if (!existing) throw new Error('Item not in cart.');

    const qty = Number(quantity);
    if (qty <= 0) {
      return this.removeFromCart(userId, productId);
    }

    const product = this.findProductById(productId);
    if (product && qty > product.available_quantity) {
      throw new Error(`Quantity exceeds available stock (${product.available_quantity} available).`);
    }

    existing.quantity = qty;
    existing.updated_at = new Date().toISOString();
    this.persist();
    return existing;
  }

  removeFromCart(userId, productId) {
    const idx = this.data.cart_items.findIndex((c) => c.user_id === userId && c.product_id === productId);
    if (idx !== -1) {
      this.data.cart_items.splice(idx, 1);
      this.persist();
      return true;
    }
    return false;
  }

  clearUserCart(userId) {
    this.data.cart_items = this.data.cart_items.filter((c) => c.user_id !== userId);
    this.persist();
  }

  // --- Delivery Addresses ---
  getDeliveryAddresses(userId) {
    return (this.data.delivery_addresses || []).filter((a) => a.user_id === userId);
  }

  addDeliveryAddress(userId, addressData) {
    if (!this.data.delivery_addresses) {
      this.data.delivery_addresses = [];
    }
    const id = crypto.randomUUID();
    const isFirst = this.data.delivery_addresses.filter((a) => a.user_id === userId).length === 0;
    const newAddress = {
      id,
      user_id: userId,
      recipient_name: addressData.recipient_name,
      phone_number: addressData.phone_number,
      address_line1: addressData.address_line1,
      address_line2: addressData.address_line2 || '',
      landmark: addressData.landmark || '',
      village_or_city: addressData.village_or_city,
      district: addressData.district,
      state: addressData.state || 'Karnataka',
      pincode: addressData.pincode,
      is_default: addressData.is_default !== undefined ? Boolean(addressData.is_default) : isFirst,
      created_at: new Date().toISOString(),
    };

    if (newAddress.is_default) {
      this.data.delivery_addresses.forEach((a) => {
        if (a.user_id === userId) a.is_default = false;
      });
    }

    this.data.delivery_addresses.push(newAddress);
    this.persist();
    return newAddress;
  }

  deleteDeliveryAddress(userId, addressId) {
    if (!this.data.delivery_addresses) return false;
    const idx = this.data.delivery_addresses.findIndex((a) => a.id === addressId && a.user_id === userId);
    if (idx !== -1) {
      this.data.delivery_addresses.splice(idx, 1);
      this.persist();
      return true;
    }
    return false;
  }

  updatePayment(orderId, updates) {
    const payment = this.data.marketplace_payments.find((p) => p.order_id === orderId);
    if (!payment) return null;
    Object.assign(payment, updates, { updated_at: new Date().toISOString() });
    this.persist();
    return payment;
  }

  listAllOrders() {
    return this.data.marketplace_orders.map((o) => this.findOrderById(o.id)).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  // --- Orders & Checkout ---
  createOrder({
    buyer_id,
    seller_id,
    items,
    shipping_address,
    delivery_type = 'local_delivery',
    delivery_charges = 0,
    payment_method = 'cod',
  }) {
    // 1. Validate items and inventory availability
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = this.findProductById(item.product_id);
      if (!product) throw new Error(`Product ${item.product_id} no longer exists.`);

      const inv = this.data.inventory.find((i) => i.product_id === item.product_id);
      if (!inv || (inv.stock_quantity - inv.reserved_quantity) < item.quantity) {
        throw new Error(`Insufficient stock for ${product.title}. Only ${inv ? inv.stock_quantity - inv.reserved_quantity : 0} available.`);
      }

      const itemTotal = Number(product.price) * Number(item.quantity);
      subtotal += itemTotal;

      validatedItems.push({
        product_id: product.id,
        product_title: product.title,
        unit_price: product.price,
        quantity: item.quantity,
        unit: product.unit,
        total_price: itemTotal,
      });
    }

    const total_amount = subtotal + Number(delivery_charges);
    const order_number = `AGRI-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const order_id = crypto.randomUUID();

    // 2. Deduct inventory safely
    for (const item of validatedItems) {
      const inv = this.data.inventory.find((i) => i.product_id === item.product_id);
      if (inv) {
        inv.stock_quantity = Math.max(0, inv.stock_quantity - item.quantity);
        inv.updated_at = new Date().toISOString();
        const prod = this.data.marketplace_products.find((p) => p.id === item.product_id);
        if (prod && inv.stock_quantity <= 0) {
          prod.status = 'out_of_stock';
        }
      }
    }

    // 3. Create order record
    const newOrder = {
      id: order_id,
      order_number,
      buyer_id,
      seller_id,
      shipping_address_snapshot: shipping_address,
      subtotal,
      delivery_charges: Number(delivery_charges),
      tax_amount: 0,
      total_amount,
      delivery_type,
      order_status: 'order_placed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.marketplace_orders.push(newOrder);

    // 4. Create line items
    for (const vItem of validatedItems) {
      this.data.marketplace_order_items.push({
        id: crypto.randomUUID(),
        order_id,
        ...vItem,
        created_at: new Date().toISOString(),
      });
    }

    // 5. Create payment record
    const payment = {
      id: crypto.randomUUID(),
      order_id,
      payment_method,
      gateway_provider: payment_method === 'cod' ? 'cod' : 'razorpay',
      amount: total_amount,
      currency: 'INR',
      payment_status: payment_method === 'cod' ? 'pending' : 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.marketplace_payments.push(payment);

    // 6. Clear buyer's cart items
    this.clearUserCart(buyer_id);

    this.persist();
    return this.findOrderById(order_id);
  }

  findOrderById(orderId) {
    const o = this.data.marketplace_orders.find((item) => item.id === orderId);
    if (!o) return null;

    const buyer = this.findUserById(o.buyer_id) || {};
    const seller = this.findSellerProfileById(o.seller_id) || {};
    const items = this.data.marketplace_order_items.filter((item) => item.order_id === o.id);
    const payment = this.data.marketplace_payments.find((p) => p.order_id === o.id) || null;

    return {
      ...o,
      buyer_name: buyer.full_name,
      buyer_mobile: buyer.mobile_number,
      buyer_email: buyer.email,
      seller_name: seller.business_name,
      seller_contact: seller.contact_number,
      seller_district: seller.district,
      items,
      payment,
    };
  }

  listOrdersForBuyer(buyerId) {
    const orders = this.data.marketplace_orders.filter((o) => o.buyer_id === buyerId);
    return orders.map((o) => this.findOrderById(o.id)).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  listOrdersForSeller(sellerId) {
    const orders = this.data.marketplace_orders.filter((o) => o.seller_id === sellerId);
    return orders.map((o) => this.findOrderById(o.id)).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  updateOrderStatus(orderId, newStatus, { actorId, reason } = {}) {
    const order = this.data.marketplace_orders.find((o) => o.id === orderId);
    if (!order) return null;

    const validStatuses = [
      'order_placed',
      'order_confirmed',
      'processing',
      'ready_for_dispatch',
      'shipped',
      'delivered',
      'cancelled',
      'refund_initiated',
      'refunded',
    ];

    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`);
    }

    // If order is cancelled, restore stock
    if (newStatus === 'cancelled' && order.order_status !== 'cancelled') {
      const items = this.data.marketplace_order_items.filter((item) => item.order_id === orderId);
      for (const item of items) {
        const inv = this.data.inventory.find((i) => i.product_id === item.product_id);
        if (inv) {
          inv.stock_quantity += item.quantity;
          inv.updated_at = new Date().toISOString();
          const prod = this.data.marketplace_products.find((p) => p.id === item.product_id);
          if (prod && prod.status === 'out_of_stock' && inv.stock_quantity > 0) {
            prod.status = 'active';
          }
        }
      }
      order.cancelled_by = actorId;
      order.cancelled_at = new Date().toISOString();
      order.cancellation_reason = reason || 'Order cancelled by participant';
    }

    order.order_status = newStatus;
    order.updated_at = new Date().toISOString();

    // If marked delivered and was COD, mark payment captured
    if (newStatus === 'delivered') {
      const payment = this.data.marketplace_payments.find((p) => p.order_id === orderId);
      if (payment && payment.payment_status === 'pending') {
        payment.payment_status = 'captured';
        payment.updated_at = new Date().toISOString();
      }
    }

    this.persist();
    return this.findOrderById(orderId);
  }

  // --- Reviews ---
  addReview({ product_id, buyer_id, order_id, rating, comment }) {
    // Check if buyer already reviewed this product for this order
    const existing = this.data.marketplace_reviews.find(
      (r) => r.product_id === product_id && r.buyer_id === buyer_id && r.order_id === order_id
    );
    if (existing) {
      throw new Error('You have already submitted a review for this purchase.');
    }

    // Verify order is delivered
    const order = this.data.marketplace_orders.find((o) => o.id === order_id && o.buyer_id === buyer_id);
    if (!order || order.order_status !== 'delivered') {
      throw new Error('Only delivered purchases can be reviewed.');
    }

    const newReview = {
      id: crypto.randomUUID(),
      product_id,
      buyer_id,
      order_id,
      rating: Math.min(5, Math.max(1, Number(rating))),
      comment: comment || '',
      is_reported: false,
      is_moderated: false,
      created_at: new Date().toISOString(),
    };
    this.data.marketplace_reviews.push(newReview);
    this.persist();
    return newReview;
  }

  // --- Shops ---
  listShops({ category, district, userLat, userLng, maxDistanceKm } = {}) {
    let shops = this.data.marketplace_shops.map((s) => {
      const distanceKm = (userLat != null && userLng != null && s.latitude != null && s.longitude != null)
        ? calculateDistanceKm(userLat, userLng, s.latitude, s.longitude)
        : null;
      return {
        ...s,
        distanceKm,
      };
    });

    if (category && category !== 'All') {
      const cleanCat = category.toLowerCase();
      shops = shops.filter((s) => s.category.toLowerCase() === cleanCat);
    }

    if (district) {
      shops = shops.filter((s) => s.district.toLowerCase() === district.toLowerCase());
    }

    if (maxDistanceKm != null && !isNaN(maxDistanceKm)) {
      shops = shops.filter((s) => s.distanceKm != null && s.distanceKm <= Number(maxDistanceKm));
    }

    // Sort by proximity
    shops.sort((a, b) => (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999));
    return shops;
  }

  addShop(shopData) {
    const id = `shop-${Date.now()}`;
    const newShop = {
      id,
      name: shopData.name,
      category: shopData.category || 'Supplies',
      shop_type: shopData.shop_type || 'Agricultural Store',
      address: shopData.address,
      district: shopData.district,
      state: shopData.state || 'Karnataka',
      pincode: shopData.pincode || null,
      contact: shopData.contact || null,
      operating_hours: shopData.operating_hours || 'Mon - Sat: 09:00 AM - 06:00 PM',
      latitude: Number(shopData.latitude),
      longitude: Number(shopData.longitude),
      is_verified: false,
      verification_source: 'User Suggested - Pending Admin Verification',
      inventory_summary: shopData.inventory_summary || ['Agricultural Supplies'],
      created_at: new Date().toISOString(),
    };
    this.data.marketplace_shops.push(newShop);
    this.persist();
    return newShop;
  }

  verifyShop(shopId, verified = true) {
    const s = this.data.marketplace_shops.find((item) => item.id === shopId);
    if (!s) return null;
    s.is_verified = verified;
    s.verification_source = verified ? 'Verified by AgriSphere Admin' : 'Unverified';
    this.persist();
    return s;
  }

  // --- Admin Stats ---
  getAdminStats() {
    const totalRevenue = this.data.marketplace_orders.reduce((acc, o) => {
      return o.order_status !== 'cancelled' ? acc + o.total_amount : acc;
    }, 0);

    return {
      total_users: this.data.users.length,
      total_sellers: this.data.seller_profiles.length,
      pending_sellers: this.data.seller_profiles.filter((s) => s.verification_status === 'pending').length,
      approved_sellers: this.data.seller_profiles.filter((s) => s.verification_status === 'approved').length,
      total_products: this.data.marketplace_products.length,
      total_orders: this.data.marketplace_orders.length,
      total_revenue: totalRevenue,
      total_shops: this.data.marketplace_shops.length,
      pending_shops: this.data.marketplace_shops.filter((s) => !s.is_verified).length,
    };
  }
}

export const marketplaceStore = new MarketplaceStore();
export default marketplaceStore;
