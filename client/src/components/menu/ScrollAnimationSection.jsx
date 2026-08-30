import { useRef, lazy, Suspense } from "react";
import { motion, useScroll, useMotionValueEvent, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

// Lazy-loaded so Three.js only downloads on pages that actually use this
// animation, same pattern as the homepage hero's floating cup.
const ScrollCoffeeAnimation = lazy(() => import("./ScrollCoffeeAnimation.jsx"));

// Wraps the brew scene in a tall (300vh) section. Scroll position through
// this wrapper — not time, not a timer — drives the animation from 0 to 1.
// The inner section is CSS `sticky`, so it stays pinned in the viewport for
// the full 300vh of scroll distance, then releases naturally once the user
// scrolls past it. Scrolling back up reverses the animation for free, since
// it's just reading scroll position rather than playing anything forward.
const ScrollAnimationSection = ({ title }) => {
  const wrapperRef = useRef(null);
  const progressRef = useRef(0);

  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end end"] });

  // Update a plain ref (not React state) on every scroll tick so the 3D
  // scene can read it per-frame without triggering React re-renders.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
  });

  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <div ref={wrapperRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-charcoal">
        <Suspense fallback={<div className="h-full w-full bg-charcoal" />}>
          <ScrollCoffeeAnimation progressRef={progressRef} />
        </Suspense>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between py-10">
          <motion.p style={{ opacity: hintOpacity }} className="eyebrow px-6 text-center">
            {title}
          </motion.p>
          <motion.div
            style={{ opacity: hintOpacity }}
            className="flex flex-col items-center gap-2 text-cream/50"
          >
            <span className="text-xs uppercase tracking-widest2">Scroll to Brew</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
              <ChevronDown size={20} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ScrollAnimationSection;
