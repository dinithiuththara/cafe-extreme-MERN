import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { userService } from "../../services/userService.js";

const AdminSettings = () => {
  const { user } = useAuth();
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
    <div className="p-8 lg:p-10 max-w-lg">
      <h1 className="font-display text-3xl text-charcoal mb-1">Settings</h1>
      <p className="text-charcoal/50 text-sm mb-8">Manage your admin account.</p>

      <div className="rounded-sm border border-espresso/10 bg-white p-6 shadow-sm mb-6">
        <h2 className="font-display text-lg text-charcoal mb-3">Account</h2>
        <p className="text-sm text-charcoal/70">{user?.name}</p>
        <p className="text-sm text-charcoal/50">{user?.email}</p>
      </div>

      <div className="rounded-sm border border-espresso/10 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg text-charcoal mb-5">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {message && <p className="text-sm text-green-600">{message}</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <input
            type="password"
            placeholder="Current password"
            value={form.currentPassword}
            onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))}
            className="w-full rounded-sm border border-espresso/20 px-3 py-2.5 text-charcoal focus:border-copper focus:outline-none"
          />
          <input
            type="password"
            placeholder="New password"
            value={form.newPassword}
            onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
            className="w-full rounded-sm border border-espresso/20 px-3 py-2.5 text-charcoal focus:border-copper focus:outline-none"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={form.confirmNewPassword}
            onChange={(e) => setForm((f) => ({ ...f, confirmNewPassword: e.target.value }))}
            className="w-full rounded-sm border border-espresso/20 px-3 py-2.5 text-charcoal focus:border-copper focus:outline-none"
          />
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
