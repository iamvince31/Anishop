import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [categoryName]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', categoryName);

    if (!error) setProducts(data);
    setLoading(false);
  };

  const handleBuyNow = () => {
    alert("Your order is processing.");
  };

  const displayName = categoryName === 'figurine' ? 'Figurines'
    : categoryName === 'shoe' ? 'Shoes'
      : categoryName === 'cosplay' ? 'Cosplay'
        : categoryName;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12 space-y-3">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-primary capitalize">{displayName}</h1>
        <p className="text-lg text-gray-500">Browse our latest {displayName.toLowerCase()} collection</p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400 animate-pulse">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          No products found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border border-gray-100">
              <div className="bg-gray-50 rounded-xl p-4 mb-4 h-64 flex items-center justify-center overflow-hidden">
                <img
                  src={`/.legacy/${product.image_url}`}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="px-2">
                <h2 className="font-display font-bold text-gray-800 text-lg mb-1 truncate" title={product.name}>{product.name}</h2>
                <h3 className="text-accent font-black text-xl mb-4">${parseFloat(product.price).toFixed(2)}</h3>
                <button
                  className="w-full py-3 bg-gradient-to-r from-accent to-[#ff8a7f] text-white font-bold rounded-lg shadow-lg shadow-accent/20 hover:shadow-accent/40 active:scale-95 transition-all"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
