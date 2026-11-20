-- ============================================================================
-- AGRI SPHERE MARKETPLACE DATABASE SCHEMA (SUPABASE / POSTGRESQL)
-- Migration 04: Marketplace Core E-Commerce & Location Architecture
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. SELLER PROFILES (Farmers, Agricultural Shops, FPOs, Suppliers)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.seller_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    seller_type VARCHAR(50) NOT NULL CHECK (seller_type IN ('farmer', 'shop', 'fpo', 'supplier')),
    business_name VARCHAR(150) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    address TEXT NOT NULL,
    village VARCHAR(100),
    taluk VARCHAR(100),
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'Karnataka',
    pincode VARCHAR(10) NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    gstin VARCHAR(30),
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
    verification_notes TEXT,
    is_verified_badge BOOLEAN DEFAULT FALSE,
    bank_account_number VARCHAR(50),
    bank_ifsc VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. SELLER VERIFICATION DOCUMENTS (KYC, Land RTC, GST, FPO Papers)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.seller_verification_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES public.seller_profiles(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('aadhaar', 'pan', 'rtc_pahani', 'trade_license', 'gst_certificate', 'fpo_registration', 'other')),
    document_url TEXT NOT NULL,
    document_name VARCHAR(255),
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'verified', 'rejected')),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. MARKETPLACE CATEGORIES (10 Standardized Categories)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marketplace_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(60) UNIQUE NOT NULL,
    name VARCHAR(120) UNIQUE NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. MARKETPLACE PRODUCTS (Standard Products & Harvested Farm Produce)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marketplace_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES public.seller_profiles(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.marketplace_categories(id) ON DELETE RESTRICT,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    unit VARCHAR(50) NOT NULL, -- e.g. 'kg', 'quintal', 'litre', 'bag', 'piece'
    min_order_quantity NUMERIC(10, 2) DEFAULT 1.0 CHECK (min_order_quantity > 0),
    status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock', 'moderation_flagged')),
    location_district VARCHAR(100) NOT NULL,
    location_state VARCHAR(100) NOT NULL DEFAULT 'Karnataka',
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    contact_number VARCHAR(20) NOT NULL,
    
    -- Specific fields for Harvested Crops and Farm Produce
    is_harvested_produce BOOLEAN DEFAULT FALSE,
    crop_name VARCHAR(100),
    variety VARCHAR(100),
    quality_grade VARCHAR(50), -- e.g. 'Grade A', 'Grade B', 'Export Quality'
    harvest_date DATE,
    moisture_percentage NUMERIC(5, 2),
    wholesale_price NUMERIC(12, 2),
    retail_price NUMERIC(12, 2),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. PRODUCT IMAGES (Supabase Storage Hosted)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. INVENTORY MANAGEMENT (Real-time Stock & Reservation Tracking)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.marketplace_products(id) ON DELETE CASCADE UNIQUE,
    stock_quantity NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold NUMERIC(10, 2) DEFAULT 5.0,
    reserved_quantity NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
    last_restocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. CART ITEMS (Authenticated Persistent Shopping Cart)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
    quantity NUMERIC(10, 2) NOT NULL DEFAULT 1.0 CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_product_cart UNIQUE(user_id, product_id)
);

