-- ==================================================
-- AGRI SPHERE POSTGRESQL DATABASE SCHEMA (SUPABASE)
-- Assigned Database Developer: Shravya
-- ==================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------
-- 1. PROFILES TABLE (Farmer User Profiles)
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(30) DEFAULT 'farmer' CHECK (role IN ('farmer', 'expert', 'admin', 'trader')),
    district VARCHAR(100) DEFAULT 'Belagavi',
    state VARCHAR(100) DEFAULT 'Karnataka',
    pincode VARCHAR(10),
    primary_crops TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------
-- 2. CROPS TABLE (Master Catalog of Crops)
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    scientific_name VARCHAR(100),
    category VARCHAR(50) NOT NULL CHECK (category IN ('cereals', 'pulses', 'vegetables', 'fruits', 'cash_crops', 'spices')),
    sowing_season VARCHAR(50) NOT NULL,
    duration_days INT NOT NULL,
    ideal_soil_type VARCHAR(100),
    water_requirement VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------
-- 3. CROP TASKS TABLE (Farm Task Management)
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crop_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    crop_id UUID REFERENCES public.crops(id) ON DELETE SET NULL,
    task_name VARCHAR(200) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------
-- 4. SOIL RECORDS TABLE (Soil Health & Testing)
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS public.soil_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    ph_level NUMERIC(3, 2),
    nitrogen_level NUMERIC(6, 2),
    phosphorus_level NUMERIC(6, 2),
    potassium_level NUMERIC(6, 2),
    organic_carbon NUMERIC(4, 2),
    test_date DATE DEFAULT CURRENT_DATE,
    recommendations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------
-- 5. KNOWLEDGE ARTICLES TABLE (Farming Guides)
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS public.knowledge_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    author_name VARCHAR(100) DEFAULT 'AgriSphere Expert',
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------
-- 6. MARKET INFORMATION TABLE (APMC Prices)
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS public.market_information (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_name VARCHAR(100) NOT NULL,
    market_location VARCHAR(100) NOT NULL,
    modal_price NUMERIC(10, 2) NOT NULL,
    min_price NUMERIC(10, 2),
    max_price NUMERIC(10, 2),
    unit VARCHAR(20) DEFAULT '₹/kg',
    price_change_percentage NUMERIC(5, 2) DEFAULT 0.0,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------
-- 7. RESOURCES TABLE (Government Schemes & Tools)
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    resource_type VARCHAR(50) CHECK (resource_type IN ('scheme', 'tool', 'calculator', 'subsidy')),
    eligibility TEXT,
    application_link VARCHAR(550),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------
-- 8. NOTIFICATIONS TABLE (Alerts & Advisories)
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    alert_type VARCHAR(50) CHECK (alert_type IN ('weather', 'market', 'scheme', 'general')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- --------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_market_location ON public.market_information(market_location);
CREATE INDEX IF NOT EXISTS idx_crop_tasks_user ON public.crop_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

