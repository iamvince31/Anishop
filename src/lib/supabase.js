import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dntchtagldzjpwtqlzdt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_QTSPXXYbJPVxuLbbgnf_ZQ_cJ4dA6gh';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