-- ----------------------------------------------------------------------------
-- 8. DELIVERY ADDRESSES (Customer Shipping Profiles)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.delivery_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    landmark VARCHAR(150),
    village_city VARCHAR(100) NOT NULL,
    taluk VARCHAR(100),
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'Karnataka',
    pincode VARCHAR(10) NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 9. MARKETPLACE ORDERS (Multi-item Order Lifecycle)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marketplace_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(32) UNIQUE NOT NULL, -- e.g. 'AGRI-2026-XXXXX'
    buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    seller_id UUID NOT NULL REFERENCES public.seller_profiles(id) ON DELETE RESTRICT,
    delivery_address_id UUID REFERENCES public.delivery_addresses(id) ON DELETE SET NULL,
    shipping_address_snapshot JSONB NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    delivery_charges NUMERIC(10, 2) NOT NULL DEFAULT 0.0 CHECK (delivery_charges >= 0),
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.0 CHECK (tax_amount >= 0),
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    delivery_type VARCHAR(30) DEFAULT 'local_delivery' CHECK (delivery_type IN ('seller_pickup', 'local_delivery', 'buyer_pickup')),
    order_status VARCHAR(30) DEFAULT 'order_placed' CHECK (order_status IN (
        'order_placed',
        'order_confirmed',
        'processing',
        'ready_for_dispatch',
        'shipped',
        'delivered',
        'cancelled',
        'refund_initiated',
        'refunded'
    )),
    cancellation_reason TEXT,
    cancelled_by UUID REFERENCES public.profiles(id),
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 10. ORDER ITEMS (Line Items Snapshot)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marketplace_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.marketplace_orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.marketplace_products(id) ON DELETE SET NULL,
    product_title VARCHAR(200) NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
    unit VARCHAR(50) NOT NULL,
    total_price NUMERIC(12, 2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 11. MARKETPLACE PAYMENTS (Razorpay & Cash on Delivery Tracking)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marketplace_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.marketplace_orders(id) ON DELETE RESTRICT,
    payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('upi', 'card', 'netbanking', 'cod')),
    gateway_provider VARCHAR(30) DEFAULT 'razorpay' CHECK (gateway_provider IN ('razorpay', 'cod', 'cash')),
    gateway_order_id VARCHAR(100),
    gateway_payment_id VARCHAR(100),
    gateway_signature VARCHAR(255),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    currency VARCHAR(10) DEFAULT 'INR',
    payment_status VARCHAR(30) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'authorized', 'captured', 'failed', 'refunded')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 12. MARKETPLACE REVIEWS (Verified Purchase Feedback)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marketplace_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES public.marketplace_orders(id) ON DELETE RESTRICT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_reported BOOLEAN DEFAULT FALSE,
    report_reason TEXT,
    is_moderated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_order_product_review UNIQUE(order_id, product_id, buyer_id)
);

-- ----------------------------------------------------------------------------
-- 13. MARKETPLACE SHOPS & COOPERATIVE HUBS (Verified Location Directory)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marketplace_shops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'Seeds',
        'Fertilizers',
        'Bio-Fertilizers',
        'Pesticides',
        'Machinery',
        'Equipment',
        'Supplies',
        'APMC',
        'FPO',
        'Produce'
    )),
    shop_type VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'Karnataka',
    pincode VARCHAR(10),
    contact VARCHAR(50),
    operating_hours VARCHAR(100),
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_source VARCHAR(120),
    inventory_summary TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- PERFORMANCE INDEXES
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_category ON public.marketplace_products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_seller ON public.marketplace_products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_district ON public.marketplace_products(location_district);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.marketplace_products(status);
CREATE INDEX IF NOT EXISTS idx_products_coords ON public.marketplace_products(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_inventory_product ON public.inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_user ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON public.marketplace_orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON public.marketplace_orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.marketplace_orders(order_status);

CREATE INDEX IF NOT EXISTS idx_shops_category ON public.marketplace_shops(category);
CREATE INDEX IF NOT EXISTS idx_shops_district ON public.marketplace_shops(district);
CREATE INDEX IF NOT EXISTS idx_shops_coords ON public.marketplace_shops(latitude, longitude);

-- ----------------------------------------------------------------------------
-- TRIGGERS: AUTO-INITIALIZE INVENTORY ON PRODUCT CREATION
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_product_inventory()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.inventory (product_id, stock_quantity, low_stock_threshold)
    VALUES (NEW.id, 0, 5)
    ON CONFLICT (product_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_new_product_inventory ON public.marketplace_products;
CREATE TRIGGER trigger_new_product_inventory
AFTER INSERT ON public.marketplace_products
FOR EACH ROW EXECUTE FUNCTION public.handle_new_product_inventory();

-- ----------------------------------------------------------------------------
-- TRIGGERS: AUTO-UPDATE PRODUCT STATUS ON INVENTORY DEPLETION
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sync_product_stock_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock_quantity <= 0 THEN
        UPDATE public.marketplace_products
        SET status = 'out_of_stock', updated_at = NOW()
        WHERE id = NEW.product_id AND status = 'active';
    ELSIF NEW.stock_quantity > 0 THEN
        UPDATE public.marketplace_products
        SET status = 'active', updated_at = NOW()
        WHERE id = NEW.product_id AND status = 'out_of_stock';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sync_product_stock_status ON public.inventory;
CREATE TRIGGER trigger_sync_product_stock_status
AFTER UPDATE OF stock_quantity ON public.inventory
FOR EACH ROW EXECUTE FUNCTION public.sync_product_stock_status();
