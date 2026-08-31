import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

// A straightforward autoplay/loop video banner — same reliable pattern as
// the homepage hero video. No scroll-scrubbing, no frame-by-frame syncing,
// just a video that plays on its own behind the category title.
const CategoryVideoIntro = ({ title, videoSrc }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <section className="relative h-[85vh] w-full overflow-hidden bg-charcoal">
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
        <source src={videoSrc} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="eyebrow mb-4"
        >
          Café Extreme
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="font-display text-5xl text-cream sm:text-6xl md:text-7xl"
        >
          {title}
        </motion.h1>
      </div>

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

export default CategoryVideoIntro;