import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  User as UserIcon,
  Heart,
  Settings,
  Package,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";
import { orderService } from "../services/orderService.js";
import { userService } from "../services/userService.js";
import { formatPrice, formatDate } from "../utils/format.js";
import OrderStatusBadge from "../components/OrderStatusBadge.jsx";
import ProductCard from "../components/ProductCard.jsx";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orders", label: "My Orders", icon: ShoppingBag },
  { id: "profile", label: "Profile", icon: UserIcon },
  { id: "favorites", label: "Favorites", icon: Heart },
  { id: "settings", label: "Account Settings", icon: Settings },
];

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);

  useEffect(() => {
    orderService
      .getMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === "favorites") {
      setFavoritesLoading(true);
      userService
        .getFavorites()
        .then(setFavorites)
        .catch(() => setFavorites([]))
        .finally(() => setFavoritesLoading(false));
    }
  }, [activeTab]);

  return (
    <section className="pt-28 pb-24 px-6 lg:px-12">
      <div className="container-premium">
        <h1 className="font-display text-4xl text-cream mb-2">Your Dashboard</h1>
        <p className="text-cream/50 mb-10">Welcome back, {user?.name}.</p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <nav className="lg:col-span-1 flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex shrink-0 items-center gap-3 rounded-sm border px-4 py-3 text-sm whitespace-nowrap transition-colors ${
                  activeTab === id
                    ? "border-copper bg-copper/10 text-copper"
                    : "border-cream/10 text-cream/60 hover:border-cream/30 hover:text-cream"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>

          <div className="lg:col-span-3">
            {activeTab === "overview" && (
              <OverviewTab user={user} orders={orders} loading={ordersLoading} />
            )}
            {activeTab === "orders" && <OrdersTab orders={orders} loading={ordersLoading} />}
            {activeTab === "profile" && <ProfileTab user={user} updateUser={updateUser} />}
            {activeTab === "favorites" && (
              <FavoritesTab favorites={favorites} loading={favoritesLoading} />
            )}
            {activeTab === "settings" && <SettingsTab />}
          </div>
        </div>
      </div>
    </section>
  );
};

