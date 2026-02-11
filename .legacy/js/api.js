// API Utility for AniVerse Collectibles
// Requires Supabase Client library and CONFIG from config.js

const supabase = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

const API = {
  // Fetch all products
  getProducts: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    return data;
  },

  // Fetch products by category
  getProductsByCategory: async (category) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category);

    if (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      return [];
    }
    return data;
  },

  // Submit contact form
  submitContactForm: async (formData) => {
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([formData]);

    if (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
    return data;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = API;
}
