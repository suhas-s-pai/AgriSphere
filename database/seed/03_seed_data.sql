-- ==================================================
-- AGRI SPHERE DEMO SEED DATA
-- Assigned Database Developer: Shravya
-- ==================================================

-- Seed Market Information for Belagavi District
INSERT INTO public.market_information (crop_name, market_location, modal_price, min_price, max_price, unit, price_change_percentage)
VALUES 
('Tomato', 'Belagavi APMC', 25.00, 22.00, 28.00, '₹/kg', 12.00),
('Onion', 'Belagavi APMC', 18.00, 15.00, 20.00, '₹/kg', -5.00),
('Maize', 'Belagavi APMC', 22.00, 20.00, 24.00, '₹/kg', 8.00),
('Rice', 'Belagavi APMC', 28.00, 25.00, 32.00, '₹/kg', 3.00)
ON CONFLICT DO NOTHING;

-- Seed Master Crops Catalog
INSERT INTO public.crops (name, scientific_name, category, sowing_season, duration_days, ideal_soil_type, water_requirement, description)
VALUES
('Tomato', 'Solanum lycopersicum', 'vegetables', 'Kharif / Rabi', 110, 'Red Sandy Loam / Black Soil', 'Moderate', 'High-value vegetable crop widely cultivated in Belagavi.'),
('Sugarcane', 'Saccharum officinarum', 'cash_crops', 'Annual', 365, 'Deep Black Clayey Soil', 'High', 'Major commercial cash crop of North Karnataka.'),
('Cotton', 'Gossypium', 'cash_crops', 'Kharif', 160, 'Black Cotton Soil (Regur)', 'Moderate', 'Fiber crop ideal for deep black soils with good drainage.')
ON CONFLICT DO NOTHING;

