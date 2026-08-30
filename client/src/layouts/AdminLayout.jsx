import { NavLink, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Coffee,
  Tags,
  Users,
  CreditCard,
  BarChart3,
  Settings,
} from "lucide-react";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/products", label: "Products", icon: Coffee },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

// The admin panel uses a lighter, data-dense visual language (white/beige
// surfaces, sharp grid) — distinct from the cinematic customer site, while
// keeping the same copper accent and typography for brand continuity.
const AdminLayout = () => {
  return (
    <div className="min-h-screen flex bg-cream text-charcoal font-body">
      <aside className="w-64 shrink-0 bg-charcoal text-cream flex flex-col">
        <Link to="/" className="px-6 py-6 border-b border-cream/10 font-display text-lg">
          CAFÉ <span className="text-copper">EXTREME</span>
          <div className="text-[10px] tracking-widest2 uppercase text-cream/40 mt-1">Admin</div>
        </Link>
        <nav className="flex-1 py-4">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                  isActive ? "bg-copper/10 text-copper border-r-2 border-copper" : "text-cream/70 hover:bg-cream/5 hover:text-cream"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
