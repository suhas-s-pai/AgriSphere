import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import LeafletMap from '../../components/common/LeafletMap.jsx';

// Demonstration Agricultural Shops & Seller Locations in Belagavi District
const agriShops = [
  {
    id: 'shop-kssc',
    name: 'KSSC Certified Seed Depot',
    type: 'Seed Shop',
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
    name: 'Belagavi Krishi Rasayan & Fertilizers',
    type: 'Fertilizer & Pesticide Shop',
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
    type: 'Bio-Fertilizer Store',
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
    name: 'Basavaraj Patil Farm Harvest Outpost',
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

// Product Listings with Linked Shops
const initialProducts = [
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
    title: 'Neem-Coated Urea & Balanced NPK Fertilizer Bag',
    category: 'Fertilizers',
    price: '₹266.50',
    unit: 'per 45 kg bag (Govt. Subsidized)',
    stock: '250 Bags in stock',
    shopId: 'shop-krishi-rasayan',
    seller: 'Belagavi Krishi Rasayan',
    location: 'Khade Bazar, Belagavi',
    contact: '+91 831 242 7710',
    description: 'High-purity urea with neem oil coating for sustained nitrogen release and minimum leaching losses.',
  },
];

const categories = ['All', 'Seeds', 'Fertilizers', 'Bio-Fertilizers', 'Crop Protection', 'Agri Supplies', 'Produce Listing'];

const MarketplacePage = () => {
  const [products, setProducts] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [viewMode, setViewMode] = useState('split'); // 'split', 'products', 'map'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showListingModal, setShowListingModal] = useState(false);
  const [newListing, setNewListing] = useState({
    title: '',
    category: 'Produce Listing',
    price: '',
    unit: 'per quintal',
    stock: '',
    seller: 'Ramesh Patil',
    location: 'Belagavi Rural',
    contact: '+91 98451 22910',
    description: '',
  });

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
    return agriShops.filter((shop) => {
      const matchesQuery =
        !q ||
        shop.name.toLowerCase().includes(q) ||
        shop.type.toLowerCase().includes(q) ||
        shop.address.toLowerCase().includes(q) ||
        shop.inventory.some((inv) => inv.toLowerCase().includes(q));
      return matchesQuery;
    });
  }, [searchQuery]);

  const mapMarkers = filteredShops.map((shop) => ({
    id: shop.id,
    title: shop.name,
    type: shop.type,
    position: shop.position,
    color: shop.color,
    address: shop.address,
    contact: shop.contact,
    description: `Available: ${shop.inventory.join(', ')}. Hours: ${shop.hours}`,
  }));

  const handleLocateSellerOnMap = (shopId) => {
    setSelectedShopId(shopId);
    if (viewMode === 'products') {
      setViewMode('split');
    }
  };

  const handleAddListing = (e) => {
    e.preventDefault();
    if (!newListing.title || !newListing.price) return;

    setProducts([
      {
        id: `prod-${Date.now()}`,
        shopId: 'shop-patil-produce',
        ...newListing,
      },
      ...products,
    ]);

    setNewListing({
      title: '',
      category: 'Produce Listing',
      price: '',
      unit: 'per quintal',
      stock: '',
      seller: 'Ramesh Patil',
      location: 'Belagavi Rural',
      contact: '+91 98451 22910',
      description: '',
    });
    setShowListingModal(false);
  };

  const activeShop = agriShops.find((s) => s.id === selectedShopId);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md mb-2">
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Agricultural Supplies & Seller Discovery</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14532D]">Marketplace & Seller Map</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Discover seeds, fertilizers, pesticides, agricultural supplies, and direct farm produce with nearby seller locations in Belagavi.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-[#F8FAF6] border border-slate-200 rounded-lg shrink-0">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === 'split' ? 'bg-[#15803D] text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('products')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === 'products' ? 'bg-[#15803D] text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Products List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === 'map' ? 'bg-[#15803D] text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Sellers Map
            </button>
          </div>

          <button
            onClick={() => setShowListingModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#15803D] text-white text-xs font-semibold hover:bg-[#14532D] transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Post Listing</span>
          </button>
        </div>
      </div>

      {/* Demonstration Notice */}
      <div className="bg-[#DCFCE7]/70 rounded-xl border border-emerald-200 p-3.5 flex items-start gap-2.5 text-xs text-[#14532D]">
        <Info className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-bold">Demonstration Seller Directory: </span>
          The shops, seed depots, and produce sellers shown below are representative demonstration locations for Belagavi district to simulate verified merchant discovery until live retail API onboarding.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products (Paddy seeds, Urea, Neem oil) or shops (KSSC, Krishi Rasayan)..."
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

          {selectedShopId && (
            <button
              onClick={() => setSelectedShopId(null)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold shrink-0"
            >
              <span>Filtered by Shop: {activeShop?.name}</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Categories */}
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

      {/* Main Connected Layout: Product List + Seller Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Products Column */}
        {(viewMode === 'split' || viewMode === 'products') && (
          <div
            className={`${
              viewMode === 'products' ? 'lg:col-span-12' : 'lg:col-span-6'
            } space-y-4`}
          >
            <div className="flex items-center justify-between text-xs text-[#64748B] px-1">
              <span className="font-semibold text-[#1F2937]">
                Available Products ({filteredProducts.length})
              </span>
              <span>Click a seller to see location on map</span>
            </div>

            <div
              className={`grid gap-4 ${
                viewMode === 'products'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}
            >
              {filteredProducts.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 p-4.5 hover:border-[#15803D] transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{item.stock}</span>
                    </div>

                    <h3 className="text-base font-bold text-[#1F2937] mt-2 leading-snug">
                      {item.title}
                    </h3>

                    <div className="mt-2.5 flex items-baseline gap-1.5">
                      <span className="text-lg font-bold text-[#14532D]">{item.price}</span>
                      <span className="text-xs text-[#64748B]">{item.unit}</span>
                    </div>

                    <p className="text-xs text-[#64748B] mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Linked Seller Row */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <button
                        onClick={() => handleLocateSellerOnMap(item.shopId)}
                        className="text-left group flex items-center gap-1.5 text-[#15803D] font-semibold hover:underline"
                        title="View on Map"
                      >
                        <Store className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate max-w-[180px]">{item.seller}</span>
                      </button>

                      <span className="text-slate-400 text-[11px] flex items-center gap-0.5">
                        <MapPin className="w-3 h-3" />
                        {item.location}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedProduct(item)}
                      className="text-xs font-semibold text-[#15803D] hover:underline"
                    >
                      View Details
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLocateSellerOnMap(item.shopId)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-[#1F2937] hover:bg-slate-50 font-medium inline-flex items-center gap-1"
                      >
                        <MapIcon className="w-3 h-3 text-[#15803D]" />
                        <span>Map</span>
                      </button>

                      <a
                        href={`tel:${item.contact}`}
                        className="px-3 py-1.5 rounded-lg bg-[#15803D] text-white text-xs font-semibold hover:bg-[#14532D] transition-colors"
                      >
                        Call
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-[#64748B]">
                <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#1F2937]">No products match your query</p>
                <p className="text-xs text-slate-400 mt-1">Try resetting the category filter or searching a different term.</p>
              </div>
            )}
          </div>
        )}

        {/* Map & Shops Column */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <div
            className={`${
              viewMode === 'map' ? 'lg:col-span-12' : 'lg:col-span-6'
            } bg-white rounded-xl border border-slate-200 p-5 space-y-4 sticky top-20`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-[#14532D]">
                  Nearby Agri Shops & Sellers Map
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Locate licensed seed depots, fertilizer stores, and produce outposts across Belagavi.
                </p>
              </div>
              <span className="text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md">
                {filteredShops.length} Sellers Marked
              </span>
            </div>

            {/* Leaflet Map */}
            <LeafletMap
              center={
                selectedShopId
                  ? agriShops.find((s) => s.id === selectedShopId)?.position
                  : [15.8542, 74.5062]
              }
              zoom={selectedShopId ? 14 : 12}
              markers={mapMarkers}
              selectedId={selectedShopId}
              onSelectMarker={(shop) => setSelectedShopId(shop.id)}
              height={viewMode === 'map' ? '500px' : '380px'}
            />

            {/* Map Legend */}
            <div className="flex flex-wrap items-center justify-between text-xs text-[#64748B] gap-2 pt-1 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#15803D]" /> Seeds
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" /> Fertilizers
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" /> Pesticides
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0D9488]" /> Supplies
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" /> Produce
                </span>
              </div>
              <span>Click pin for phone & directions</span>
            </div>

            {/* Shops List Accordion / Directory */}
            <div className="space-y-2 pt-2 max-h-60 overflow-y-auto pr-1">
              {filteredShops.map((shop) => {
                const isSelected = selectedShopId === shop.id;
                return (
                  <div
                    key={shop.id}
                    onClick={() => setSelectedShopId(shop.id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#DCFCE7]/60 border-[#15803D] ring-1 ring-[#15803D]'
                        : 'bg-[#F8FAF6] border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span
                          className="inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded"
                          style={{ backgroundColor: '#FFFFFF', color: shop.color, border: '1px solid #E2E8F0' }}
                        >
                          {shop.type}
                        </span>
                        <h4 className="text-xs font-bold text-[#1F2937] mt-1">{shop.name}</h4>
                      </div>

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${shop.position[0]},${shop.position[1]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#15803D] font-semibold hover:underline inline-flex items-center gap-0.5 shrink-0"
                      >
                        Directions <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <p className="text-[#64748B] mt-1 line-clamp-1">{shop.address}</p>
                    <div className="mt-1 flex items-center justify-between text-slate-500 text-[11px]">
                      <span>📞 {shop.contact}</span>
                      <span className="text-[10px] text-slate-400">{shop.hours}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-xl border border-slate-200 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded">
                  {selectedProduct.category}
                </span>
                <h2 className="text-base font-bold text-[#1F2937] mt-1.5">{selectedProduct.title}</h2>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 bg-[#DCFCE7]/60 rounded-lg border border-emerald-200 flex items-baseline justify-between">
                <div>
                  <span className="text-xl font-bold text-[#14532D]">{selectedProduct.price}</span>
                  <span className="text-xs text-[#15803D] ml-1">{selectedProduct.unit}</span>
                </div>
                <span className="text-xs text-[#14532D] font-semibold">{selectedProduct.stock}</span>
              </div>

              <div>
                <span className="font-semibold text-[#1F2937] block mb-0.5">Product Description:</span>
                <p className="text-[#64748B] leading-relaxed">{selectedProduct.description}</p>
              </div>

              <div className="p-3 bg-[#F8FAF6] rounded-lg border border-slate-200 space-y-1.5">
                <span className="font-bold text-[#1F2937] block">Seller Details & Shop Location</span>
                <div className="flex justify-between text-[#64748B]">
                  <span>Shop Name:</span>
                  <span className="font-semibold text-[#1F2937]">{selectedProduct.seller}</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Location:</span>
                  <span>{selectedProduct.location}</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Contact:</span>
                  <span className="font-semibold text-[#15803D]">{selectedProduct.contact}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  handleLocateSellerOnMap(selectedProduct.shopId);
                  setSelectedProduct(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] hover:underline"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Locate Shop on Map</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-xs"
                >
                  Close
                </button>
                <a
                  href={`tel:${selectedProduct.contact}`}
                  className="px-4 py-1.5 rounded-lg bg-[#15803D] text-white text-xs font-semibold hover:bg-[#14532D]"
                >
                  Call Shop
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Listing Modal */}
      {showListingModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowListingModal(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-xl border border-slate-200 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1F2937]">Post Agricultural Produce or Supply</h3>
              <button
                onClick={() => setShowListingModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddListing} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sona Masoori Paddy (50 Bags) or Bio-Compost"
                  value={newListing.title}
                  onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#15803D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">Category</label>
                  <select
                    value={newListing.category}
                    onChange={(e) => setNewListing({ ...newListing, category: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#15803D] bg-white"
                  >
                    <option>Produce Listing</option>
                    <option>Seeds</option>
                    <option>Fertilizers</option>
                    <option>Bio-Fertilizers</option>
                    <option>Crop Protection</option>
                    <option>Agri Supplies</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">Price (₹)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹2,200"
                    value={newListing.price}
                    onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#15803D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">Unit</label>
                  <input
                    type="text"
                    placeholder="per quintal / bag / bottle"
                    value={newListing.unit}
                    onChange={(e) => setNewListing({ ...newListing, unit: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#15803D]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">Quantity / Stock</label>
                  <input
                    type="text"
                    placeholder="e.g. 50 Quintals / 20 Bags"
                    value={newListing.stock}
                    onChange={(e) => setNewListing({ ...newListing, stock: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#15803D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">Short Description</label>
                <textarea
                  rows="2"
                  placeholder="Describe produce quality, moisture level, or fertilizer composition..."
                  value={newListing.description}
                  onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#15803D]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowListingModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#15803D] text-white font-medium hover:bg-[#14532D]"
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
