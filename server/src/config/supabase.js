import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;
let isConfigured = false;

if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-supabase-project-id')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    isConfigured = true;
    console.log('✅ Supabase Client initialized successfully.');
  } catch (error) {
    console.warn('⚠️ Failed to initialize Supabase client:', error.message);
  }
} else {
  console.log('ℹ️ Supabase credentials not found or placeholder in .env. Using robust persistent store.');
}

export { supabase, isConfigured };
export default supabase;
