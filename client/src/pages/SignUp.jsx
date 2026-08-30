import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Coffee, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";

const SignUp = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return "Please fill in every field.";
    }
    if (form.password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    if (form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.confirmPassword);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center pt-24 pb-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-copper/40 mb-5">
            <Coffee size={20} className="text-copper" />
          </div>
          <p className="eyebrow mb-2">Join Café Extreme</p>
          <h1 className="font-display text-3xl text-cream">Create Account</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-xs uppercase tracking-wide text-cream/50 mb-2">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Perera"
              className="w-full rounded-sm border border-cream/20 bg-transparent px-4 py-3 text-cream placeholder:text-cream/30 focus:border-copper focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs uppercase tracking-wide text-cream/50 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-sm border border-cream/20 bg-transparent px-4 py-3 text-cream placeholder:text-cream/30 focus:border-copper focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs uppercase tracking-wide text-cream/50 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full rounded-sm border border-cream/20 bg-transparent px-4 py-3 pr-11 text-cream placeholder:text-cream/30 focus:border-copper focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-xs uppercase tracking-wide text-cream/50 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className="w-full rounded-sm border border-cream/20 bg-transparent px-4 py-3 text-cream placeholder:text-cream/30 focus:border-copper focus:outline-none transition-colors"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-60">
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-cream/50 mt-8">
          Already have an account?{" "}
          <Link to="/signin" className="text-copper hover:text-copper-light">
            Sign in
          </Link>
        </p>
      </motion.div>
    </section>
  );
};

export default SignUp;
