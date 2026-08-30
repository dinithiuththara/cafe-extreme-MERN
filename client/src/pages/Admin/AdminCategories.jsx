import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { categoryService } from "../../services/productService.js";

const emptyForm = { name: "", slug: "", description: "", order: 0 };

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = () => {
    setLoading(true);
    categoryService.getAll().then(setCategories).finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingId(cat._id);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || "", order: cat.order });
    setError("");
    setModalOpen(true);
  };

  const handleNameChange = (name) => {
    setForm((f) => ({
      ...f,
      name,
      // Auto-generate a slug from the name when creating a new category
      slug: editingId ? f.slug : name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.slug) {
      setError("Name and slug are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, order: Number(form.order) || 0 };
      if (editingId) {
        await categoryService.update(editingId, payload);
      } else {
        await categoryService.create(payload);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category? Products in it will keep an orphaned reference.")) return;
    await categoryService.remove(id);
    loadData();
  };

  return (
    <div className="p-8 lg:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-charcoal mb-1">Categories</h1>
          <p className="text-charcoal/50 text-sm">{categories.length} categories</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary py-2.5">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-charcoal/10 border-t-copper" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div key={cat._id} className="rounded-sm border border-espresso/10 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-display text-lg text-charcoal">{cat.name}</h3>
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(cat)} className="text-charcoal/40 hover:text-copper">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(cat._id)} className="text-charcoal/40 hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-xs font-mono text-charcoal/40 mb-2">/{cat.slug}</p>
              <p className="text-sm text-charcoal/60">{cat.description}</p>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-6">
          <div className="w-full max-w-md rounded-sm bg-white p-6 shadow-premium">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-charcoal">
                {editingId ? "Edit Category" : "Add Category"}
              </h2>
              <button onClick={() => setModalOpen(false)} aria-label="Close">
                <X size={20} className="text-charcoal/50" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div>
                <label className="block text-xs uppercase tracking-wide text-charcoal/50 mb-1.5">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full rounded-sm border border-espresso/20 px-3 py-2.5 text-charcoal focus:border-copper focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-charcoal/50 mb-1.5">Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="w-full rounded-sm border border-espresso/20 px-3 py-2.5 font-mono text-sm text-charcoal focus:border-copper focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-charcoal/50 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full rounded-sm border border-espresso/20 px-3 py-2.5 text-charcoal focus:border-copper focus:outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-charcoal/50 mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
                  className="w-full rounded-sm border border-espresso/20 px-3 py-2.5 text-charcoal focus:border-copper focus:outline-none"
                />
              </div>

              <button type="submit" disabled={saving} className="btn-primary w-full mt-2 disabled:opacity-60">
                {saving ? "Saving..." : editingId ? "Save Changes" : "Create Category"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
