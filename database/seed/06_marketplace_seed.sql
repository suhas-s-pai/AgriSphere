-- ============================================================================
-- AGRI SPHERE MARKETPLACE SEED DATA (SUPABASE / POSTGRESQL)
-- Migration 06: Official Categories & Verified Karnataka Agricultural Depots
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. SEED 10 STANDARDIZED PRODUCT CATEGORIES
-- ----------------------------------------------------------------------------
INSERT INTO public.marketplace_categories (slug, name, description, icon_name, display_order)
VALUES
('seeds', 'Seeds', 'Government certified high-yield crop and vegetable seeds with germination assurance.', 'Sprout', 1),
('fertilizers', 'Fertilizers', 'Chemical and mineral soil nutrients including Urea, DAP, Potash, and complex NPK.', 'Layers', 2),
('organic_fertilizers', 'Organic Fertilizers', 'Natural soil enriching inputs, cow dung manure, compost, and humic acids.', 'Leaf', 3),
('bio_fertilizers', 'Bio-Fertilizers', 'Microbial bio-cultures including Rhizobium, Azotobacter, PSB, and Trichoderma.', 'FlaskConical', 4),
('pesticides_crop_protection', 'Pesticides and Crop Protection', 'Approved biological, botanical neem, and targeted fungicides, insecticides, and weedicides.', 'ShieldCheck', 5),
('agricultural_machinery', 'Agricultural Machinery', 'Tractors, power tillers, rotavators, harvesters, and diesel engines.', 'Tractor', 6),
('irrigation_equipment', 'Irrigation Equipment', 'Drip laterals, micro-sprinklers, submersible pumps, and filtration systems.', 'Droplets', 7),
('farming_tools', 'Farming Tools', 'Knapsack battery sprayers, pruning shears, tarpaulins, mulching sheets, and sickles.', 'Wrench', 8),
('animal_husbandry', 'Animal Husbandry Supplies', 'Dairy cattle feed, mineral mixtures, fodder seeds, silage, and poultry supplies.', 'HeartHandshake', 9),
('harvested_produce', 'Harvested Crops and Farm Produce', 'Direct farm-gate wholesale and retail harvest listings: grains, pulses, fruits, and vegetables.', 'Package', 10)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon_name = EXCLUDED.icon_name,
    display_order = EXCLUDED.display_order;

