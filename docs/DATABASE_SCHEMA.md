# AgriSphere - Database Schema Documentation

## 📊 Entity Relationship Summary

AgriSphere database consists of 8 core system tables and 13 specialized marketplace tables hosted on Supabase PostgreSQL:

### Core Agricultural Tables
1. **`profiles`**: Extends `auth.users`, stores user role (`farmer`, `expert`, `admin`, `trader`), district, and crop preferences.
2. **`crops`**: Master catalog of crops, growth cycles, and soil preferences.
3. **`crop_tasks`**: Tasks assigned per farmer profile with due dates.
4. **`soil_records`**: NPK and pH test history per farmer.
5. **`knowledge_articles`**: Informational articles and guides.
6. **`market_information`**: Mandi location, prices, and price movements.
7. **`resources`**: Subsidies, calculators, and government links.
8. **`notifications`**: Weather and market alert log per user.

### Marketplace E-Commerce Tables (Migration 04)
9. **`seller_profiles`**: Registered sellers (Farmers, Agricultural Shops, FPOs, Suppliers) with KYC verification status (`pending`, `approved`, `rejected`), bank details, and GPS coordinates.
10. **`seller_verification_documents`**: Verification documents (Aadhaar, PAN, Land RTC/Pahani, Trade License, GST, FPO Papers) uploaded to Supabase Storage.
11. **`marketplace_categories`**: 10 official categories (Seeds, Fertilizers, Organic Fertilizers, Bio-Fertilizers, Pesticides & Crop Protection, Agricultural Machinery, Irrigation Equipment, Farming Tools, Animal Husbandry Supplies, Harvested Crops & Farm Produce).
12. **`marketplace_products`**: Product listings supporting both input supplies and direct farm-gate harvested produce (variety, grade, harvest date, moisture percentage, wholesale/retail pricing).
13. **`product_images`**: Multi-image gallery per product linked to Supabase Storage.
14. **`inventory`**: Real-time stock tracking, reservation tracking, low-stock threshold, and automated out-of-stock trigger sync.
15. **`cart_items`**: User shopping cart synchronized with backend database for persistence across sessions.
16. **`delivery_addresses`**: Buyer shipping addresses with taluk, district, and optional coordinates.
17. **`marketplace_orders`**: Multi-item orders with lifecycle status tracking (`order_placed` -> `delivered` / `refunded`), address snapshot, and delivery type.
18. **`marketplace_order_items`**: Immutable line items captured at the time of order placement.
19. **`marketplace_payments`**: Razorpay gateway orders, payment IDs, verification signatures, payment status, and Cash on Delivery (COD) tracking.
20. **`marketplace_reviews`**: Verified-purchase 1–5 star reviews and moderation reports.
21. **`marketplace_shops`**: Verified agricultural depots, seed corporations, cooperative hubs, and APMC yards with exact locations and inventory summaries.

---

## 📜 Migration Files
- Core Schema: [`database/schema/01_schema.sql`](../database/schema/01_schema.sql)
- Core RLS Policies: [`database/policies/02_rls_policies.sql`](../database/policies/02_rls_policies.sql)
- Core Seed Data: [`database/seed/03_seed_data.sql`](../database/seed/03_seed_data.sql)
- **Marketplace Schema**: [`database/schema/04_marketplace_schema.sql`](../database/schema/04_marketplace_schema.sql)
- **Marketplace RLS Policies**: [`database/policies/05_marketplace_rls.sql`](../database/policies/05_marketplace_rls.sql)
- **Marketplace Seed Data**: [`database/seed/06_marketplace_seed.sql`](../database/seed/06_marketplace_seed.sql)
