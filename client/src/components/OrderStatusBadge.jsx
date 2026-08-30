const STATUS_STYLES = {
  Pending: "bg-cream/10 text-cream/70 border-cream/20",
  Confirmed: "bg-copper/10 text-copper border-copper/30",
  Preparing: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  Ready: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  "Out for Delivery": "bg-purple-500/10 text-purple-400 border-purple-500/30",
  Delivered: "bg-green-500/10 text-green-400 border-green-500/30",
  Cancelled: "bg-red-500/10 text-red-400 border-red-500/30",
};

const OrderStatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
      STATUS_STYLES[status] || STATUS_STYLES.Pending
    }`}
  >
    {status}
  </span>
);

export default OrderStatusBadge;
