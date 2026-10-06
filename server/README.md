# AgriSphere - Backend REST API (`server/`)

**Assigned Lead Developer:** Suhas S Pai (Backend Developer)

## 📌 Overview
The AgriSphere backend is an Express.js REST API providing business logic, request validation, Supabase integration, and data services for the AgriSphere platform.

## 🛠️ Technology Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Validation**: Zod
- **Environment Management**: dotenv
- **CORS Management**: cors

## 📂 Backend Architecture
```
server/
├── src/
│   ├── config/          # Configuration files (Supabase client, env constants)
│   ├── controllers/     # Request handlers (Crops, Weather, Market, Auth)
│   ├── middleware/      # Error handler, Cors, Authentication
│   ├── routes/          # Express Routers (v1 API routes)
│   ├── services/        # Business logic & Supabase database calls
│   ├── validators/      # Zod validation schemas
│   ├── utils/           # Helper functions & formatters
│   ├── app.js           # Express app initialization
│   └── server.js        # Server listener
├── tests/               # Backend tests
└── package.json
```

## 🚀 How to Run Backend
1. Navigate to `server/`:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the API server:
   ```bash
   npm start
   ```
   Or for live reloading:
   ```bash
   npm run dev
   ```
4. Test health endpoint: `GET http://localhost:5000/api/v1/health`

