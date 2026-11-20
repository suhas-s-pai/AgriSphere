import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
  Star,
  SlidersHorizontal,
  ShieldCheck,
  Building2,
  ArrowUpDown,
  ShoppingBag,
  TrendingUp,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import LeafletMap from '../../components/common/LeafletMap.jsx';
import { useLocationContext } from '../../context/LocationContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { productApi, shopApi } from '../../services/api.js';
import { calculateDistanceKm } from '../../services/marketService.js';

// Modals
import CartDrawer from '../../components/marketplace/CartDrawer.jsx';
import CheckoutModal from '../../components/marketplace/CheckoutModal.jsx';
import ProductDetailModal from '../../components/marketplace/ProductDetailModal.jsx';
import AddProductModal from '../../components/marketplace/AddProductModal.jsx';
import SuggestShopModal from '../../components/marketplace/SuggestShopModal.jsx';
import SellerDashboardModal from '../../components/marketplace/SellerDashboardModal.jsx';
import BuyerDashboardModal from '../../components/marketplace/BuyerDashboardModal.jsx';
import ReviewModal from '../../components/marketplace/ReviewModal.jsx';
import AdminMarketplaceModal from '../../components/marketplace/AdminMarketplaceModal.jsx';

// 10 Standardized Categories
const PRODUCT_CATEGORIES = [
  'All',
  'Seeds',
  'Fertilizers',
  'Organic Fertilizers',
  'Bio-Fertilizers',
  'Pesticides and Crop Protection',
  'Agricultural Machinery',
  'Irrigation Equipment',
  'Farming Tools',
  'Animal Husbandry Supplies',
  'Harvested Crops and Farm Produce',
];

// Fallback baseline certified Karnataka depots if network is slow
const defaultFallbackShops = [
  {
    id: 'shop-kssc',
    name: 'KSSC Certified Seed Depot',
    type: 'Seed Depot',
    category: 'Seeds',
    latitude: 15.8595,
    longitude: 74.5075,
    color: '#15803D',
    address: 'Gate 2, APMC Market Yard, Belagavi 590016',
    contact: '+91 831 245 8820',
    operating_hours: 'Mon - Sat: 08:30 AM - 05:00 PM',
    inventory_summary: ['Certified Sona Masoori Paddy Seeds', 'Hybrid Maize 900M', 'TMV-2 Groundnut Seeds'],
    is_verified: true,
  },
  {
    id: 'shop-krishi-rasayan',
    name: 'District Krishi Rasayan & Fertilizers',
    type: 'Fertilizer & Pesticide Depot',
    category: 'Fertilizers',
    latitude: 15.8542,
    longitude: 74.4982,
    color: '#2563EB',
    address: 'Near Old Post Office, Khade Bazar, Belagavi 590001',
    contact: '+91 831 242 7710',
    operating_hours: 'Mon - Sat: 08:00 AM - 07:00 PM',
    inventory_summary: ['Neem Coated Urea (46% N)', 'DAP 18:46:0', 'MOP (Potash)', 'Mancozeb Fungicide'],
    is_verified: true,
  },
  {
    id: 'shop-green-earth',
    name: 'Green Earth Bio-Inputs & Vermicompost Hub',
    type: 'Bio-Fertilizer Depot',
    category: 'Bio-Fertilizers',
    latitude: 15.8672,
    longitude: 74.5310,
    color: '#059669',
    address: 'Survey No. 88, Sambra Road, Belagavi Rural 591124',
    contact: '+91 94482 10934',
    operating_hours: 'Mon - Sat: 07:00 AM - 06:00 PM',
    inventory_summary: ['Enriched Vermicompost (50kg bags)', 'Trichoderma Viride', 'PSB Bio-Culture'],
    is_verified: true,
  },
  {
    id: 'shop-kisan-hardware',
    name: 'Kisan Agro Supplies & Safety Hardware',
    type: 'Agricultural Supply Store',
    category: 'Supplies',
    latitude: 15.8510,
    longitude: 74.5020,
    color: '#0D9488',
    address: 'Shop 14, Raviwar Peth, Belagavi 590002',
    contact: '+91 831 242 1904',
    operating_hours: 'Mon - Sat: 08:30 AM - 07:30 PM',
    inventory_summary: ['16L Battery Knapsack Sprayers', 'Drip Lateral Pipes & Fittings', 'HDPE Tarpaulins'],
    is_verified: true,
  },
  {
    id: 'shop-patil-produce',
    name: 'Farmer Direct Harvest Outpost',
    type: 'Farm Produce Seller',
    category: 'Produce',
    latitude: 15.8320,
    longitude: 74.5240,
    color: '#D97706',
    address: 'Bailhongal Road, Near Toll Plaza, Belagavi Rural',
    contact: '+91 98455 33102',
    operating_hours: 'Mon - Sun: 07:00 AM - 06:00 PM',
    inventory_summary: ['Grade A Sun-Dried Maize', 'Fresh Harvested Field Tomatoes', 'Bellary Red Onions'],
    is_verified: true,
  },
  {
    id: 'shop-gokak-organic',
    name: 'Gokak Valley Organic Seeds & Neem Depot',
    type: 'Seed & Pesticide Shop',
    category: 'Pesticides',
    latitude: 16.1702,
    longitude: 74.8305,
    color: '#7C3AED',
    address: 'APMC Complex, Station Road, Gokak 591307',
    contact: '+91 8332 227 410',
    operating_hours: 'Mon - Sat: 08:00 AM - 06:30 PM',
    inventory_summary: ['Pure Cold-Pressed Neem Oil (1500 PPM)', 'Native Vegetable Seeds', 'Copper Oxychloride'],
    is_verified: true,
  },
];

