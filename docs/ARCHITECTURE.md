# AgriSphere - Architecture Blueprint

## 🏗️ High-Level System Architecture

```
                       +-------------------------------+
                       |    React 18 Frontend (Vite)   |
                       |       (Sharayu's Domain)      |
                       +---------------+---------------+
                                       |
                                HTTP / REST API
                                       |
                       +---------------+---------------+
                       |   Node.js / Express REST API  |
                       |     (Suhas S Pai's Domain)    |
                       +---------------+---------------+
                                       |
                               Supabase Client SDK
                                       |
                       +---------------+---------------+
                       |   Supabase PostgreSQL DB      |
                       |      (Shravya's Domain)       |
                       +-------------------------------+
```

## 🔄 Data Flow Protocol
1. **User Interaction**: User interacts with React components (e.g. clicks on Market Prices or Weather).
2. **State & Service Layer**: React component calls modular Axios functions in `client/src/services/`.
3. **Backend Middleware**: Express API receives HTTP requests at `/api/v1/*`, validates parameters using Zod schemas.
4. **Database Operations**: Controller calls Supabase Client SDK using service keys to query PostgreSQL.
5. **Response Handling**: Formatted JSON response is returned to frontend with consistent error schemas.

