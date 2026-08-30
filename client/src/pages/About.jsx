import { motion } from "framer-motion";
import AboutSection from "../components/home/AboutSection.jsx";
import ExperienceSection from "../components/home/ExperienceSection.jsx";
import LocationSection from "../components/home/LocationSection.jsx";

const About = () => (
  <>
    <section className="pt-40 pb-20 text-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="eyebrow mb-4">About Us</p>
        <h1 className="font-display text-4xl md:text-6xl text-cream mb-5">
          More Than a Cup of Coffee
        </h1>
        <p className="text-cream/50 max-w-xl mx-auto">
          Café Extreme is a premium coffee house built on precision, patience, and a genuine
          respect for the craft.
        </p>
      </motion.div>
    </section>

    <AboutSection />
    <ExperienceSection />
    <LocationSection />
  </>
);

export default About;
