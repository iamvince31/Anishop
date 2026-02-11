import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative mt-20 bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white pt-16 overflow-hidden">
      {/* Top Border Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-primary-light to-accent"></div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-10">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-black">
              Ani<span className="text-accent">Verse</span> Collectibles
            </h3>
            <p className="text-white/65 text-sm leading-relaxed max-w-xs">
              Your ultimate destination for premium anime figurines, custom shoes, and cosplay costumes.
              Curated with love for the anime community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-accent uppercase tracking-widest text-sm mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-white/70 hover:text-white hover:pl-1 transition-all flex items-center gap-2 group">
                  <span className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all font-bold">→</span> Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-white/70 hover:text-white hover:pl-1 transition-all flex items-center gap-2 group">
                  <span className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all font-bold">→</span> Products
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/70 hover:text-white hover:pl-1 transition-all flex items-center gap-2 group">
                  <span className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all font-bold">→</span> Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-display font-bold text-accent uppercase tracking-widest text-sm mb-4">Connect</h4>
            <ul className="space-y-3 mb-6">
              <li>
                <a href="mailto:support@animefigshaven.com" className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all font-bold">→</span> support@animefigshaven.com
                </a>
              </li>
            </ul>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=61563752905603"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:-translate-y-1 transition-all duration-300"
              >
                <img src="/.legacy/image/facebook.jfif" alt="Facebook" className="w-5 h-5 rounded-full" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 text-center">
          <p className="text-white/40 text-xs">&copy; {new Date().getFullYear()} AniVerse Collectibles. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
