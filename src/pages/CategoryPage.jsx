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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-[2.5rem] p-3 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group border border-gray-100">
              {/* Inner Frame */}
              <div className="bg-white rounded-[2rem] border border-gray-50 p-1 overflow-hidden">
                <div className="aspect-square w-full rounded-[1.8rem] overflow-hidden flex items-center justify-center bg-gray-50/50 relative">
                  <img
                    src={product.image_url?.startsWith('http') ? product.image_url : `/.legacy/${product.image_url}`}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Floating Price Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg font-black text-accent text-sm">
                    ${parseFloat(product.price).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className="px-4 py-5 space-y-3">
                <div>
                  <h2 className="font-display font-bold text-gray-800 text-lg leading-tight truncate px-1" title={product.name}>
                    {product.name}
                  </h2>
                  <p className="text-xs text-gray-400 font-medium px-1 mt-1">Premium Collection</p>
                </div>

                <button
                  className="w-full py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl shadow-xl hover:shadow-gray-200 active:scale-95 transition-all text-sm uppercase tracking-wider"
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
