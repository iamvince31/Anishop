import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('products').select('*').order('created_at', { ascending: false })
      ]);

      if (catRes.error) throw catRes.error;
      if (prodRes.error) throw prodRes.error;

      setCategories(catRes.data || []);
      setProducts(prodRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setMessage({ type: 'error', text: 'Failed to load data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure? This will not delete the products in this category but may break links.')) return;

    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      setCategories(categories.filter(c => c.id !== id));
      setMessage({ type: 'success', text: 'Category deleted.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(products.filter(p => p.id !== id));
      setMessage({ type: 'success', text: 'Product deleted.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-display font-bold text-gray-900 italic">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your storefront items and collections</p>
        </div>
        <div className="flex gap-4">
          <Link to="/add-category" className="bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm">
            + New Category
          </Link>
          <Link to="/add-product" className="bg-accent text-white px-6 py-2.5 rounded-xl font-bold hover:bg-accent/90 transition-all shadow-md">
            + New Product
          </Link>
        </div>
      </div>

      {message && (
        <div className={`p-4 mb-8 rounded-xl text-sm font-medium border animate-in fade-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
          }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-100 mb-8">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-8 py-4 font-bold text-sm transition-all relative ${activeTab === 'products' ? 'text-accent' : 'text-gray-400 hover:text-gray-600'
            }`}
        >
          Products ({products.length})
          {activeTab === 'products' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-t-full"></div>}
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-8 py-4 font-bold text-sm transition-all relative ${activeTab === 'categories' ? 'text-accent' : 'text-gray-400 hover:text-gray-600'
            }`}
        >
          Categories ({categories.length})
          {activeTab === 'categories' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-t-full"></div>}
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-300 animate-pulse">Loading data...</div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {activeTab === 'products' ? (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5 font-bold text-xs uppercase tracking-wider text-gray-500">Product</th>
                  <th className="px-8 py-5 font-bold text-xs uppercase tracking-wider text-gray-500">Category</th>
                  <th className="px-8 py-5 font-bold text-xs uppercase tracking-wider text-gray-500">Price</th>
                  <th className="px-8 py-5 font-bold text-xs uppercase tracking-wider text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.map(cat => {
                  const categoryProducts = products.filter(p => p.category === cat.slug);
                  if (categoryProducts.length === 0) return null;

                  return (
                    <div key={cat.slug} className="contents">
                      <tr className="bg-gray-50/50">
                        <td colSpan="4" className="px-8 py-3 font-black text-[10px] uppercase tracking-widest text-accent/70 bg-gray-50/30">
                          {cat.name} ({categoryProducts.length})
                        </td>
                      </tr>
                      {categoryProducts.map(product => (
                        <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-8 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-100 shadow-sm">
                                <img
                                  src={product.image_url?.startsWith('http') ? product.image_url : `/.legacy/${product.image_url}`}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="font-bold text-gray-800">{product.name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-4">
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold capitalize">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-8 py-4 font-black text-gray-900 italic">
                            ${parseFloat(product.price).toFixed(2)}
                          </td>
                          <td className="px-8 py-4 text-right">
                            <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Link
                                to={`/edit-product/${product.id}`}
                                className="text-accent hover:text-accent/80 font-bold text-sm"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-400 hover:text-red-600 font-bold text-sm transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </div>
                  );
                })}
                {/* Products with no matching category slug */}
                {(() => {
                  const orphanedProducts = products.filter(p => !categories.some(c => c.slug === p.category));
                  if (orphanedProducts.length === 0) return null;
                  return (
                    <div className="contents">
                      <tr className="bg-red-50/30">
                        <td colSpan="4" className="px-8 py-3 font-black text-[10px] uppercase tracking-widest text-red-400">
                          Uncategorized ({orphanedProducts.length})
                        </td>
                      </tr>
                      {orphanedProducts.map(product => (
                        <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-8 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-100 shadow-sm">
                                <img
                                  src={product.image_url?.startsWith('http') ? product.image_url : `/.legacy/${product.image_url}`}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="font-bold text-gray-800">{product.name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-4">
                            <span className="px-3 py-1 bg-red-50 text-red-400 rounded-full text-xs font-bold capitalize">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-8 py-4 font-black text-gray-900 italic">
                            ${parseFloat(product.price).toFixed(2)}
                          </td>
                          <td className="px-8 py-4 text-right">
                            <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Link
                                to={`/edit-product/${product.id}`}
                                className="text-accent hover:text-accent/80 font-bold text-sm"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-400 hover:text-red-600 font-bold text-sm transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </div>
                  );
                })()}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5 font-bold text-xs uppercase tracking-wider text-gray-500">Category</th>
                  <th className="px-8 py-5 font-bold text-xs uppercase tracking-wider text-gray-500">Slug</th>
                  <th className="px-8 py-5 font-bold text-xs uppercase tracking-wider text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-100 shadow-sm">
                          <img
                            src={cat.image_url?.startsWith('http') ? cat.image_url : `/.legacy/${cat.image_url}`}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-bold text-gray-800">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 font-mono italic">/{cat.slug}</code>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/edit-category/${cat.id}`}
                          className="text-accent hover:text-accent/80 font-bold text-sm"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="text-red-400 hover:text-red-600 font-bold text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
