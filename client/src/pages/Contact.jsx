import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Mail, Send } from "lucide-react";

// Note: this form is client-side only for now — there's no dedicated
// /api/contact endpoint in the current API structure (see README). Wiring
// it to a real inbox is a natural next step (e.g. an email service via
// the backend, or a simple Contact/Message model).
const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  };

  return (
    <section className="pt-40 pb-24 px-6 lg:px-12">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="eyebrow mb-4">Get in Touch</p>
          <h1 className="font-display text-4xl md:text-5xl text-cream">Contact Café Extreme</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="font-display text-xl text-cream mb-6">Send a Message</h2>

            {submitted ? (
              <div className="rounded-sm border border-copper/30 bg-copper/10 p-6 text-center">
                <p className="text-cream">Thank you — we'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-cream/50 mb-2">Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-sm border border-cream/20 bg-transparent px-4 py-3 text-cream focus:border-copper focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-cream/50 mb-2">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full rounded-sm border border-cream/20 bg-transparent px-4 py-3 text-cream focus:border-copper focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-cream/50 mb-2">Message</label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="w-full rounded-sm border border-cream/20 bg-transparent px-4 py-3 text-cream focus:border-copper focus:outline-none resize-none"
                  />
                </div>
                <button type="submit" className="btn-primary">
                  <Send size={16} /> Send Message
                </button>
              </form>
            )}
          </div>

          <div className="space-y-5">
            <h2 className="font-display text-xl text-cream mb-1">Visit Us</h2>
            <div className="flex items-start gap-3 text-cream/70">
              <MapPin size={18} className="mt-0.5 shrink-0 text-copper" />
              <span>123 Beach Road, Negombo, Sri Lanka</span>
            </div>
            <div className="flex items-center gap-3 text-cream/70">
              <Clock size={18} className="shrink-0 text-copper" />
              <span>Daily, 7:00 AM – 10:00 PM</span>
            </div>
            <div className="flex items-center gap-3 text-cream/70">
              <Phone size={18} className="shrink-0 text-copper" />
              <span>+94 77 123 4567</span>
            </div>
            <div className="flex items-center gap-3 text-cream/70">
              <Mail size={18} className="shrink-0 text-copper" />
              <span>hello@cafeextreme.com</span>
            </div>

            <div className="aspect-video overflow-hidden rounded-sm bg-espresso/40 mt-8">
              <img
                src="https://placehold.co/900x506/6F4E37/F5EDE0?text=Cafe+Extreme"
                alt="Café Extreme storefront"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
