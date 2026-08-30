import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

// The hero video lives at client/public/videos/cafe-extreme-hero.mp4 (see README
// for how to add/replace it). Until a video is present, the dark charcoal
// background color set in index.html serves as the fallback — the page
// never blocks on the video loading.
const HeroSection = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const heroRef = useRef(null);

  // Parallax: content drifts and fades slightly as the hero scrolls out of view.
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={heroRef} className="relative h-screen w-full overflow-hidden bg-charcoal">
      <video
        autoPlay
        muted
        loop
        playsInline
        onCanPlay={() => setVideoLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
          videoLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src="/videos/cafe-extreme-hero.mp4" type="video/mp4" />
      </video>

      {/* Cinematic dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/50 to-charcoal" />

      {/* Soft ambient gradient glows behind the content */}
      <div className="pointer-events-none absolute -top-32 right-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(201,161,90,0.18),transparent_70%)] blur-2xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(111,78,55,0.22),transparent_70%)] blur-2xl" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        {/* Glassmorphism panel */}
        <div className="max-w-3xl rounded-2xl border border-cream/10 bg-white/5 p-8 backdrop-blur-xl sm:p-10 md:p-12">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="eyebrow mb-6"
          >
            Café Extreme
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-display text-4xl leading-tight text-cream sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Exceptional Coffee.
            <br />
            Extraordinary Moments.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              to="/menu"
              className="btn-primary transition-shadow duration-500 hover:shadow-[0_0_35px_rgba(201,161,90,0.45)]"
            >
              Order Now
            </Link>
            <Link
              to="/menu"
              className="btn-outline transition-shadow duration-500 hover:shadow-[0_0_25px_rgba(245,237,224,0.15)]"
            >
              Explore Menu
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-cream/50"
      >
        <ChevronDown size={22} />
      </motion.div>
    </section>
  );
};

export default HeroSection;