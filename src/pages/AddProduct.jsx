import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../lib/localStorage';

const AddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch Categories
      const { data: catData, error: catError } = await db.getCategories();
      if (!catError && catData) {
        setCategories(catData);
      }

      // If editing, fetch Product
      if (id) {
        const { data: prodData, error: prodError } = await db.getProductById(id);
        if (!prodError && prodData) {
          setName(prodData.name);
          setPrice(prodData.price);
          setCategory(prodData.category);
          setDescription(prodData.description || '');
          setImageUrl(prodData.image_url);
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
      const payload = {
        name,
        price: parseFloat(price),
        category: category,
        description,
        image_url: imageUrl
      };

      const { error } = id
        ? await db.updateProduct(id, payload)
        : await db.addProduct(payload);

      if (error) throw error;

      setMessage({ type: 'success', text: id ? 'Product updated successfully!' : 'Product added successfully!' });

      if (!id) {
        setName('');
        setPrice('');
        setCategory('');
        setDescription('');
        setImageUrl('');
      }

      setTimeout(() => navigate('/admin'), 1500);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 italic">
          {id ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="text-gray-500 mt-1">Manage your product inventory</p>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-xl text-sm font-medium border ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border-green-100' 
            : 'bg-red-50 text-red-700 border-red-100'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
            placeholder="e.g., Gojo Satoru Figure"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Price</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
              placeholder="99.99"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent focus:border-transparent outline-none bg-white"
            >
              <option value="">Select a category</option>
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
            rows="4"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent focus:border-transparent outline-none resize-y"
            placeholder="Product description..."
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
            placeholder="https://example.com/image.jpg or /.legacy/image/pic.png"
          />
          <p className="text-xs text-gray-500 mt-1">Enter a full URL or path to an image</p>
        </div>

        {imageUrl && (
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Preview</label>
            <img src={imageUrl} alt="Preview" className="w-48 h-48 object-cover rounded-xl border border-gray-200" />
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-accent text-white font-bold py-3 px-6 rounded-xl hover:bg-accent/90 transition-all disabled:opacity-70"
          >
            {loading ? 'Saving...' : (id ? 'Update Product' : 'Add Product')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
