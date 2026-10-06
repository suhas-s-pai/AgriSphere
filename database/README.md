# AgriSphere - Supabase PostgreSQL Database (`database/`)

**Assigned Lead Developer:** Shravya (Database Developer)

## 📌 Overview
The database layer for AgriSphere uses **Supabase** running managed **PostgreSQL**. The schema defines 8 relational tables, Row Level Security (RLS) policies, indexes for query optimization, and seed data for local testing.

## 🗄️ Core Tables & Ownership
1. `profiles`: Farmer profile and preference details.
2. `crops`: Master catalog of crops, growth cycles, and soil preferences.
3. `crop_tasks`: Individual farmer field activity logs and reminders.
4. `soil_records`: NPK, pH, and organic carbon test logs.
5. `knowledge_articles`: Cultivation literature and expert guides.
6. `market_information`: APMC Mandi daily modal prices and trends.
7. `resources`: Government scheme requirements and calculator models.
8. `notifications`: System advisories and weather alerts.

## 📁 Migration SQL File Structure
```
database/
├── schema/
│   └── 01_schema.sql           # Table definitions & DDL statements
├── policies/
│   └── 02_rls_policies.sql     # Supabase Row Level Security policies
├── seed/
│   └── 03_seed_data.sql        # Demo data for APMC prices & crops
└── README.md
```

## 🔐 Security Principles
- All tables enforce Row Level Security (RLS).
- User IDs match `auth.users(id)` from Supabase Authentication.
- Sensitive credentials and service keys are kept strictly in `.env`.

