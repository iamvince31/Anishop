import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AddCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (id) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('categories').select('*').eq('id', id).single();
    if (!error && data) {
      setName(data.name);
      setImageUrl(data.image_url);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      let finalImageUrl = imageUrl;

      // Handle File Upload if file is selected
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload Error details:', uploadError);
          throw new Error(`Image Upload Failed: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
      }

      // Generate slug from name
      const slug = name
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');

      // Update or Insert into 'categories' table
      const payload = { name, slug, image_url: finalImageUrl };

      const query = id
        ? supabase.from('categories').update(payload).eq('id', id)
        : supabase.from('categories').insert([payload]);

      const { error } = await query;

      if (error) throw error;
      setMessage({ type: 'success', text: id ? 'Category updated successfully!' : 'Category added successfully!' });

      if (!id) {
        setName('');
        setImageUrl('');
        setFile(null);
      } else {
        setTimeout(() => navigate('/admin'), 1500);
      }
    } catch (error) {
      // Fallback: If table doesn't exist or other error, just show success for UI demo
      // or show actual error. 
      // Given I am not 100% sure of the schema, I will show the error if it fails.
      setMessage({ type: 'error', text: error.message || 'Error adding category' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-display font-bold mb-8 text-center text-primary">
        {id ? 'Edit Category' : 'Add New Category'}
      </h1>
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        {message && (
          <div className={`p-4 mb-6 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
              placeholder="e.g., Accessories"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Category Image</label>
            <div className="flex flex-col gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20"
              />
              <div className="text-sm text-gray-500 text-center">- OR -</div>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                placeholder="Enter Image URL directly (optional)"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">Upload an image from your device or paste a URL.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3.5 px-6 rounded-lg shadow-lg shadow-accent/20 hover:shadow-accent/40 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (id ? 'Updating...' : 'Adding...') : (id ? 'Update Category' : 'Add Category')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
