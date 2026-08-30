import { useState, useEffect } from "react";
import { adminService } from "../../services/adminService.js";
import { formatPrice, formatDate } from "../../utils/format.js";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getPayments().then(setPayments).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 lg:p-10">
      <h1 className="font-display text-3xl text-charcoal mb-1">Payments</h1>
      <p className="text-charcoal/50 text-sm mb-8">{payments.length} payment records</p>

      {loading ? (
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-charcoal/10 border-t-copper" />
      ) : (
        <div className="overflow-x-auto rounded-sm border border-espresso/10 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-espresso/10 text-left text-xs uppercase tracking-wide text-charcoal/50">
                <th className="px-5 py-4">Reference</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Gateway</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="border-b border-espresso/5 last:border-0">
                  <td className="px-5 py-4 font-mono text-xs text-charcoal">{p.gatewayReferenceId}</td>
                  <td className="px-5 py-4 text-charcoal/70">{p.user?.name || "—"}</td>
                  <td className="px-5 py-4">
                    <span className="text-xs rounded-full px-2.5 py-1 bg-charcoal/5 text-charcoal/60 capitalize">
                      {p.gateway}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-charcoal">{formatPrice(p.amount)}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs rounded-full px-2.5 py-1 ${
                        p.status === "succeeded"
                          ? "bg-green-100 text-green-700"
                          : p.status === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-charcoal/50">{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {payments.length === 0 && (
            <p className="p-8 text-center text-sm text-charcoal/40">No payments recorded yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
