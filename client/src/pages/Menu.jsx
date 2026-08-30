import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, Coffee, Snowflake, ArrowRight } from "lucide-react";
import ProductCard from "../components/ProductCard.jsx";
import { useProducts } from "../hooks/useProducts.js";
import { categoryService } from "../services/productService.js";

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search") || "";

  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(() => setCategories([]));
  }, []);

  // Keep the local search box in sync if the URL changes elsewhere (e.g. navbar search)
  useEffect(() => setSearchInput(searchQuery), [searchQuery]);

  const queryParams = useMemo(() => {
    const params = {};
    if (activeCategory) params.category = activeCategory;
    if (searchQuery) params.search = searchQuery;
    return params;
  }, [activeCategory, searchQuery]);

  const { products, loading, error } = useProducts(queryParams);

  const handleCategoryClick = (slugOrId) => {
    const next = new URLSearchParams(searchParams);
    if (slugOrId) next.set("category", slugOrId);
    else next.delete("category");
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (searchInput.trim()) next.set("search", searchInput.trim());
    else next.delete("search");
    setSearchParams(next);
  };

  return (
    <section className="pt-32 pb-24">
      <div className="container-premium px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="eyebrow mb-3">Café Extreme</p>
          <h1 className="font-display text-4xl md:text-5xl text-cream mb-4">Our Menu</h1>
          <p className="text-cream/50 max-w-xl mx-auto">
            Every cup crafted from carefully sourced beans and fresh ingredients — hot, iced, or steeped.
          </p>
        </div>

        {/* Primary category selector — Hot Coffee / Iced Coffee each have
            their own dedicated page with the cinematic scroll animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto mb-16">
          <Link
            to="/menu/hot-coffee"
            className="group flex items-center justify-between rounded-sm border border-cream/10 bg-espresso/30 p-6 transition-all duration-500 hover:border-copper/40 hover:shadow-card"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-copper/30 text-copper">
                <Coffee size={18} />
              </div>
              <div>
                <p className="font-display text-lg text-cream">Hot Coffee</p>
                <p className="text-xs text-cream/40">Rich espresso classics</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-cream/30 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-copper" />
          </Link>

          <Link
            to="/menu/iced-coffee"
            className="group flex items-center justify-between rounded-sm border border-cream/10 bg-espresso/30 p-6 transition-all duration-500 hover:border-copper/40 hover:shadow-card"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-copper/30 text-copper">
                <Snowflake size={18} />
              </div>
              <div>
                <p className="font-display text-lg text-cream">Iced Coffee</p>
                <p className="text-xs text-cream/40">Chilled for warm days</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-cream/30 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-copper" />
          </Link>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto mb-10">
          <div className="flex items-center gap-3 border-b border-cream/20 pb-2 focus-within:border-copper transition-colors">
            <SearchIcon size={16} className="text-cream/40" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search coffee, tea, categories..."
              className="w-full bg-transparent text-sm text-cream placeholder:text-cream/30 focus:outline-none"
            />
          </div>
        </form>

        {/* Category filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          <button
            onClick={() => handleCategoryClick("")}
            className={`rounded-full border px-5 py-2 text-xs uppercase tracking-wide transition-colors ${
              !activeCategory
                ? "border-copper bg-copper text-charcoal"
                : "border-cream/20 text-cream/60 hover:border-cream/40 hover:text-cream"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`rounded-full border px-5 py-2 text-xs uppercase tracking-wide transition-colors ${
                activeCategory === cat.slug
                  ? "border-copper bg-copper text-charcoal"
                  : "border-cream/20 text-cream/60 hover:border-cream/40 hover:text-cream"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading && (
          <div className="flex justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cream/20 border-t-copper" />
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-24 text-cream/50">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-24">
            <Coffee size={32} className="mx-auto mb-4 text-cream/20" />
            <p className="text-cream/50">
              {searchQuery ? `No results for "${searchQuery}".` : "No products found in this category."}
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + searchQuery}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
};

export default Menu;
