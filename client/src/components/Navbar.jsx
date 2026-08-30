import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth.js";
import { useCart } from "../hooks/useCart.js";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Menu", to: "/menu" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);

  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
      setSearchTerm("");
    }
  };

  const handleLogout = () => {
    logout();
    setAccountOpen(false);
    navigate("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-charcoal/95 backdrop-blur-md shadow-premium py-3"
          : "bg-gradient-to-b from-charcoal/60 to-transparent py-6"
      }`}
    >
      <div className="container-premium flex items-center justify-between px-6 lg:px-12">
        <Link to="/" className="font-display text-2xl tracking-wide text-cream">
          CAFÉ <span className="text-copper">EXTREME</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm tracking-wide uppercase transition-colors duration-300 ${
                  isActive ? "text-copper" : "text-cream/80 hover:text-cream"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
            className="text-cream/90 hover:text-copper transition-colors"
          >
            <Search size={20} />
          </button>

          <Link
            to="/cart"
            aria-label="Cart"
            className="relative text-cream/90 hover:text-copper transition-colors"
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-copper text-[10px] font-medium text-charcoal">
                {itemCount}
              </span>
            )}
          </Link>

          <div className="relative">
            <button
              aria-label="Account"
              onClick={() => setAccountOpen((v) => !v)}
              className="text-cream/90 hover:text-copper transition-colors"
            >
              <User size={20} />
            </button>

            <AnimatePresence>
              {accountOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-4 w-56 rounded-sm border border-cream/10 bg-charcoal-light shadow-premium overflow-hidden"
                >
                  {isAuthenticated ? (
                    <>
                      <div className="px-5 py-4 border-b border-cream/10">
                        <p className="text-sm font-medium text-cream">{user?.name}</p>
                        <p className="text-xs text-cream/50">{user?.email}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2 px-5 py-3 text-sm text-cream/80 hover:bg-cream/5 hover:text-copper"
                      >
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2 px-5 py-3 text-sm text-cream/80 hover:bg-cream/5 hover:text-copper"
                        >
                          <LayoutDashboard size={16} /> Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-5 py-3 text-sm text-cream/80 hover:bg-cream/5 hover:text-copper"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </>
                  ) : (
                    <div className="p-4 flex flex-col gap-2">
                      <Link
                        to="/signin"
                        onClick={() => setAccountOpen(false)}
                        className="btn-outline w-full text-center py-2.5"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setAccountOpen(false)}
                        className="btn-primary w-full text-center py-2.5"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            aria-label="Menu"
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-cream/90 hover:text-copper transition-colors"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-cream/10 bg-charcoal/95 backdrop-blur-md"
          >
            <form onSubmit={handleSearchSubmit} className="container-premium px-6 lg:px-12 py-5">
              <div className="flex items-center gap-3 border-b border-cream/30 pb-3">
                <Search size={18} className="text-cream/50" />
                <input
                  autoFocus
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search coffee, tea, categories..."
                  className="w-full bg-transparent text-cream placeholder:text-cream/40 focus:outline-none"
                />
                <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search">
                  <X size={18} className="text-cream/50 hover:text-cream" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35 }}
            className="fixed inset-0 z-50 bg-charcoal md:hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-6 border-b border-cream/10">
              <span className="font-display text-xl text-cream">
                CAFÉ <span className="text-copper">EXTREME</span>
              </span>
              <button aria-label="Close menu" onClick={() => setMobileOpen(false)}>
                <X size={22} className="text-cream" />
              </button>
            </div>
            <nav className="flex flex-col gap-2 px-6 py-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `py-4 text-lg font-display border-b border-cream/10 ${
                      isActive ? "text-copper" : "text-cream/90"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
