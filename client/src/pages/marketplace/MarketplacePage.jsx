import React, { useState, useMemo, useEffect } from 'react';
import {
  ShoppingCart,
  Search,
  Tag,
  MapPin,
  Phone,
  Plus,
  CheckCircle2,
  Package,
  X,
  ExternalLink,
  ChevronRight,
  User,
  Map as MapIcon,
  Store,
  Clock,
  Sparkles,
  Info,
  Navigation,
  Globe,
} from 'lucide-react';
import LeafletMap from '../../components/common/LeafletMap.jsx';
import { useLocationContext } from '../../context/LocationContext.jsx';
import { calculateDistanceKm } from '../../services/marketService.js';

const STORAGE_KEY = 'agrisphere_marketplace_listings_v1';

// Regional Certified Agricultural Depots & Cooperative Outposts
const baseAgriShops = [
  {
    id: 'shop-kssc',
    name: 'KSSC Certified Seed Depot',
    type: 'Seed Depot',
    shopCategory: 'Seeds',
    position: [15.8595, 74.5075],
    color: '#15803D',
    address: 'Gate 2, APMC Market Yard, Belagavi 590016',
    contact: '+91 831 245 8820',
    hours: 'Mon - Sat: 08:30 AM - 05:00 PM',
    inventory: ['Certified Sona Masoori Paddy Seeds', 'Hybrid Maize 900M', 'TMV-2 Groundnut Seeds', 'Vegetable Seeds'],
    description: 'Official Karnataka State Seed Corporation depot with certified high-germination foundation seeds.',
  },
  {
    id: 'shop-krishi-rasayan',
    name: 'District Krishi Rasayan & Fertilizers',
    type: 'Fertilizer & Pesticide Depot',
    shopCategory: 'Fertilizers',
    position: [15.8542, 74.4982],
    color: '#2563EB',
    address: 'Near Old Post Office, Khade Bazar, Belagavi 590001',
    contact: '+91 831 242 7710',
    hours: 'Mon - Sat: 08:00 AM - 07:00 PM',
    inventory: ['Neem Coated Urea (46% N)', 'DAP 18:46:0', 'MOP (Potash)', 'Mancozeb Fungicide', 'Micronutrient Mixtures'],
    description: 'Licensed retail distributor of IFFCO, KRIBHCO fertilizers and approved bio-pesticides.',
  },
  {
    id: 'shop-green-earth',
    name: 'Green Earth Bio-Inputs & Vermicompost Hub',
    type: 'Bio-Fertilizer Depot',
    shopCategory: 'Bio-Fertilizers',
    position: [15.8672, 74.5310],
    color: '#059669',
    address: 'Survey No. 88, Sambra Road, Belagavi Rural 591124',
    contact: '+91 94482 10934',
    hours: 'Mon - Sat: 07:00 AM - 06:00 PM',
    inventory: ['Enriched Vermicompost (50kg bags)', 'Trichoderma Viride', 'PSB Bio-Culture', 'Jeevamrutha Kits'],
    description: 'Farmer cooperative organic input center producing lab-tested vermicompost and microbial cultures.',
  },
  {
    id: 'shop-kisan-hardware',
    name: 'Kisan Agro Supplies & Safety Hardware',
    type: 'Agricultural Supply Store',
    shopCategory: 'Supplies',
    position: [15.8510, 74.5020],
    color: '#0D9488',
    address: 'Shop 14, Raviwar Peth, Belagavi 590002',
    contact: '+91 831 242 1904',
    hours: 'Mon - Sat: 08:30 AM - 07:30 PM',
    inventory: ['16L Battery Knapsack Sprayers', 'Drip Lateral Pipes & Fittings', 'HDPE Tarpaulins', 'Mulching Film'],
    description: 'Agricultural supply store for knapsack sprayers, drip fittings, tarpaulins, and farm tools.',
  },
  {
    id: 'shop-patil-produce',
    name: 'Farmer Direct Harvest Outpost',
    type: 'Farm Produce Seller',
    shopCategory: 'Produce',
    position: [15.8320, 74.5240],
    color: '#D97706',
    address: 'Bailhongal Road, Near Toll Plaza, Belagavi Rural',
    contact: '+91 98455 33102',
    hours: 'Mon - Sun: 07:00 AM - 06:00 PM',
    inventory: ['Grade A Sun-Dried Maize', 'Fresh Harvested Field Tomatoes', 'Bellary Red Onions'],
    description: 'Direct farm gate selling outpost offering bulk harvested grains and seasonal produce without intermediaries.',
  },
  {
    id: 'shop-gokak-organic',
    name: 'Gokak Valley Organic Seeds & Neem Depot',
    type: 'Seed & Pesticide Shop',
    shopCategory: 'Pesticides',
    position: [16.1702, 74.8305],
    color: '#7C3AED',
    address: 'APMC Complex, Station Road, Gokak 591307',
    contact: '+91 8332 227 410',
    hours: 'Mon - Sat: 08:00 AM - 06:30 PM',
    inventory: ['Pure Cold-Pressed Neem Oil (1500 PPM)', 'Native Vegetable Seeds', 'Copper Oxychloride', 'Sticky Traps'],
    description: 'Specialized in organic crop protection, botanical neem extracts, and regional vegetable seeds.',
  },
];

