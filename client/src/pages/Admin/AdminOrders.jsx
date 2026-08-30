import { useState, useEffect } from "react";
import { orderService } from "../../services/orderService.js";
import { formatPrice, formatDate } from "../../utils/format.js";

const STATUSES = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = () => {
    setLoading(true);
    orderService
      .getAllAdmin()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(loadOrders, []);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const updated = await orderService.updateStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
    } catch {
      // Silently ignore — could add a toast here in a real deployment
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = filter ? orders.filter((o) => o.status === filter) : orders;

  return (
    <div className="p-8 lg:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-charcoal mb-1">Orders</h1>
          <p className="text-charcoal/50 text-sm">{orders.length} total orders</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-sm border border-espresso/20 bg-white px-4 py-2 text-sm text-charcoal"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-charcoal/10 border-t-copper" />
      ) : (
        <div className="overflow-x-auto rounded-sm border border-espresso/10 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-espresso/10 text-left text-xs uppercase tracking-wide text-charcoal/50">
                <th className="px-5 py-4">Order ID</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Items</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Payment</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="border-b border-espresso/5 last:border-0">
                  <td className="px-5 py-4 font-mono text-xs text-charcoal">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-5 py-4 text-charcoal">
                    <div>{order.user?.name || "—"}</div>
                    <div className="text-xs text-charcoal/40">{order.user?.email}</div>
                  </td>
                  <td className="px-5 py-4 text-charcoal/70">{order.items.length} item(s)</td>
                  <td className="px-5 py-4 font-mono text-charcoal">{formatPrice(order.total)}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs rounded-full px-2.5 py-1 ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={order.status}
                      disabled={updatingId === order._id}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="rounded-sm border border-espresso/20 bg-cream px-2 py-1.5 text-xs text-charcoal disabled:opacity-50"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-xs text-charcoal/50">{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <p className="p-8 text-center text-sm text-charcoal/40">No orders match this filter.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
