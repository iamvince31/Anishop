import { useState } from 'react';
import { supabase } from '../lib/supabase';

const Contact = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase
      .from('contact_submissions')
      .insert([formData]);

    if (error) {
      alert("Failed to send message. Please try again.");
    } else {
      alert("Your message has been sent successfully!");
      setFormData({ first_name: '', last_name: '', email: '', message: '' });
    }
    setSubmitting(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12 space-y-3">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-primary">Contact Us</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Feel free to send a message if you have any questions.
          Our team will do its best to answer your questions.
        </p>
      </div>

      <div className="max-w-2xl mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-xl shadow-primary/5 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text" name="first_name" placeholder="First Name" required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
              value={formData.first_name} onChange={handleChange}
            />
            <input
              type="text" name="last_name" placeholder="Last Name" required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
              value={formData.last_name} onChange={handleChange}
            />
          </div>
          <input
            type="email" name="email" placeholder="Email" required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
            value={formData.email} onChange={handleChange}
          />
          <textarea
            name="message" rows="5" placeholder="Your Message" required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all resize-y"
            value={formData.message} onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-br from-primary to-primary-light text-white font-bold text-lg rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={submitting}
          >
            {submitting ? 'Sending...' : 'Send Message →'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