const OverviewTab = ({ user, orders, loading }) => {
  const recentOrders = orders.slice(0, 3);
  return (
    <motion.div {...fadeIn} className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-sm border border-cream/10 bg-espresso/30 p-6">
          <Package size={20} className="text-copper mb-3" />
          <p className="text-2xl font-mono text-cream">{orders.length}</p>
          <p className="text-xs text-cream/50 uppercase tracking-wide mt-1">Total Orders</p>
        </div>
        <div className="rounded-sm border border-cream/10 bg-espresso/30 p-6">
          <ShoppingBag size={20} className="text-copper mb-3" />
          <div className="mt-1">
            {recentOrders[0] ? <OrderStatusBadge status={recentOrders[0].status} /> : <span className="text-cream/40 text-sm">—</span>}
          </div>
          <p className="text-xs text-cream/50 uppercase tracking-wide mt-3">Latest Order Status</p>
        </div>
        <div className="rounded-sm border border-cream/10 bg-espresso/30 p-6">
          <UserIcon size={20} className="text-copper mb-3" />
          <p className="text-sm text-cream truncate">{user?.email}</p>
          <p className="text-xs text-cream/50 uppercase tracking-wide mt-1">Account Email</p>
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl text-cream mb-4">Recent Orders</h2>
        {loading && <p className="text-cream/40 text-sm">Loading...</p>}
        {!loading && recentOrders.length === 0 && (
          <p className="text-cream/40 text-sm">You haven't placed any orders yet.</p>
        )}
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <div
              key={order._id}
              className="flex items-center justify-between rounded-sm border border-cream/10 bg-espresso/20 p-4"
            >
              <div>
                <p className="text-sm text-cream font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-cream/40 mt-1">{formatDate(order.createdAt)}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-copper text-sm">{formatPrice(order.total)}</span>
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const OrdersTab = ({ orders, loading }) => (
  <motion.div {...fadeIn}>
    <h2 className="font-display text-xl text-cream mb-5">Order History</h2>
    {loading && <p className="text-cream/40 text-sm">Loading...</p>}
    {!loading && orders.length === 0 && (
      <p className="text-cream/40 text-sm">You haven't placed any orders yet.</p>
    )}
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order._id} className="rounded-sm border border-cream/10 bg-espresso/20 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div>
              <p className="text-sm text-cream font-mono">#{order._id.slice(-8).toUpperCase()}</p>
              <p className="text-xs text-cream/40 mt-1">{formatDate(order.createdAt)}</p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="space-y-1 mb-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-xs text-cream/60">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span className="font-mono">{formatPrice(item.lineTotal)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between border-t border-cream/10 pt-3 text-sm">
            <span className="text-cream/60">Total</span>
            <span className="font-mono text-copper">{formatPrice(order.total)}</span>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

const ProfileTab = ({ user, updateUser }) => {
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);
    try {
      const data = await userService.updateProfile(form);
      updateUser(data.user);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div {...fadeIn} className="max-w-lg">
      <h2 className="font-display text-xl text-cream mb-5">Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {message && <p className="text-sm text-green-400">{message}</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}

        <div>
          <label className="block text-xs uppercase tracking-wide text-cream/50 mb-2">Full Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full rounded-sm border border-cream/20 bg-transparent px-4 py-3 text-cream focus:border-copper focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-cream/50 mb-2">Email</label>
          <input
            value={user?.email || ""}
            disabled
            className="w-full rounded-sm border border-cream/10 bg-cream/5 px-4 py-3 text-cream/50 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-cream/50 mb-2">Phone</label>
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="07X XXX XXXX"
            className="w-full rounded-sm border border-cream/20 bg-transparent px-4 py-3 text-cream placeholder:text-cream/30 focus:border-copper focus:outline-none"
          />
        </div>
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </motion.div>
  );
};

const FavoritesTab = ({ favorites, loading }) => {
  if (loading) return <p className="text-cream/40 text-sm">Loading...</p>;
  if (favorites.length === 0) {
    return (
      <motion.div {...fadeIn}>
        <Heart size={28} className="text-cream/20 mb-4" />
        <p className="text-cream/40 text-sm">You haven't favorited anything yet.</p>
      </motion.div>
    );
  }
  return (
    <motion.div {...fadeIn}>
      <h2 className="font-display text-xl text-cream mb-5">Favorites</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {favorites.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </motion.div>
  );
};

const SettingsTab = () => {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (form.newPassword !== form.confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      await userService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setMessage("Password updated successfully.");
      setForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div {...fadeIn} className="max-w-lg">
      <h2 className="font-display text-xl text-cream mb-5">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {message && <p className="text-sm text-green-400">{message}</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}

        <div>
          <label className="block text-xs uppercase tracking-wide text-cream/50 mb-2">Current Password</label>
          <input
            type="password"
            value={form.currentPassword}
            onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))}
            className="w-full rounded-sm border border-cream/20 bg-transparent px-4 py-3 text-cream focus:border-copper focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-cream/50 mb-2">New Password</label>
          <input
            type="password"
            value={form.newPassword}
            onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
            className="w-full rounded-sm border border-cream/20 bg-transparent px-4 py-3 text-cream focus:border-copper focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-cream/50 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            value={form.confirmNewPassword}
            onChange={(e) => setForm((f) => ({ ...f, confirmNewPassword: e.target.value }))}
            className="w-full rounded-sm border border-cream/20 bg-transparent px-4 py-3 text-cream focus:border-copper focus:outline-none"
          />
        </div>
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? "Updating..." : "Update Password"}
        </button>
      </form>
    </motion.div>
  );
};

export default Dashboard;
