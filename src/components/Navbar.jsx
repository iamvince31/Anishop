import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'text-white' : 'text-white/90 hover:text-white';

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#5a3ba8] via-[#4c3297] to-[#3d2680] shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-[72px]">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group" onClick={() => setMenuOpen(false)}>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <img
                src="/.legacy/image/logo.png"
                alt="AniVerse Logo"
                className="w-10 h-10 rounded-full"
              />
            </div>
          </Link>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors flex flex-col gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={`font-bold text-lg transition-all ${isActive('/')}`}>Home</Link>
            <Link to="/products" className={`font-bold text-lg transition-all ${isActive('/products')} text-[#ff6f61]`}>Products</Link>
            <Link to="/contact" className={`font-bold text-lg transition-all ${isActive('/contact')} text-[#ff6f61]`}>Contact</Link>

            {session ? (
              <>
                <div className="h-6 w-px bg-white/20 ml-2"></div>
                <Link to="/admin" className={`font-bold text-sm bg-accent border border-accent rounded-xl px-5 py-2 hover:bg-accent/90 transition-all ${isActive('/admin')}`}>Admin Dashboard</Link>
                <button onClick={handleLogout} className="font-bold text-sm text-white/50 hover:text-white transition-all">Logout</button>
              </>
            ) : (
              <Link to="/login" className="font-bold text-sm text-white/30 hover:text-white transition-all">Admin Access</Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute left-0 right-0 bg-primary-dark shadow-xl transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-64 py-4 px-6 border-t border-white/10' : 'max-h-0'}`}>
          <div className="flex flex-col gap-2">
            <Link to="/" className={`block px-4 py-3 rounded-lg font-semibold text-sm ${isActive('/')}`} onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/products" className={`block px-4 py-3 rounded-lg font-semibold text-sm ${isActive('/products')}`} onClick={() => setMenuOpen(false)}>Products</Link>
            <Link to="/contact" className={`block px-4 py-3 rounded-lg font-semibold text-sm ${isActive('/contact')}`} onClick={() => setMenuOpen(false)}>Contact</Link>

            {session ? (
              <>
                <hr className="border-white/10 my-1" />
                <Link to="/admin" className={`block px-4 py-3 rounded-lg font-bold text-sm bg-accent text-white ${isActive('/admin')}`} onClick={() => setMenuOpen(false)}>Admin Panel</Link>
                <Link to="/add-category" className={`block px-4 py-3 rounded-lg font-semibold text-sm ${isActive('/add-category')}`} onClick={() => setMenuOpen(false)}>Add Category</Link>
                <Link to="/add-product" className={`block px-4 py-3 rounded-lg font-semibold text-sm ${isActive('/add-product')}`} onClick={() => setMenuOpen(false)}>Add Product</Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-left px-4 py-3 font-semibold text-sm text-white/50">Logout</button>
              </>
            ) : (
              <Link to="/login" className="block px-4 py-3 rounded-lg font-semibold text-sm text-white/50" onClick={() => setMenuOpen(false)}>Admin Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
