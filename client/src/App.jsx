import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import { ProtectedRoute, AdminRoute } from "./components/RouteGuards.jsx";

import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import HotCoffee from "./pages/HotCoffee.jsx";
import IcedCoffee from "./pages/IcedCoffee.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";

import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import AdminOrders from "./pages/Admin/AdminOrders.jsx";
import AdminProducts from "./pages/Admin/AdminProducts.jsx";
import AdminCategories from "./pages/Admin/AdminCategories.jsx";
import AdminUsers from "./pages/Admin/AdminUsers.jsx";
import AdminPayments from "./pages/Admin/AdminPayments.jsx";
import AdminAnalytics from "./pages/Admin/AdminAnalytics.jsx";
import AdminSettings from "./pages/Admin/AdminSettings.jsx";

function App() {
  return (
    <Routes>
      {/* Customer-facing site */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/hot-coffee" element={<HotCoffee />} />
        <Route path="/menu/iced-coffee" element={<IcedCoffee />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Requires login */}
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin panel — requires admin role */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
