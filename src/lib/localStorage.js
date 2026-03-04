// Local storage service to replace Supabase temporarily

const STORAGE_KEYS = {
  USERS: 'aniverse_users',
  CURRENT_USER: 'aniverse_current_user',
  PRODUCTS: 'aniverse_products',
  CATEGORIES: 'aniverse_categories',
  CONTACTS: 'aniverse_contacts'
};

// Initialize with default data if empty
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONTACTS)) {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify([]));
  }
};

initializeStorage();

// Helper to generate unique IDs
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Auth functions
export const auth = {
  signUp: async ({ email, password, username }) => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return { data: null, error: { message: 'User already exists' } };
    }

    const newUser = {
      id: generateId(),
      email,
      password, // In production, this should be hashed!
      username: username || email.split('@')[0],
      role: 'user',
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Auto login
    const session = { user: { ...newUser }, access_token: generateId() };
    delete session.user.password;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(session));

    return { data: { user: session.user, session }, error: null };
  },

  signIn: async ({ email, password }) => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return { data: null, error: { message: 'Invalid credentials' } };
    }

    const session = { user: { ...user }, access_token: generateId() };
    delete session.user.password;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(session));

    return { data: { user: session.user, session }, error: null };
  },

  signOut: async () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    return { error: null };
  },

  getSession: async () => {
    const session = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return { data: { session: session ? JSON.parse(session) : null }, error: null };
  },

  onAuthStateChange: (callback) => {
    // Simple implementation - just call callback with current session
    const session = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    callback('SIGNED_IN', session ? JSON.parse(session) : null);
    
    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    };
  }
};

// Database functions
export const db = {
  // Categories
  getCategories: async () => {
    const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
    return { data: categories, error: null };
  },

  addCategory: async (category) => {
    const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
    const newCategory = {
      id: generateId(),
      ...category,
      created_at: new Date().toISOString()
    };
    categories.push(newCategory);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    return { data: newCategory, error: null };
  },

  updateCategory: async (id, updates) => {
    const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return { data: null, error: { message: 'Category not found' } };
    
    categories[index] = { ...categories[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    return { data: categories[index], error: null };
  },

  deleteCategory: async (id) => {
    const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
    const filtered = categories.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));
    return { error: null };
  },

  getCategoryById: async (id) => {
    const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
    const category = categories.find(c => c.id === id);
    return { data: category, error: category ? null : { message: 'Not found' } };
  },

  // Products
  getProducts: async () => {
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    return { data: products, error: null };
  },

  getProductsByCategory: async (categorySlug) => {
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const filtered = products.filter(p => p.category === categorySlug);
    return { data: filtered, error: null };
  },

  addProduct: async (product) => {
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const newProduct = {
      id: generateId(),
      ...product,
      created_at: new Date().toISOString()
    };
    products.push(newProduct);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return { data: newProduct, error: null };
  },

  updateProduct: async (id, updates) => {
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return { data: null, error: { message: 'Product not found' } };
    
    products[index] = { ...products[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return { data: products[index], error: null };
  },

  deleteProduct: async (id) => {
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const filtered = products.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
    return { error: null };
  },

  getProductById: async (id) => {
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const product = products.find(p => p.id === id);
    return { data: product, error: product ? null : { message: 'Not found' } };
  },

  // Contact submissions
  addContact: async (contact) => {
    const contacts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACTS) || '[]');
    const newContact = {
      id: generateId(),
      ...contact,
      created_at: new Date().toISOString()
    };
    contacts.push(newContact);
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
    return { data: newContact, error: null };
  },

  getContacts: async () => {
    const contacts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACTS) || '[]');
    return { data: contacts, error: null };
  },

  // User profile
  getUserProfile: async (userId) => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find(u => u.id === userId);
    if (!user) return { data: null, error: { message: 'User not found' } };
    
    const profile = { ...user };
    delete profile.password;
    return { data: profile, error: null };
  }
};
