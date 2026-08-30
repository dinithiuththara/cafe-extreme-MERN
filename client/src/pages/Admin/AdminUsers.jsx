import { useState, useEffect } from "react";
import { adminService } from "../../services/adminService.js";
import { formatDate } from "../../utils/format.js";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadUsers = () => {
    setLoading(true);
    adminService.getAllUsers().then(setUsers).finally(() => setLoading(false));
  };

  useEffect(loadUsers, []);

  const handleToggleStatus = async (user) => {
    setUpdatingId(user._id);
    try {
      await adminService.updateUserStatus(user._id, !user.isActive);
      setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, isActive: !u.isActive } : u)));
    } catch {
      // Ignore — e.g. attempting to deactivate own account, which the API blocks
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-8 lg:p-10">
      <h1 className="font-display text-3xl text-charcoal mb-1">Users</h1>
      <p className="text-charcoal/50 text-sm mb-8">{users.length} registered accounts</p>

      {loading ? (
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-charcoal/10 border-t-copper" />
      ) : (
        <div className="overflow-x-auto rounded-sm border border-espresso/10 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-espresso/10 text-left text-xs uppercase tracking-wide text-charcoal/50">
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Orders</th>
                <th className="px-5 py-4">Joined</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-espresso/5 last:border-0">
                  <td className="px-5 py-4 text-charcoal font-medium">{user.name}</td>
                  <td className="px-5 py-4 text-charcoal/60">{user.email}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs rounded-full px-2.5 py-1 ${
                        user.role === "admin" ? "bg-copper/20 text-copper-dark" : "bg-charcoal/5 text-charcoal/50"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-charcoal/70">{user.orderCount}</td>
                  <td className="px-5 py-4 text-xs text-charcoal/50">{formatDate(user.createdAt)}</td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleToggleStatus(user)}
                      disabled={updatingId === user._id || user.role === "admin"}
                      className={`text-xs rounded-full px-2.5 py-1 disabled:opacity-40 ${
                        user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.isActive ? "Active" : "Deactivated"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
