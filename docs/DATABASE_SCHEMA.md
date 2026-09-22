# AgriSphere - Database Schema Documentation

## 📊 Entity Relationship Summary

AgriSphere database consists of 8 core tables hosted on Supabase PostgreSQL:

1. **`profiles`**: Extends `auth.users`, stores user role, district, and crop preferences.
2. **`crops`**: Master catalog of crops, growth cycles, and soil preferences.
3. **`crop_tasks`**: Tasks assigned per farmer profile with due dates.
4. **`soil_records`**: NPK and pH test history per farmer.
5. **`knowledge_articles`**: Informational articles and guides.
6. **`market_information`**: Mandi location, prices, and price movements.
7. **`resources`**: Subsidies, calculators, and government links.
8. **`notifications`**: Weather and market alert log per user.

For DDL statements and migration scripts, see [`database/schema/01_schema.sql`](../database/schema/01_schema.sql).

