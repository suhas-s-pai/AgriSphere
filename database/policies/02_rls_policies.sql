-- ==================================================
-- AGRI SPHERE ROW LEVEL SECURITY (RLS) POLICIES
-- Assigned Database Developer: Shravya
-- ==================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soil_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_information ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------
-- 1. PROFILES POLICIES
-- --------------------------------------------------
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- --------------------------------------------------
-- 2. CROPS POLICIES (Public Read)
-- --------------------------------------------------
CREATE POLICY "Crops catalog viewable by anyone" 
ON public.crops FOR SELECT USING (true);

-- --------------------------------------------------
-- 3. CROP TASKS POLICIES (Private to Owner)
-- --------------------------------------------------
CREATE POLICY "Users can view their own crop tasks" 
ON public.crop_tasks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own crop tasks" 
ON public.crop_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own crop tasks" 
ON public.crop_tasks FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own crop tasks" 
ON public.crop_tasks FOR DELETE USING (auth.uid() = user_id);

-- --------------------------------------------------
-- 4. MARKET INFORMATION & KNOWLEDGE ARTICLES (Public Read)
-- --------------------------------------------------
CREATE POLICY "Market data viewable by everyone" 
ON public.market_information FOR SELECT USING (true);

CREATE POLICY "Knowledge articles viewable by everyone" 
ON public.knowledge_articles FOR SELECT USING (true);


