import { Link } from "react-router-dom";
import { Coffee } from "lucide-react";

const NotFound = () => (
  <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
    <Coffee size={32} className="text-cream/20 mb-6" />
    <p className="font-mono text-copper text-sm mb-3">404</p>
    <h1 className="font-display text-3xl md:text-4xl text-cream mb-4">Page Not Found</h1>
    <p className="text-cream/50 mb-8 max-w-sm">
      This page seems to have gone cold. Let's get you back to something fresh.
    </p>
    <Link to="/" className="btn-primary">
      Back to Home
    </Link>
  </section>
);

export default NotFound;
