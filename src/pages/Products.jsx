import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12 space-y-3">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-primary">Our Collections</h1>
        <p className="text-lg text-gray-500">Browse our carefully curated categories of premium anime merchandise</p>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading categories...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link to={`/category/${cat.slug}`} key={cat.id} className="group relative block overflow-hidden rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="aspect-[4/5] w-full overflow-hidden">
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <h2 className="text-white font-display text-2xl font-bold mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{cat.name}</h2>
                <span className="inline-block w-max px-4 py-2 bg-accent text-white font-bold text-sm rounded-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
                  View Collection →
                </span>
              </div>
            </Link>
          ))}
          {categories.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No categories found. Add some from the "Add Category" page.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