const MarketplacePage = () => {
  const { location, hasCoordinates, isGps, isGlobal, formattedName } = useLocationContext();
  const { user, sellerProfile, isAuthenticated, isSeller, isVerifiedSeller, openAuthModal, logout } = useAuth();
  const { openCart, totalItemCount } = useCart();

  // Active filters & sorting
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [radiusFilter, setRadiusFilter] = useState('all'); // '5', '10', '25', '50', 'all'
  const [sortBy, setSortBy] = useState('distance'); // 'distance', 'price_asc', 'price_desc', 'rating', 'newest'
  const [inStockOnly, setInStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'products' | 'map'
  const [selectedShopId, setSelectedShopId] = useState(null);

  // Live Server Data
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState(defaultFallbackShops);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showSuggestShopModal, setShowSuggestShopModal] = useState(false);
  const [showSellerDashboard, setShowSellerDashboard] = useState(false);
  const [showBuyerDashboard, setShowBuyerDashboard] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [reviewModalData, setReviewModalData] = useState(null); // { product, orderId }

  // Extract coordinates safely
  const userLat = hasCoordinates && location?.lat != null ? Number(location.lat) : 15.8595;
  const userLng = hasCoordinates && location?.lng != null ? Number(location.lng) : 74.5075;

  // Fetch Products & Shops from Backend
  const loadMarketplaceData = useCallback(async () => {
    setLoading(true);
    try {
      const productParams = {
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: searchQuery.trim() || undefined,
        userLat,
        userLng,
        maxDistanceKm: radiusFilter !== 'all' ? Number(radiusFilter) : undefined,
        sort: sortBy,
        inStockOnly: inStockOnly ? 'true' : undefined,
      };

      const shopParams = {
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        userLat,
        userLng,
        maxDistanceKm: radiusFilter !== 'all' ? Number(radiusFilter) : undefined,
      };

      const [prodRes, shopRes] = await Promise.all([
        productApi.listProducts(productParams),
        shopApi.listShops(shopParams),
      ]);

      if (prodRes.data?.status === 'success') {
        const rawProducts = prodRes.data.data || [];
        // Deduplicate incoming products strictly by unique ID and normalized title+seller
        const seenIds = new Set();
        const seenKeys = new Set();
        const unique = [];
        for (const p of rawProducts) {
          if (!p || !p.id || seenIds.has(p.id)) continue;
          seenIds.add(p.id);
          const key = `${(p.title || '').trim().toLowerCase()}__${(p.seller_id || p.seller_name || '').trim().toLowerCase()}`;
          if (seenKeys.has(key)) continue;
          seenKeys.add(key);
          unique.push(p);
        }
        setProducts(unique);
      }
      if (shopRes.data?.status === 'success' && shopRes.data.data.length > 0) {
        setShops(shopRes.data.data);
      }
    } catch (err) {
      console.warn('Backend marketplace fetch fallback:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, radiusFilter, sortBy, inStockOnly, userLat, userLng]);

  // Clean up any stale localStorage listings from previous versions to prevent duplicate or conflicting cached data
  useEffect(() => {
    try {
      localStorage.removeItem('agrisphere_marketplace_listings_v1');
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadMarketplaceData();
  }, [loadMarketplaceData]);

  // Compute live shop distances
  const shopsWithDistance = useMemo(() => {
    return shops.map((s) => {
      const lat = s.latitude ?? s.position?.[0];
      const lng = s.longitude ?? s.position?.[1];
      const distanceKm = calculateDistanceKm(userLat, userLng, lat, lng);
      return {
        ...s,
        position: [lat, lng],
        distanceKm,
      };
    }).sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
  }, [shops, userLat, userLng]);

  // Map Markers
  const mapMarkers = useMemo(() => {
    const list = [];
    if (hasCoordinates) {
      list.push({
        id: 'user-pin',
        title: `Your Location (${formattedName})`,
        type: isGps ? 'GPS Verified' : 'Location',
        position: [userLat, userLng],
        color: '#2563EB',
        description: `Coordinates: ${userLat.toFixed(4)}°N, ${userLng.toFixed(4)}°E`,
      });
    }

    shopsWithDistance.forEach((shop) => {
      list.push({
        id: shop.id,
        title: shop.name,
        type: `${shop.category || 'Agricultural Depot'} • ${shop.distanceKm != null ? `${shop.distanceKm} km away` : ''}`,
        position: shop.position,
        color: shop.is_verified ? '#15803D' : '#D97706',
        address: shop.address,
        contact: shop.contact,
        description: `${shop.distanceKm != null ? `Distance: ${shop.distanceKm} km. ` : ''}Items: ${(shop.inventory_summary || []).join(', ')}. ${shop.operating_hours || ''}`,
      });
    });

    return list;
  }, [hasCoordinates, isGps, userLat, userLng, formattedName, shopsWithDistance]);

  const activeShop = shopsWithDistance.find((s) => s.id === selectedShopId);
  const mapCenter = activeShop ? activeShop.position : [userLat, userLng];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md mb-2">
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Real Agricultural E-Commerce & Verified Seller Network</span>
          </div>
          <h1 className="text-2xl font-black text-[#14532D]">AgriSphere Marketplace</h1>
          <p className="text-xs text-[#64748B] mt-1">
            Certified seeds, fertilizers, farm equipment, and direct farmer-gate produce around{' '}
            <span className="font-bold text-slate-800">{formattedName}</span>.
          </p>
        </div>

        {/* Top Actions: Location Pill, Cart Badge, Role Switchers */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Active Location Indicator */}
          <div className="flex items-center gap-1.5 bg-[#F8FAF6] border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#1F2937]">
            {isGps ? (
              <Navigation className="w-3.5 h-3.5 text-[#15803D]" />
            ) : isGlobal ? (
              <Globe className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-[#15803D]" />
            )}
            <span className="font-semibold truncate max-w-[130px]">{formattedName}</span>
          </div>

          {/* Cart Drawer Trigger Button */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 px-3.5 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-bold transition shadow-xs"
            title="Open Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-700" />
            <span>Cart</span>
            {totalItemCount > 0 && (
              <span className="bg-emerald-700 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center -ml-1">
                {totalItemCount}
              </span>
            )}
          </button>

          {/* User Account / Dashboards */}
          {isAuthenticated ? (
            <div className="flex items-center gap-1.5">
              {/* Buyer Orders Dashboard */}
              <button
                onClick={() => setShowBuyerDashboard(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#1F2937] transition"
              >
                <User className="w-3.5 h-3.5 text-[#15803D]" />
                <span className="truncate max-w-[110px]">{user.full_name}</span>
              </button>

              {/* Seller Dashboard (if seller) */}
              {isSeller && (
                <button
                  onClick={() => setShowSellerDashboard(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 text-xs font-bold transition shadow-xs"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Seller Hub</span>
                  {isVerifiedSeller ? (
                    <span className="bg-emerald-600 text-white text-[9px] px-1 rounded">✓</span>
                  ) : null}
                </button>
              )}

              {/* Admin Portal Button (for admin role or test moderation) */}
              {user.role === 'admin' && (
                <button
                  onClick={() => setShowAdminModal(true)}
                  className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-purple-700 text-white hover:bg-purple-800 text-xs font-bold transition shadow-xs"
                  title="Admin Moderation"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              )}

              <button
                onClick={logout}
                className="px-2.5 py-2 text-xs font-semibold text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition border border-slate-200"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-[#1F2937] transition"
              >
                <User className="w-3.5 h-3.5 text-[#15803D]" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => openAuthModal('register', 'farmer')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#15803D] text-white hover:bg-[#14532D] text-xs font-bold transition shadow-xs"
              >
                <span>Register as Seller</span>
              </button>
            </div>
          )}

          {/* Quick List Product / Add Shop Action */}
          <button
            onClick={() => {
              if (!isAuthenticated) {
                openAuthModal('register', 'farmer');
              } else if (!isSeller) {
                openAuthModal('farmer');
              } else {
                setEditingProduct(null);
                setShowAddProductModal(true);
              }
            }}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#14532D] text-white hover:bg-emerald-900 text-xs font-bold transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>List Product</span>
          </button>
        </div>
      </div>

      {/* 2. Official APMC & e-NAM Benchmark Strip */}
      <div className="bg-gradient-to-r from-emerald-900 to-green-950 text-white rounded-xl p-3 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Compare your farm gate prices with official <strong>Karnataka Agmarknet APMC rates</strong> and{' '}
            <strong>National e-NAM</strong> mandates for maximum price realization.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://www.enam.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-300 hover:text-white font-bold flex items-center gap-1 underline underline-offset-2"
          >
            e-NAM Portal <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={() => setShowSuggestShopModal(true)}
            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-emerald-200 hover:text-white rounded-lg transition text-[11px] font-semibold flex items-center gap-1"
          >
            <Store className="w-3 h-3" /> Suggest a Shop
          </button>
        </div>
      </div>

      {/* 3. Search, Radius, Sorting & Category Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3.5 shadow-xs">
        {/* Row 1: Search & Controls */}
        <div className="flex flex-col lg:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search certified seeds, fertilizers, pesticides, sprayers, farm harvest lots..."
              className="w-full bg-[#F8FAF6] hover:bg-white focus:bg-white border border-slate-200 focus:border-[#15803D] rounded-xl pl-10 pr-8 py-2.5 text-xs text-[#1F2937] placeholder-slate-400 focus:outline-none transition-colors"
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

          {/* Radius Filter */}
          <div className="flex items-center gap-1.5 w-full lg:w-auto shrink-0 text-xs">
            <MapPin className="w-3.5 h-3.5 text-[#15803D]" />
            <span className="text-gray-500 font-medium">Radius:</span>
            <select
              value={radiusFilter}
              onChange={(e) => setRadiusFilter(e.target.value)}
              className="px-2.5 py-2 bg-[#F8FAF6] border border-slate-200 rounded-xl font-bold text-gray-800 outline-none focus:border-emerald-600"
            >
              <option value="all">Any Distance</option>
              <option value="5">Within 5 km</option>
              <option value="10">Within 10 km</option>
              <option value="25">Within 25 km</option>
              <option value="50">Within 50 km</option>
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="flex items-center gap-1.5 w-full lg:w-auto shrink-0 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#15803D]" />
            <span className="text-gray-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-2 bg-[#F8FAF6] border border-slate-200 rounded-xl font-bold text-gray-800 outline-none focus:border-emerald-600"
            >
              <option value="distance">Nearest to Me</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Listings</option>
            </select>
          </div>

          {/* In-stock toggle */}
          <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span className="font-semibold">In Stock Only</span>
          </label>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-[#F8FAF6] border border-slate-200 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'split' ? 'bg-white text-[#15803D] font-bold shadow-xs' : 'text-slate-600'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('products')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'products' ? 'bg-white text-[#15803D] font-bold shadow-xs' : 'text-slate-600'
              }`}
            >
              Listings ({products.length})
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'map' ? 'bg-white text-[#15803D] font-bold shadow-xs' : 'text-slate-600'
              }`}
            >
              Seller Map ({shopsWithDistance.length})
            </button>
          </div>
        </div>

        {/* Row 2: 10 Standard Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition font-medium ${
                selectedCategory === cat
                  ? 'bg-[#15803D] text-white font-bold shadow-xs'
                  : 'bg-[#F8FAF6] text-[#64748B] hover:text-[#1F2937] hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Main Section: Split / Grid / Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Map */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <div className={`${viewMode === 'map' ? 'lg:col-span-12' : 'lg:col-span-6'} sticky top-20`}>
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3 text-xs text-[#64748B]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1F2937]">Agricultural Seller & Depot Map</span>
                  {selectedShopId && (
                    <button
                      onClick={() => setSelectedShopId(null)}
                      className="text-xs text-[#15803D] font-semibold hover:underline"
                    >
                      (Show All Shops)
                    </button>
                  )}
                </div>
                <span>{shopsWithDistance.length} Verified Outposts</span>
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
                    <span className="w-2.5 h-2.5 rounded-full bg-[#15803D]" /> Verified Shops
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" /> Community Outposts
                  </span>
                </div>
                <span className="font-medium text-[11px]">Distances computed via GPS coordinates</span>
              </div>
            </div>
          </div>
        )}

        {/* Right Column: Real Product Listings */}
        {(viewMode === 'split' || viewMode === 'products') && (
          <div className={`${viewMode === 'products' ? 'lg:col-span-12' : 'lg:col-span-6'} space-y-4`}>
            <div className="flex items-center justify-between text-xs text-[#64748B] px-1">
              <span className="font-bold text-[#1F2937]">
                Available Listings ({products.length})
              </span>
              <span>{radiusFilter === 'all' ? 'All Karnataka' : `Within ${radiusFilter} km radius`}</span>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-emerald-800 space-y-2">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-xs font-semibold text-gray-500">Loading marketplace listings...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-[#64748B] space-y-3">
                <Package className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-gray-800">No agricultural products found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Try adjusting the distance radius, removing filters, or be the first farmer to list produce in this area.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setRadiusFilter('all');
                  }}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-4 ${viewMode === 'products' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {products.map((p) => {
                  const isOutOfStock = p.available_quantity <= 0;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProduct(p)}
                      className="group bg-white rounded-2xl border border-slate-200 p-4 hover:border-emerald-600 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between text-xs space-y-3"
                    >
                      <div className="space-y-2.5">
                        {/* Thumbnail & Distance badge */}
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                          <img
                            src={p.image_url || p.images?.[0] || 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=400&q=80'}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          {p.distanceKm != null && (
                            <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-emerald-400" />
                              {p.distanceKm} km
                            </div>
                          )}
                          {p.is_verified_seller && (
                            <div className="absolute top-2 right-2 bg-emerald-700/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-200" />
                              Verified
                            </div>
                          )}
                          {isOutOfStock && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-xs uppercase tracking-wider">
                              Out of Stock
                            </div>
                          )}
                        </div>

                        {/* Title & Category */}
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              {p.category_name}
                            </span>
                            <div className="flex items-center gap-0.5 text-amber-500 font-bold text-[11px]">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>{p.rating_avg || 5.0}</span>
                            </div>
                          </div>
                          <h3 className="font-bold text-gray-900 text-sm mt-1 group-hover:text-emerald-700 transition line-clamp-1">
                            {p.title}
                          </h3>
                        </div>

                        {/* Harvested Produce Details Tag */}
                        {p.is_harvested_produce && (
                          <div className="p-2 bg-amber-50/70 rounded-lg border border-amber-200/60 text-[11px] text-amber-900 space-y-0.5">
                            <p>
                              Variety: <strong>{p.variety || p.crop_name || 'Standard'}</strong> • {p.quality_grade || 'Grade A'}
                            </p>
                            {p.wholesale_price && (
                              <p className="text-gray-500 text-[10px]">
                                Wholesale: ₹{p.wholesale_price}/{p.unit}
                              </p>
                            )}
                          </div>
                        )}

                        <p className="text-gray-500 line-clamp-2 text-[11px] leading-relaxed">{p.description}</p>
                      </div>

                      {/* Pricing, Stock & Add to Cart */}
                      <div className="pt-2 border-t border-gray-100 space-y-2">
                        <div className="flex items-baseline justify-between">
                          <div>
                            <span className="text-base font-black text-emerald-800">₹{p.price}</span>
                            <span className="text-[11px] text-gray-500"> / {p.unit}</span>
                          </div>
                          <span className={`text-[10px] font-semibold ${isOutOfStock ? 'text-red-600' : 'text-gray-500'}`}>
                            {isOutOfStock ? 'Out of stock' : `${p.available_quantity} ${p.unit} left`}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-gray-500 text-[11px]">
                          <span className="truncate max-w-[150px] font-medium text-gray-700">{p.seller_name}</span>
                          <span className="text-emerald-700 font-bold group-hover:translate-x-0.5 transition flex items-center gap-0.5">
                            View Details <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Modals Container */}
      <CartDrawer />

      <CheckoutModal
        onOrderPlaced={() => {
          loadMarketplaceData();
          setShowBuyerDashboard(true);
        }}
        onViewOrders={() => setShowBuyerDashboard(true)}
      />

      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />

      <AddProductModal
        isOpen={showAddProductModal}
        productToEdit={editingProduct}
        onClose={() => {
          setShowAddProductModal(false);
          setEditingProduct(null);
        }}
        onProductCreated={() => {
          loadMarketplaceData();
          setEditingProduct(null);
        }}
      />

      <SuggestShopModal
        isOpen={showSuggestShopModal}
        onClose={() => setShowSuggestShopModal(false)}
        onShopSuggested={() => loadMarketplaceData()}
      />

      <SellerDashboardModal
        isOpen={showSellerDashboard}
        onClose={() => setShowSellerDashboard(false)}
        onOpenAddProduct={() => {
          setEditingProduct(null);
          setShowAddProductModal(true);
        }}
        onEditProduct={(product) => {
          setEditingProduct(product);
          setShowAddProductModal(true);
        }}
      />

      <BuyerDashboardModal
        isOpen={showBuyerDashboard}
        onClose={() => setShowBuyerDashboard(false)}
        onOpenReview={(item, orderId) => {
          setReviewModalData({ product: item, orderId });
        }}
      />

      {reviewModalData && (
        <ReviewModal
          isOpen={Boolean(reviewModalData)}
          onClose={() => setReviewModalData(null)}
          product={reviewModalData.product}
          orderId={reviewModalData.orderId}
          onReviewSubmitted={() => loadMarketplaceData()}
        />
      )}

      {showAdminModal && (
        <AdminMarketplaceModal
          isOpen={showAdminModal}
          onClose={() => setShowAdminModal(false)}
        />
      )}
    </div>
  );
};

export default MarketplacePage;
