import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Inventory', path: '/inventory' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-apex-black/90 backdrop-blur-xl border-b border-apex-gray/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-premium flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-xl font-bold tracking-wider">
              <span className="text-apex-orange">KING</span>
              <span className="text-white"> AUTOS</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold tracking-wide uppercase transition-all duration-300 hover:text-apex-orange ${
                  isActive(link.path) ? 'text-apex-orange' : 'text-apex-white-dim'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <div className="h-0.5 bg-apex-orange mt-1 rounded-full" />
                )}
              </Link>
            ))}
            <Link
              to="/inventory"
              className="btn-premium bg-gradient-premium text-white px-6 py-2.5 rounded-lg font-semibold text-sm uppercase tracking-wide"
            >
              Browse Cars
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-apex-black-light border-t border-apex-gray/30 animate-slide-up">
          <div className="px-4 py-6 space-y-4">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block text-lg font-semibold tracking-wide uppercase transition-colors ${
                  isActive(link.path) ? 'text-apex-orange' : 'text-apex-white-dim'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/inventory"
              onClick={() => setIsOpen(false)}
              className="block text-center btn-premium bg-gradient-premium text-white px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wide mt-4"
            >
              Browse Cars
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
