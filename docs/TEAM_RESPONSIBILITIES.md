# AgriSphere - Team Responsibilities & Git Workflow

## 👥 Member Roles & File Ownership

### 1. Suhas S Pai — Lead Backend Developer
- **Directory Ownership**: `server/`
- **Key Responsibilities**: Node.js & Express API development, route handlers, error handling, Zod validation schemas, CORS, integration with Supabase SDK.
- **Rules**: Avoid modifying files in `client/` or `database/` without prior coordination.

### 2. Sharayu — Lead Frontend Developer
- **Directory Ownership**: `client/`
- **Key Responsibilities**: React.js components, Tailwind CSS styling, responsive layout, route management in `App.jsx`, UI states, icons integration.
- **Rules**: Keep API calls inside `src/services/` and avoid direct inline backend queries.

### 3. Shravya — Lead Database Developer
- **Directory Ownership**: `database/`
- **Key Responsibilities**: Supabase PostgreSQL schemas, SQL DDL migrations, Row Level Security (RLS) policies, indexes, seed data.
- **Rules**: Document all primary/foreign keys and never store unhashed passwords.

---

## 🌿 Git Branching Strategy

- `main`: Production-ready code (Deployments).
- `develop`: Integration branch for active features.
- `feature/backend`: Suhas's working branch.
- `feature/frontend`: Sharayu's working branch.
- `feature/database`: Shravya's working branch.