const initialDefaultProducts = [
  {
    id: 'prod-1',
    title: 'Certified Sona Masoori Paddy Seeds (CS-1)',
    category: 'Seeds',
    price: '₹1,450',
    unit: 'per 25 kg bag',
    stock: '45 Bags in stock',
    shopId: 'shop-kssc',
    seller: 'KSSC Certified Seed Depot',
    location: 'APMC Yard, Belagavi',
    contact: '+91 831 245 8820',
    description: 'Government certified high-germination (98%) foundation seeds with official germination certificate.',
  },
  {
    id: 'prod-2',
    title: 'Enriched Vermicompost (Organic Earthworm Compost)',
    category: 'Bio-Fertilizers',
    price: '₹350',
    unit: 'per 50 kg bag',
    stock: '120 Bags available',
    shopId: 'shop-green-earth',
    seller: 'Green Earth Bio-Inputs',
    location: 'Sambra Road, Belagavi Rural',
    contact: '+91 94482 10934',
    description: 'Fully matured cow dung vermicompost enriched with Trichoderma and PSB phosphate-solubilizing bio-culture.',
  },
  {
    id: 'prod-3',
    title: '16-Liter 12V Battery Powered Knapsack Sprayer',
    category: 'Agri Supplies',
    price: '₹2,650',
    unit: 'per unit',
    stock: '15 Units in stock',
    shopId: 'shop-kisan-hardware',
    seller: 'Kisan Agro Supplies',
    location: 'Raviwar Peth, Belagavi',
    contact: '+91 831 242 1904',
    description: 'Heavy-duty dual-motor knapsack sprayer with brass lance, 4 nozzle set, and 6-hour continuous battery backup.',
  },
  {
    id: 'prod-4',
    title: 'Fresh Harvested Hybrid Maize (Grade A Grain)',
    category: 'Produce Listing',
    price: '₹2,250',
    unit: 'per quintal',
    stock: '80 Quintals lot',
    shopId: 'shop-patil-produce',
    seller: 'Basavaraj Patil (Farmer)',
    location: 'Bailhongal Road Outpost',
    contact: '+91 98455 33102',
    description: 'Sun-dried maize with <14% moisture, cleaned and packed in 50kg gunny bags. Ready for direct bulk pickup.',
  },
  {
    id: 'prod-5',
    title: 'Cold-Pressed Pure Neem Oil (1500 PPM Azadirachtin)',
    category: 'Crop Protection',
    price: '₹420',
    unit: 'per 1 Liter bottle',
    stock: '60 Liters in stock',
    shopId: 'shop-gokak-organic',
    seller: 'Gokak Valley Organic Seeds',
    location: 'APMC Complex, Gokak',
    contact: '+91 8332 227 410',
    description: '100% natural water-soluble bio-pesticide for sucking pest control and leaf miner prevention.',
  },
  {
    id: 'prod-6',
    title: 'Neem-Coated Urea (46% N) Subsidized Bag',
    category: 'Fertilizers',
    price: '₹266.50',
    unit: 'per 45 kg bag (Govt. Subsidized)',
    stock: '250 Bags in stock',
    shopId: 'shop-krishi-rasayan',
    seller: 'District Krishi Rasayan',
    location: 'Khade Bazar, Belagavi',
    contact: '+91 831 242 7710',
    description: 'High-purity urea with neem oil coating for sustained nitrogen release and minimum leaching losses.',
  },
];

const categories = ['All', 'Seeds', 'Fertilizers', 'Bio-Fertilizers', 'Crop Protection', 'Agri Supplies', 'Produce Listing'];

