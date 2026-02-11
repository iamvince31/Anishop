import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
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
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute left-0 right-0 bg-primary-dark shadow-xl transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-64 py-4 px-6 border-t border-white/10' : 'max-h-0'}`}>
          <div className="flex flex-col gap-2">
            <Link to="/" className={`block px-4 py-3 rounded-lg font-semibold text-sm ${isActive('/')}`} onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/products" className={`block px-4 py-3 rounded-lg font-semibold text-sm ${isActive('/products')}`} onClick={() => setMenuOpen(false)}>Products</Link>
            <Link to="/contact" className={`block px-4 py-3 rounded-lg font-semibold text-sm ${isActive('/contact')}`} onClick={() => setMenuOpen(false)}>Contact</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
