import { Link } from "react-router-dom";
import { Instagram, Facebook, MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-espresso border-t border-cream/10">
      <div className="container-premium px-6 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <h3 className="font-display text-2xl text-cream mb-3">
            CAFÉ <span className="text-copper">EXTREME</span>
          </h3>
          <p className="text-sm text-cream/60 leading-relaxed">
            Exceptional coffee. Extraordinary moments. Crafted daily, served with intent.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="#" aria-label="Instagram" className="text-cream/60 hover:text-copper transition-colors">
              <Instagram size={18} />
            </a>
            <a href="#" aria-label="Facebook" className="text-cream/60 hover:text-copper transition-colors">
              <Facebook size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Navigate</h4>
          <ul className="space-y-3 text-sm text-cream/70">
            <li><Link to="/" className="hover:text-copper transition-colors">Home</Link></li>
            <li><Link to="/menu" className="hover:text-copper transition-colors">Menu</Link></li>
            <li><Link to="/about" className="hover:text-copper transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-copper transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Menu</h4>
          <ul className="space-y-3 text-sm text-cream/70">
            <li><Link to="/menu/hot-coffee" className="hover:text-copper transition-colors">Hot Coffee</Link></li>
            <li><Link to="/menu/iced-coffee" className="hover:text-copper transition-colors">Iced Coffee</Link></li>
            <li><Link to="/menu?category=iced-tea" className="hover:text-copper transition-colors">Iced Tea</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Visit Us</h4>
          <ul className="space-y-3 text-sm text-cream/70">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-copper" />
              <span>123 Beach Road, Negombo, Sri Lanka</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock size={16} className="shrink-0 text-copper" />
              <span>Daily, 7:00 AM – 10:00 PM</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0 text-copper" />
              <span>+94 77 123 4567</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0 text-copper" />
              <span>hello@cafeextreme.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 py-6">
        <p className="text-center text-xs text-cream/40">
          © {year} Café Extreme. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
