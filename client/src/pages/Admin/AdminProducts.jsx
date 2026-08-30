import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { productService, categoryService } from "../../services/productService.js";
import { formatPrice } from "../../utils/format.js";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "/images/placeholder-coffee.jpg",
  isAvailable: true,
  isFeatured: false,
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([productService.getAll(), categoryService.getAll()])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);
      })
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({ ...emptyForm, category: categories[0]?._id || "" });
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category?._id || product.category,
      image: product.image,
      isAvailable: product.isAvailable,
      isFeatured: product.isFeatured,
    });
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.price || !form.category) {
      setError("Name, price and category are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      if (editingId) {
        await productService.update(editingId, payload);
      } else {
        await productService.create(payload);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    await productService.remove(id);
    loadData();
  };

  const handleToggle = async (product, field) => {
    await productService.update(product._id, { [field]: !product[field] });
    loadData();
  };

  return (
    <div className="p-8 lg:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-charcoal mb-1">Products</h1>
          <p className="text-charcoal/50 text-sm">{products.length} items on the menu</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary py-2.5">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-charcoal/10 border-t-copper" />
      ) : (
        <div className="overflow-x-auto rounded-sm border border-espresso/10 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-espresso/10 text-left text-xs uppercase tracking-wide text-charcoal/50">
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Available</th>
                <th className="px-5 py-4">Featured</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-espresso/5 last:border-0">
                  <td className="px-5 py-4 text-charcoal font-medium">{product.name}</td>
                  <td className="px-5 py-4 text-charcoal/60">{product.category?.name}</td>
                  <td className="px-5 py-4 font-mono text-charcoal">{formatPrice(product.price)}</td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleToggle(product, "isAvailable")}
                      className={`text-xs rounded-full px-2.5 py-1 ${
                        product.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.isAvailable ? "Available" : "Unavailable"}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleToggle(product, "isFeatured")}
                      className={`text-xs rounded-full px-2.5 py-1 ${
                        product.isFeatured ? "bg-copper/20 text-copper-dark" : "bg-charcoal/5 text-charcoal/40"
                      }`}
                    >
                      {product.isFeatured ? "Featured" : "Standard"}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => openEditModal(product)}
                        aria-label="Edit"
                        className="text-charcoal/50 hover:text-copper"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        aria-label="Delete"
                        className="text-charcoal/50 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-6">
          <div className="w-full max-w-lg rounded-sm bg-white p-6 shadow-premium">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-charcoal">
                {editingId ? "Edit Product" : "Add Product"}
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
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-sm border border-espresso/20 px-3 py-2.5 text-charcoal focus:border-copper focus:outline-none"
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-charcoal/50 mb-1.5">
                    Price (Rs)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    className="w-full rounded-sm border border-espresso/20 px-3 py-2.5 text-charcoal focus:border-copper focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-charcoal/50 mb-1.5">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full rounded-sm border border-espresso/20 px-3 py-2.5 text-charcoal focus:border-copper focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-charcoal/50 mb-1.5">
                  Image URL
                </label>
                <input
                  value={form.image}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  className="w-full rounded-sm border border-espresso/20 px-3 py-2.5 text-charcoal focus:border-copper focus:outline-none"
                />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-charcoal">
                  <input
                    type="checkbox"
                    checked={form.isAvailable}
                    onChange={(e) => setForm((f) => ({ ...f, isAvailable: e.target.checked }))}
                  />
                  Available
                </label>
                <label className="flex items-center gap-2 text-sm text-charcoal">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                  />
                  Featured
                </label>
              </div>

              <button type="submit" disabled={saving} className="btn-primary w-full mt-2 disabled:opacity-60">
                {saving ? "Saving..." : editingId ? "Save Changes" : "Create Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