const MarketplacePage = () => {
  const {
    coordinates,
    city,
    district,
    state,
    formattedName,
    isGps,
    isGlobal,
  } = useLocationContext();

  // Load persisted products from localStorage or use defaults
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // ignore
    }
    return initialDefaultProducts;
  });

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [viewMode, setViewMode] = useState('split'); // 'split', 'products', 'map'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showListingModal, setShowListingModal] = useState(false);

  const defaultUserLocation = [district, city].filter(Boolean).join(', ') || formattedName || 'Local Farm';

  const [newListing, setNewListing] = useState({
    title: '',
    category: 'Produce Listing',
    price: '',
    unit: 'per quintal',
    stock: '',
    seller: 'Registered Farmer',
    location: defaultUserLocation,
    contact: '+91 98451 22910',
    description: '',
  });

  // Keep location updated in form
  useEffect(() => {
    setNewListing((prev) => ({
      ...prev,
      location: defaultUserLocation,
    }));
  }, [defaultUserLocation]);

  // Persist products
  const saveProducts = (updated) => {
    setProducts(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  // Compute live distances for shops
  const agriShopsWithDistances = useMemo(() => {
    return baseAgriShops.map((shop) => {
      const distanceKm = calculateDistanceKm(
        coordinates.lat,
        coordinates.lng,
        shop.position[0],
        shop.position[1]
      );
      return {
        ...shop,
        distanceKm,
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [coordinates]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesCategory =
        selectedCategory === 'All' || prod.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        prod.title.toLowerCase().includes(q) ||
        prod.seller.toLowerCase().includes(q) ||
        prod.location.toLowerCase().includes(q) ||
        prod.description.toLowerCase().includes(q);
      const matchesShop =
        !selectedShopId || prod.shopId === selectedShopId;
      return matchesCategory && matchesQuery && matchesShop;
    });
  }, [products, selectedCategory, searchQuery, selectedShopId]);

  // Filtered Shops for Map
  const filteredShops = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return agriShopsWithDistances.filter((shop) => {
      const matchesQuery =
        !q ||
        shop.name.toLowerCase().includes(q) ||
        shop.type.toLowerCase().includes(q) ||
        shop.address.toLowerCase().includes(q) ||
        shop.inventory.some((inv) => inv.toLowerCase().includes(q));
      return matchesQuery;
    });
  }, [agriShopsWithDistances, searchQuery]);

  // Map markers: User location + shops
  const mapMarkers = useMemo(() => {
    const list = [];
    list.push({
      id: 'user-pin',
      title: `Your Active Location (${formattedName})`,
      type: isGps ? 'GPS Verified' : 'Location',
      position: [coordinates.lat, coordinates.lng],
      color: '#2563EB',
      description: `Coordinates: ${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`,
    });

    filteredShops.forEach((shop) => {
      list.push({
        id: shop.id,
        title: shop.name,
        type: `${shop.type} • ${shop.distanceKm} km away`,
        position: shop.position,
        color: shop.color,
        address: shop.address,
        contact: shop.contact,
        description: `Distance: ${shop.distanceKm} km. Available: ${shop.inventory.join(', ')}. Hours: ${shop.hours}`,
      });
    });

    return list;
  }, [coordinates, formattedName, isGps, filteredShops]);

  const handleLocateSellerOnMap = (shopId) => {
    setSelectedShopId(shopId);
    if (viewMode === 'products') {
      setViewMode('split');
    }
  };

  const handleAddListing = (e) => {
    e.preventDefault();
    if (!newListing.title || !newListing.price) return;

    const updated = [
      {
        id: `prod-${Date.now()}`,
        shopId: null,
        ...newListing,
      },
      ...products,
    ];

    saveProducts(updated);

    setNewListing({
      title: '',
      category: 'Produce Listing',
      price: '',
      unit: 'per quintal',
      stock: '',
      seller: 'Registered Farmer',
      location: defaultUserLocation,
      contact: '+91 98451 22910',
      description: '',
    });
    setShowListingModal(false);
  };

  const activeShop = agriShopsWithDistances.find((s) => s.id === selectedShopId);
  const mapCenter = activeShop ? activeShop.position : [coordinates.lat, coordinates.lng];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md mb-2">
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Agricultural Supplies & Direct Farm Listings</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14532D]">Marketplace & Seller Map</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Discover seeds, fertilizers, pesticides, farm supplies, and farmer produce near{' '}
            <span className="font-semibold text-slate-800">{formattedName}</span>.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 bg-[#F8FAF6] border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-[#1F2937]">
            {isGps ? (
              <Navigation className="w-3.5 h-3.5 text-[#15803D]" />
            ) : isGlobal ? (
              <Globe className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-[#15803D]" />
            )}
            <span className="font-semibold truncate max-w-[140px]">{formattedName}</span>
          </div>
          <button
            onClick={() => setShowListingModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#15803D] text-white hover:bg-[#14532D] text-xs font-bold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>List Farm Produce</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search seeds, fertilizers, pesticides, equipment, or farm produce..."
              className="w-full bg-[#F8FAF6] hover:bg-white focus:bg-white border border-slate-200 focus:border-[#15803D] rounded-lg pl-10 pr-8 py-2 text-sm text-[#1F2937] placeholder-slate-400 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 bg-[#F8FAF6] border border-slate-200 rounded-lg shrink-0 self-end md:self-auto">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded text-xs font-medium ${
                viewMode === 'split' ? 'bg-white text-[#15803D] font-bold shadow-xs' : 'text-slate-600'
              }`}
              title="Split View"
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('products')}
              className={`px-3 py-1.5 rounded text-xs font-medium ${
                viewMode === 'products' ? 'bg-white text-[#15803D] font-bold shadow-xs' : 'text-slate-600'
              }`}
              title="Products Only"
            >
              Listings Only
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded text-xs font-medium ${
                viewMode === 'map' ? 'bg-white text-[#15803D] font-bold shadow-xs' : 'text-slate-600'
              }`}
              title="Map Only"
            >
              Seller Map Only
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md text-xs whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#15803D] text-white font-medium'
                  : 'bg-[#F8FAF6] text-[#64748B] hover:text-[#1F2937] border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Listings + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Column */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <div
            className={`${
              viewMode === 'map' ? 'lg:col-span-12' : 'lg:col-span-6'
            } sticky top-20`}
          >
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3 text-xs text-[#64748B]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#1F2937]">Agricultural Seller & Depot Map</span>
                  {selectedShopId && (
                    <button
                      onClick={() => setSelectedShopId(null)}
                      className="text-xs text-[#15803D] hover:underline"
                    >
                      (Clear Filter)
                    </button>
                  )}
                </div>
                <span>{filteredShops.length} Locations Marked</span>
              </div>

              <LeafletMap
                center={mapCenter}
                zoom={activeShop ? 14 : 11}
                markers={mapMarkers}
                selectedId={selectedShopId}
                onSelectMarker={(shop) => {
                  if (shop.id !== 'user-pin') {
                    setSelectedShopId(shop.id);
                  }
                }}
                height={viewMode === 'map' ? '540px' : '480px'}
              />

              <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-[#64748B] gap-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" /> You
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#15803D]" /> Seeds
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" /> Fertilizer
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" /> Bio-Inputs
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" /> Farm Gate
                  </span>
                </div>
                <span>Distances computed from your coordinates</span>
              </div>
            </div>
          </div>
        )}

        {/* Listings Column */}
        {(viewMode === 'split' || viewMode === 'products') && (
          <div
            className={`${
              viewMode === 'products' ? 'lg:col-span-12' : 'lg:col-span-6'
            } space-y-4`}
          >
            <div className="flex items-center justify-between text-xs text-[#64748B] px-1">
              <span className="font-semibold text-[#1F2937]">
                Available Agricultural Listings ({filteredProducts.length})
              </span>
              <span>Direct Sellers & Cooperative Hubs</span>
            </div>

            <div className="space-y-3.5">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProduct(prod)}
                  className="group bg-white rounded-xl border border-slate-200 p-4.5 hover:border-[#15803D] cursor-pointer transition-all shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded">
                          {prod.category}
                        </span>
                        <h3 className="text-sm font-bold text-[#1F2937] group-hover:text-[#15803D] transition-colors mt-1">
                          {prod.title}
                        </h3>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-[#14532D]">{prod.price}</span>
                        <span className="text-[10px] text-slate-500 block">{prod.unit}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#64748B] mt-2 line-clamp-2">{prod.description}</p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748B]">
                    <div className="flex items-center gap-2">
                      <Store className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-700">{prod.seller}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">{prod.location}</span>
                    </div>

                    {prod.shopId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLocateSellerOnMap(prod.shopId);
                        }}
                        className="text-xs font-semibold text-[#15803D] hover:underline inline-flex items-center gap-1"
                      >
                        <MapPin className="w-3 h-3" />
                        Locate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-[#64748B]">
                <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#1F2937]">No listings found</p>
                <p className="text-xs text-slate-400 mt-1">
                  Try clearing your search query or click &quot;List Farm Produce&quot; to post a new listing.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Listing Detail Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="w-full max-w-lg rounded-xl bg-white p-6 border border-slate-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#15803D]">
                  {selectedProduct.category}
                </span>
                <h2 className="text-lg font-bold text-[#1F2937] mt-0.5">{selectedProduct.title}</h2>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div className="p-3.5 rounded-lg bg-[#DCFCE7] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-800 uppercase font-semibold">Listed Price</span>
                  <p className="text-xl font-black text-[#14532D]">{selectedProduct.price}</p>
                </div>
                <span className="text-xs font-semibold text-emerald-900 bg-white/70 px-2.5 py-1 rounded">
                  {selectedProduct.unit}
                </span>
              </div>

              <div>
                <span className="font-bold text-[#1F2937] block mb-1">Product Description</span>
                <p className="text-[#64748B] leading-relaxed bg-[#F8FAF6] p-3 rounded-lg border border-slate-200">
                  {selectedProduct.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-700">
                <div className="p-2.5 bg-[#F8FAF6] rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-medium">Seller / Depot</span>
                  <span className="font-bold text-[#1F2937]">{selectedProduct.seller}</span>
                </div>
                <div className="p-2.5 bg-[#F8FAF6] rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-medium">Location</span>
                  <span className="font-bold text-[#1F2937]">{selectedProduct.location}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>

              <a
                href={`tel:${selectedProduct.contact.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#15803D] text-white text-xs font-bold hover:bg-[#14532D] transition-colors shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Seller: {selectedProduct.contact}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Post a Listing Modal */}
      {showListingModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowListingModal(false)}
        >
          <div
            className="w-full max-w-lg rounded-xl bg-white p-6 border border-slate-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#15803D]">
                  Post to AgriSphere Marketplace
                </span>
                <h2 className="text-lg font-bold text-[#1F2937] mt-0.5">List Agricultural Produce or Supply</h2>
              </div>
              <button
                onClick={() => setShowListingModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddListing} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cleaned Hybrid Maize (Lot of 50 Quintals)"
                  value={newListing.title}
                  onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-[#F8FAF6] px-3 py-2 text-sm text-[#1F2937] outline-none focus:border-[#15803D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">Category</label>
                  <select
                    value={newListing.category}
                    onChange={(e) => setNewListing({ ...newListing, category: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-[#F8FAF6] px-3 py-2 text-xs text-[#1F2937] outline-none focus:border-[#15803D]"
                  >
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">Price</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹2,300"
                    value={newListing.price}
                    onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-[#F8FAF6] px-3 py-2 text-xs text-[#1F2937] outline-none focus:border-[#15803D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">Unit</label>
                  <input
                    type="text"
                    placeholder="e.g. per quintal / per bag"
                    value={newListing.unit}
                    onChange={(e) => setNewListing({ ...newListing, unit: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-[#F8FAF6] px-3 py-2 text-xs text-[#1F2937] outline-none focus:border-[#15803D]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">Available Quantity</label>
                  <input
                    type="text"
                    placeholder="e.g. 50 Quintals lot"
                    value={newListing.stock}
                    onChange={(e) => setNewListing({ ...newListing, stock: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-[#F8FAF6] px-3 py-2 text-xs text-[#1F2937] outline-none focus:border-[#15803D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">Seller / Farm Name</label>
                  <input
                    type="text"
                    value={newListing.seller}
                    onChange={(e) => setNewListing({ ...newListing, seller: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-[#F8FAF6] px-3 py-2 text-xs text-[#1F2937] outline-none focus:border-[#15803D]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">Location</label>
                  <input
                    type="text"
                    value={newListing.location}
                    onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-[#F8FAF6] px-3 py-2 text-xs text-[#1F2937] outline-none focus:border-[#15803D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={newListing.contact}
                  onChange={(e) => setNewListing({ ...newListing, contact: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-[#F8FAF6] px-3 py-2 text-xs text-[#1F2937] outline-none focus:border-[#15803D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">Description & Quality Notes</label>
                <textarea
                  rows="3"
                  placeholder="Detail crop quality, moisture level, packaging, or pickup instructions..."
                  value={newListing.description}
                  onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-[#F8FAF6] px-3 py-2 text-xs text-[#1F2937] outline-none focus:border-[#15803D]"
                />
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowListingModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#15803D] text-white text-xs font-bold hover:bg-[#14532D] transition-colors shadow-xs"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
