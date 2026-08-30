import { useState, useEffect } from "react";
import HeroSection from "../components/home/HeroSection.jsx";
import ProductShowcase from "../components/home/ProductShowcase.jsx";
import CategoryExplorer from "../components/home/CategoryExplorer.jsx";
import AboutSection from "../components/home/AboutSection.jsx";
import ExperienceSection from "../components/home/ExperienceSection.jsx";
import CTASection from "../components/home/CTASection.jsx";
import LocationSection from "../components/home/LocationSection.jsx";
import { useProducts } from "../hooks/useProducts.js";
import { categoryService } from "../services/productService.js";

const Home = () => {
  const { products: featuredProducts, loading: featuredLoading } = useProducts({ featured: "true" });
  const { products: allProducts, loading: allLoading } = useProducts({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(() => setCategories([]));
  }, []);

  // "Popular Choices" reuses the general product list, showing a different
  // slice than Featured Coffee so the two sections don't feel redundant.
  const popularChoices = allProducts.slice(4, 8);

  return (
    <>
      <HeroSection />

      <ProductShowcase
        eyebrow="Featured"
        title="Featured Coffee"
        subtitle="A few of our most-loved cups, crafted daily."
        products={featuredProducts}
        loading={featuredLoading}
      />

      <CategoryExplorer categories={categories} />

      <AboutSection />

      <ExperienceSection />

      <ProductShowcase
        eyebrow="Popular"
        title="Popular Choices"
        subtitle="What Café Extreme regulars keep coming back for."
        products={popularChoices}
        loading={allLoading}
      />

      <CTASection />

      <LocationSection />
    </>
  );
};

export default Home;