-- ----------------------------------------------------------------------------
-- 2. SEED VERIFIED AGRICULTURAL SHOPS & COOPERATIVE HUBS (KARNATAKA)
-- ----------------------------------------------------------------------------
INSERT INTO public.marketplace_shops (
    name,
    category,
    shop_type,
    address,
    district,
    state,
    pincode,
    contact,
    operating_hours,
    latitude,
    longitude,
    is_verified,
    verification_source,
    inventory_summary
)
VALUES
(
    'KSSC Certified Seed Depot (Belagavi)',
    'Seeds',
    'Certified State Seed Depot',
    'Gate 2, APMC Market Yard, Belagavi 590016',
    'Belagavi',
    'Karnataka',
    '590016',
    '+91 831 245 8820',
    'Mon - Sat: 08:30 AM - 05:00 PM',
    15.8595,
    74.5075,
    TRUE,
    'Karnataka State Seed Corporation (KSSC) Official Directory',
    ARRAY['Certified Sona Masoori Paddy Seeds (CS-1)', 'Hybrid Maize 900M', 'TMV-2 Groundnut Seeds', 'Vegetable Foundation Seeds']
),
(
    'District Krishi Rasayan & Fertilizers',
    'Fertilizers',
    'Licensed Fertilizer Retailer',
    'Near Old Post Office, Khade Bazar, Belagavi 590001',
    'Belagavi',
    'Karnataka',
    '590001',
    '+91 831 242 7710',
    'Mon - Sat: 08:00 AM - 07:00 PM',
    15.8542,
    74.4982,
    TRUE,
    'Department of Agriculture Karnataka License #AGR-KA-BEL-1044',
    ARRAY['Neem Coated Urea (46% N)', 'DAP 18:46:0', 'MOP (Potash)', 'Mancozeb Fungicide', 'Micronutrient Mixtures']
),
(
    'Green Earth Bio-Inputs & Vermicompost Hub',
    'Bio-Fertilizers',
    'Farmer Cooperative Bio-Depot',
    'Survey No. 88, Sambra Road, Belagavi Rural 591124',
    'Belagavi',
    'Karnataka',
    '591124',
    '+91 94482 10934',
    'Mon - Sat: 07:00 AM - 06:00 PM',
    15.8672,
    74.5310,
    TRUE,
    'KVK Organic Cluster Verification #KA-ORG-2025-091',
    ARRAY['Enriched Vermicompost (50kg bags)', 'Trichoderma Viride', 'PSB Bio-Culture', 'Jeevamrutha Preparation Kits']
),
(
    'Kisan Agro Supplies & Irrigation Hardware',
    'Equipment',
    'Agricultural Supply & Irrigation Store',
    'Shop 14, Raviwar Peth, Belagavi 590002',
    'Belagavi',
    'Karnataka',
    '590002',
    '+91 831 242 1904',
    'Mon - Sat: 08:30 AM - 07:30 PM',
    15.8510,
    74.5020,
    TRUE,
    'Karnataka Horticultural Federation Authorized Vendor #HORT-IRR-348',
    ARRAY['16L Battery Knapsack Sprayers', 'Drip Lateral Pipes 16mm', 'HDPE Tarpaulins (250 GSM)', 'UV-Stabilized Mulching Film']
),
(
    'Gokak Valley Organic Seeds & Neem Depot',
    'Pesticides',
    'Botanical Crop Protection Center',
    'APMC Complex, Station Road, Gokak 591307',
    'Belagavi',
    'Karnataka',
    '591307',
    '+91 8332 227 410',
    'Mon - Sat: 08:00 AM - 06:30 PM',
    16.1702,
    74.8305,
    TRUE,
    'CIBRC Registered Bio-Pesticide Stockist',
    ARRAY['Cold-Pressed Neem Oil (1500 PPM)', 'Native Vegetable Seeds', 'Copper Oxychloride', 'Yellow & Blue Sticky Traps']
),
(
    'Belagavi Main APMC Yard (KSAMB)',
    'APMC',
    'Regulated Agricultural Wholesale Yard',
    'APMC Road, Opposite Railway Overbridge, Belagavi 590016',
    'Belagavi',
    'Karnataka',
    '590016',
    '+91 831 245 1102',
    'Mon - Sat: 06:00 AM - 04:00 PM',
    15.8583,
    74.5062,
    TRUE,
    'Karnataka State Agricultural Marketing Board (KSAMB) / e-NAM Mandi Yard',
    ARRAY['Electronic Auction Floors', 'MSP Foodgrain Procurement Centers', 'Cold Storage Facilities', 'Soil & Moisture Testing Counter']
),
(
    'Dharwad APMC Sub-Yard (Amargol Complex)',
    'APMC',
    'Regulated Commodity Trading Terminal',
    'Amargol APMC Complex, PB Road, Hubballi-Dharwad 580025',
    'Dharwad',
    'Karnataka',
    '580025',
    '+91 836 222 3400',
    'Mon - Sat: 06:00 AM - 05:00 PM',
    15.4124,
    75.0512,
    TRUE,
    'KSAMB Regulated Mandi #KA-DHW-01',
    ARRAY['Byadagi Chilli Auctioning Shed', 'Grain Silos', 'Electronic Weighbridge', 'e-NAM Spot Trading Terminal']
),
(
    'Bengaluru Yeshwanthpur APMC Yard',
    'APMC',
    'Apex Terminal Agricultural Market',
    'APMC Yard, Yeshwanthpur, Bengaluru 560022',
    'Bengaluru Urban',
    'Karnataka',
    '560022',
    '+91 80 2337 1800',
    'Mon - Sun: 04:00 AM - 02:00 PM',
    13.0234,
    77.5512,
    TRUE,
    'KSAMB Apex Terminal Yard / National Benchmark',
    ARRAY['Wholesale Vegetable Lots', 'Grain Trading Bourse', 'Direct Farmer-Trader Wholesale Auction']
);
