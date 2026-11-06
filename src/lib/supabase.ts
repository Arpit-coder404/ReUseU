/**
 * Supabase client configuration & fallback detection.
 * If credentials are provided via VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY,
 * Supabase can be activated seamlessly. Otherwise, the app uses its robust local service layer.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key'
);

export const supabaseConfigInfo = {
  configured: isSupabaseConfigured,
  url: supabaseUrl || 'Not configured (using local reactive storage)',
  mode: isSupabaseConfigured ? 'Live PostgreSQL + Auth' : 'Demo Local Storage Engine',
};

