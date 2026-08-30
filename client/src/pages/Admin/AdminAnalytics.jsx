import { useState, useEffect } from "react";
import { adminService } from "../../services/adminService.js";
import { formatPrice } from "../../utils/format.js";
import BarChart from "../../components/admin/BarChart.jsx";

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats().then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-10">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-charcoal/10 border-t-copper" />
      </div>
    );
  }
  if (!stats) return <div className="p-10 text-charcoal/60">Failed to load analytics.</div>;

  const { revenueOverTime, popularProducts, orderStatusDistribution } = stats;

  return (
    <div className="p-8 lg:p-10">
      <h1 className="font-display text-3xl text-charcoal mb-1">Analytics</h1>
      <p className="text-charcoal/50 text-sm mb-8">Deeper look at sales and product performance.</p>

      <div className="grid grid-cols-1 gap-6">
        <div className="rounded-sm border border-espresso/10 bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg text-charcoal mb-5">Daily Revenue (Last 14 Days)</h2>
          <BarChart data={revenueOverTime} labelKey="_id" valueKey="revenue" formatValue={formatPrice} />
        </div>

        <div className="rounded-sm border border-espresso/10 bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg text-charcoal mb-5">Top Products by Units Sold</h2>
          <BarChart data={popularProducts} labelKey="_id" valueKey="quantitySold" />
        </div>

        <div className="rounded-sm border border-espresso/10 bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg text-charcoal mb-5">Top Products by Revenue</h2>
          <BarChart
            data={[...popularProducts].sort((a, b) => b.revenue - a.revenue)}
            labelKey="_id"
            valueKey="revenue"
            formatValue={formatPrice}
            color="#6F4E37"
          />
        </div>

        <div className="rounded-sm border border-espresso/10 bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg text-charcoal mb-5">Order Status Distribution</h2>
          <BarChart data={orderStatusDistribution} labelKey="_id" valueKey="count" color="#C9A15A" />
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
