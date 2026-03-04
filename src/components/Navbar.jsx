import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const fetchProfile = async (session) => {
      if (!session) {
        setSession(null);
        setRole(null);
        setUsername(null);
        return;
      }
      setSession(session);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, username')
        .eq('id', session.user.id)
        .single();
      if (!error && profile) {
        setRole(profile.role || 'customer');
        setUsername(profile.username);
      }
    };

    // Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchProfile(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchProfile(session);
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
          {/* Desktop Links (Now on the Left) */}
          <div className="hidden md:flex items-center gap-10">
            <Link to="/" className={`font-bold text-lg tracking-tight transition-all ${isActive('/')}`}>Home</Link>
            <Link to="/products" className={`font-bold text-lg tracking-tight transition-all ${isActive('/products')} text-white/90`}>Shop</Link>
            <Link to="/contact" className={`font-bold text-lg tracking-tight transition-all ${isActive('/contact')} text-white/90`}>Contacts</Link>
            {role === 'admin' && (
              <Link to="/admin" className="font-bold text-sm uppercase tracking-wider bg-white text-[#5a3ba8] px-5 py-2 rounded-lg hover:bg-white/90 hover:shadow-lg transition-all shadow-sm">Admin</Link>
            )}
          </div>

          {/* Account & Admin (Now on the Right) */}
          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-6">


                {/* Account Icon / User Menu */}
                <div className="flex items-center gap-3 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-2xl transition-all cursor-pointer group relative">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-white/50 uppercase tracking-widest font-black leading-none mb-1">
                      {role === 'admin' ? (
                        <span className="text-secondary font-bold">ADMIN ACCOUNT</span>
                      ) : (
                        username || role
                      )}
                    </span>
                    <button onClick={handleLogout} className="font-bold text-[11px] text-white/80 hover:text-white transition-all uppercase">Logout</button>
                  </div>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary fill-current">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="font-bold text-sm text-white/70 hover:text-white transition-all">Sign In</Link>
                <Link to="/register" className="bg-white/10 border border-white/20 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-white/20 transition-all shadow-sm">Register</Link>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/10">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-white/50 fill-current">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors flex flex-col gap-1.5 ml-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute left-0 right-0 bg-primary-dark shadow-xl transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-[500px] py-4 px-6 border-t border-white/10' : 'max-h-0'}`}>
          <div className="flex flex-col gap-2">
            <Link to="/" className={`block px-4 py-3 rounded-lg font-semibold text-sm ${isActive('/')}`} onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/products" className={`block px-4 py-3 rounded-lg font-semibold text-sm ${isActive('/products')}`} onClick={() => setMenuOpen(false)}>Products</Link>
            <Link to="/contact" className={`block px-4 py-3 rounded-lg font-semibold text-sm ${isActive('/contact')}`} onClick={() => setMenuOpen(false)}>Contact</Link>

            <hr className="border-white/10 my-1" />

            {session ? (
              <>
                {role === 'admin' && (
                  <Link to="/admin" className={`block px-4 py-3 rounded-lg font-bold text-sm bg-accent text-white ${isActive('/admin')}`} onClick={() => setMenuOpen(false)}>Admin Panel</Link>
                )}
                <div className="px-4 py-2">
                  <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Logged in as {username || role}</p>
                </div>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-left px-4 py-3 font-semibold text-sm text-white/50">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-3 rounded-lg font-semibold text-sm text-white/70 underline" onClick={() => setMenuOpen(false)}>Sign In</Link>
                <Link to="/register" className="block px-4 py-3 rounded-lg font-semibold text-sm text-white/70 underline" onClick={() => setMenuOpen(false)}>Create Account</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
