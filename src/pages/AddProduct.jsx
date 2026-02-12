import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch Categories
      const { data: catData, error: catError } = await supabase.from('categories').select('*');
      if (!catError && catData) {
        setCategories(catData);
      }

      // If editing, fetch Product
      if (id) {
        const { data: prodData, error: prodError } = await supabase.from('products').select('*').eq('id', id).single();
        if (!prodError && prodData) {
          setName(prodData.name);
          setPrice(prodData.price);
          setCategory(prodData.category);
          setDescription(prodData.description || '');
          setExistingImageUrl(prodData.image_url);
        }
      }
    };
    fetchInitialData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!category) {
      setMessage({ type: 'error', text: "Please select a category." });
      setLoading(false);
      return;
    }

    try {
      let imageUrl = null;

      // Handle Image Upload
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `products/${fileName}`; // Organized in a subfolder

        const { error: uploadError } = await supabase.storage
          .from('images') // Reusing the same 'images' bucket
          .upload(filePath, image);

        if (uploadError) throw new Error(`Image Upload Failed: ${uploadError.message}`);

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      // Prepare Payload
      const payload = {
        name,
        price: parseFloat(price),
        category: category,
        description,
        image_url: imageUrl || existingImageUrl
      };

      const query = id
        ? supabase.from('products').update(payload).eq('id', id)
        : supabase.from('products').insert([payload]);

      const { error: dbError } = await query;

      if (dbError) throw new Error(`Product Save Failed: ${dbError.message}`);

      setMessage({ type: 'success', text: id ? 'Product updated successfully!' : 'Product added successfully!' });

      if (!id) {
        setName('');
        setPrice('');
        setDescription('');
        setImage(null);
      } else {
        setTimeout(() => navigate('/admin'), 1500);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-display font-bold mb-8 text-center text-primary">
        {id ? 'Edit Product' : 'Add New Product'}
      </h1>
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        {message && (
          <div className={`p-4 mb-6 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
              placeholder="e.g., Demon Slayer Figure"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                placeholder="29.99"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none bg-white"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none resize-none"
              placeholder="Product description... (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Product Image {id && <span className="text-xs font-normal text-gray-400 ml-2">(Leave empty to keep current)</span>}
            </label>
            <input
              type="file"
              accept="image/*"
              required={!id}
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3.5 px-6 rounded-lg shadow-lg shadow-accent/20 hover:shadow-accent/40 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (id ? 'Updating...' : 'Adding...') : (id ? 'Update Product' : 'Add Product')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
