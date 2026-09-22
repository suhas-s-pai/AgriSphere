# AgriSphere - Frontend Application (`client/`)

**Assigned Developer:** Sharayu (Frontend Developer)

## 📌 Overview
The AgriSphere frontend is a React single-page application built with **Vite**, **Tailwind CSS**, and **Lucide React** icons. It provides a clean, modern, and agriculture-themed dashboard interface tailored for Indian farmers.

## 🛠️ Technology Stack
- **Framework**: React.js 18 (JSX)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **HTTP Client**: Axios

## 📂 Key Directory Structure
```
client/
├── public/
│   └── assets/
│       └── Farmer.png          # Hero banner background asset
├── src/
│   ├── assets/                 # Component assets
│   ├── components/
│   │   ├── common/             # Reusable UI widgets (PlaceholderPage)
│   │   ├── layout/             # MainLayout, Header, Sidebar
│   │   └── dashboard/          # HeroBanner, ExploreFeatures, WeatherPanel, etc.
│   ├── pages/                  # Route views (dashboard, crops, weather, etc.)
│   ├── services/               # Axios API client setup (api.js)
│   ├── App.jsx                 # Central router definition
│   ├── index.css               # Tailwind CSS imports & global styles
│   └── main.jsx                # React DOM root entry
├── package.json
└── vite.config.js
```

## 🚀 Development Workflow
1. Navigate to the `client/` folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the web app in your browser at `http://localhost:5173`.

