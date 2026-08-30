import { useState, useEffect } from "react";
import { DollarSign, ShoppingCart, Users, Coffee } from "lucide-react";
import { adminService } from "../../services/adminService.js";
import { formatPrice } from "../../utils/format.js";
import BarChart from "../../components/admin/BarChart.jsx";

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-sm border border-espresso/10 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <Icon size={20} className="text-copper" />
    </div>
    <p className="text-2xl font-mono text-charcoal">{value}</p>
    <p className="text-xs uppercase tracking-wide text-charcoal/50 mt-1">{label}</p>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminService
      .getStats()
      .then(setStats)
      .catch(() => setError("Failed to load dashboard stats."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-10">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-charcoal/10 border-t-copper" />
      </div>
    );
  }

  if (error || !stats) {
    return <div className="p-10 text-charcoal/60">{error}</div>;
  }

  const { totals, revenueOverTime, popularProducts, orderStatusDistribution } = stats;

  return (
    <div className="p-8 lg:p-10">
      <h1 className="font-display text-3xl text-charcoal mb-1">Dashboard Overview</h1>
      <p className="text-charcoal/50 text-sm mb-8">A snapshot of Café Extreme's performance.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard icon={DollarSign} label="Total Revenue" value={formatPrice(totals.totalRevenue)} />
        <StatCard icon={ShoppingCart} label="Total Orders" value={totals.totalOrders} />
        <StatCard icon={Users} label="Total Users" value={totals.totalUsers} />
        <StatCard icon={Coffee} label="Total Products" value={totals.totalProducts} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-sm border border-espresso/10 bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg text-charcoal mb-5">Revenue (Last 14 Days)</h2>
          <BarChart
            data={revenueOverTime}
            labelKey="_id"
            valueKey="revenue"
            formatValue={formatPrice}
          />
        </div>

        <div className="rounded-sm border border-espresso/10 bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg text-charcoal mb-5">Popular Products</h2>
          <BarChart data={popularProducts} labelKey="_id" valueKey="quantitySold" />
        </div>

        <div className="rounded-sm border border-espresso/10 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="font-display text-lg text-charcoal mb-5">Order Status Distribution</h2>
          <BarChart data={orderStatusDistribution} labelKey="_id" valueKey="count" color="#6F4E37" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
