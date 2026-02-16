import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin, Instagram, Play } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-apex-black border-t border-apex-gray/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-premium flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="font-display text-xl font-bold tracking-wider">
                <span className="text-apex-orange">KING</span>
                <span className="text-white"> AUTOS</span>
              </span>
            </div>
            <p className="text-apex-white-dim text-sm leading-relaxed">
              The world's premier destination for high-performance luxury vehicles. 
              Experience automotive excellence like never before.
            </p>
            <div className="flex gap-4 pt-2">
              <a 
                href="https://www.tiktok.com/@king.autos56?_r=1&_t=ZN-92kFQfuFD42" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-apex-black-light border border-apex-gray/30 flex items-center justify-center text-apex-white-dim hover:text-apex-orange hover:border-apex-orange transition-all hover:-translate-y-1"
                aria-label="TikTok"
              >
                <Play className="w-5 h-5 fill-current" />
              </a>
              <a 
                href="https://www.instagram.com/king_global_autos?igsh=MWRpYnNjazluamtlNw%3D%3D&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-apex-black-light border border-apex-gray/30 flex items-center justify-center text-apex-white-dim hover:text-apex-orange hover:border-apex-orange transition-all hover:-translate-y-1"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-sm font-bold tracking-wider text-apex-orange uppercase mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Inventory', path: '/inventory' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-apex-white-dim text-sm hover:text-apex-orange transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display text-sm font-bold tracking-wider text-apex-orange uppercase mb-4">Services</h3>
            <ul className="space-y-3">
              {['Premium Sales', 'Test Drives', 'Custom Orders', 'Global Delivery', 'Financing'].map((s) => (
                <li key={s} className="text-apex-white-dim text-sm">{s}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-sm font-bold tracking-wider text-apex-orange uppercase mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-apex-white-dim text-sm">
                <MapPin className="w-4 h-4 text-apex-orange flex-shrink-0" />
                Jabbi Kunda, Nyambai Main Road, Brikama – WCR, The Gambia
              </li>
              <li className="flex items-center gap-2 text-apex-white-dim text-sm">
                <Phone className="w-4 h-4 text-apex-orange flex-shrink-0" />
                +220 200 7261-KING
              </li>
              <li className="flex items-center gap-2 text-apex-white-dim text-sm">
                <Mail className="w-4 h-4 text-apex-orange flex-shrink-0" />
                kingautos112@gmail.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-apex-gray/30 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-apex-white-dim text-xs">
            © {new Date().getFullYear()} KingAutos. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/admin" className="text-apex-white-dim text-xs hover:text-apex-orange transition-colors opacity-50 hover:opacity-100">
              Admin Login
            </Link>
            <p className="text-apex-white-dim text-xs">
              Crafted with precision and passion.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
