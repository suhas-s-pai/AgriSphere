# AgriSphere - Smart Farming. Better Decisions.

[![License](https://img.shields.io/badge/License-ISC-green.svg)](LICENSE)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Tailwind-emerald)](client/README.md)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-blue)](server/README.md)
[![Database](https://img.shields.io/badge/Database-Supabase%20%7C%20PostgreSQL-teal)](database/README.md)

**AgriSphere** is an agriculture-focused digital platform designed for Indian farmers. It consolidates agricultural knowledge, farming tools, crop advisory, real-time weather updates, APMC market prices, government schemes, and marketplace services into a unified, accessible dashboard interface.

---

## 📌 Problem Statement
Farmers face significant hurdles accessing verified, timely agricultural information, real-time market prices, disease diagnosis tools, and government subsidy details through a single, easy-to-use digital medium.

---

## 🚀 Key Features

- **Responsive Farmer Dashboard**: Inspired by modern clean dashboard design featuring local imagery (`Farmer.png`), left navigation sidebar, and quick weather/market widgets.
- **Crop Information Catalog**: Detailed advisory on crop varieties, sowing seasons, irrigation schedules, and best practices.
- **Weather Advisory**: Belagavi hyper-local temperature, rainfall predictions, and field-work suitability notes.
- **APMC Market Prices**: Mandi rates for Tomato, Onion, Maize, and Rice with price movement indicators.
- **Farming Tools & Calculators**: Seed quantity estimators, NPK fertilizer dosage calculators, and irrigation planners.
- **Diseases & Pest Management**: Symptom guides and organic/chemical treatments.
- **Government Schemes**: Karnataka state and central subsidies, PM-KISAN guidelines, and application links.
- **Knowledge Hub**: Curated agricultural articles and video masterclasses.

---

## 👥 Team Responsibilities

AgriSphere is a college mini-project built by a 3-member team with clear distributed ownership:

| Team Member | Role | Folder Ownership | Primary Focus |
|---|---|---|---|
| **Suhas S Pai** | Backend Developer | `server/` | Express REST API, Business Logic, Validation, Supabase Integration |
| **Sharayu** | Frontend Developer | `client/` | React JSX, Tailwind CSS, UI/UX, Dashboard & Page Views |
| **Shravya** | Database Developer | `database/` | Supabase PostgreSQL Schema, RLS Security, SQL Migrations, Seed Data |

For full collaboration guidelines and branch strategies, see [docs/TEAM_RESPONSIBILITIES.md](docs/TEAM_RESPONSIBILITIES.md).

---

## 🛠️ Technology Stack

- **Frontend**: React.js 18, Vite, Tailwind CSS, Lucide React, React Router DOM v6, Axios
- **Backend**: Node.js, Express.js, Zod validation, CORS, dotenv
- **Database**: Supabase PostgreSQL, Supabase Auth & Storage
- **Deployment Plan**: Render (Free Tier), Supabase (Free Tier)

---

## 💻 How to Setup & Run Locally

### Prerequisites
- Node.js (v18.x or higher)
- npm (v9.x or higher)

### Quick Start
1. Clone the repository:
   ```bash
   git clone https://github.com/your-team/agrisphere.git
   cd agrisphere
   ```

2. Install dependencies for all packages:
   ```bash
   npm run install:all
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` in `client/` and `server/`.

4. Start Frontend & Backend concurrently:
   ```bash
   npm run dev
   ```
   - **Frontend UI**: http://localhost:5173
   - **Backend API**: http://localhost:5000/api/v1/health

---

## 📖 Documentation Directory

Detailed project documentation is available in the [`docs/`](docs/) directory:
- [PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md) - Vision, objectives, and scope
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - System architecture diagram and data flow
- [TEAM_RESPONSIBILITIES.md](docs/TEAM_RESPONSIBILITIES.md) - Member roles & Git workflow
- [API_CONTRACT.md](docs/API_CONTRACT.md) - REST API endpoints and data payloads
- [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) - Database entity relationships & DDL
- [SETUP_GUIDE.md](docs/SETUP_GUIDE.md) - Step-by-step setup guide for developers
- [DEVELOPMENT_ROADMAP.md](docs/DEVELOPMENT_ROADMAP.md) - Feature delivery milestones

