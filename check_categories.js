import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dntchtagldzjpwtqlzdt.supabase.co';
const supabaseAnonKey = 'sb_publishable_QTSPXXYbJPVxuLbbgnf_ZQ_cJ4dA6gh';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkCategories() {
  const { data, error } = await supabase.from('categories').select('*').limit(1);
  if (error) {
    console.log('Error fetching categories:', error.message);
  } else {
    console.log('Categories table exists. Data:', data);
  }
}

checkCategories();
