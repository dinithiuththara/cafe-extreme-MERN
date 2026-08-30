import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const DELIVERY_FEE = 300;

// Recomputes prices server-side from the database rather than trusting
// whatever the client sends — prevents a tampered request from checking
// out at a fake price.
const buildValidatedItems = async (cartItems) => {
  const items = [];

  for (const cartItem of cartItems) {
    const product = await Product.findById(cartItem.productId);
    if (!product) {
      throw Object.assign(new Error(`Product not found: ${cartItem.productId}`), { status: 400 });
    }
    if (!product.isAvailable) {
      throw Object.assign(new Error(`"${product.name}" is currently unavailable`), { status: 400 });
    }

    const selectedAddOns = cartItem.selectedAddOns || [];
    // Validate each selected add-on actually exists on this product,
    // and use the server's priceDelta (not whatever the client sent).
    const validatedAddOns = selectedAddOns.map((sel) => {
      const group = product.addOns.find((g) => g.name === sel.groupName);
      const option = group?.options.find((o) => o.label === sel.optionLabel);
      if (!group || !option) {
        throw Object.assign(
          new Error(`Invalid add-on selection for "${product.name}"`),
          { status: 400 }
        );
      }
      return { groupName: group.name, optionLabel: option.label, priceDelta: option.priceDelta };
    });

    const addOnTotal = validatedAddOns.reduce((sum, a) => sum + a.priceDelta, 0);
    const unitPrice = product.price + addOnTotal;
    const quantity = Math.max(1, Number(cartItem.quantity) || 1);

    items.push({
      product: product._id,
      name: product.name,
      image: product.image,
      unitPrice,
      quantity,
      selectedAddOns: validatedAddOns,
      lineTotal: unitPrice * quantity,
    });
  }

  return items;
};

// @route  POST /api/orders
// @desc   Create a new order from the cart. Prices are recomputed server-side.
// @access Private
export const createOrder = async (req, res, next) => {
  try {
    const { items: cartItems, deliveryAddress, paymentMethod } = req.body;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }
    const { fullName, phone, email, address } = deliveryAddress || {};
    if (!fullName || !phone || !email || !address) {
      return res.status(400).json({ message: "Complete delivery details are required" });
    }

    const items = await buildValidatedItems(cartItems);
    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const deliveryFee = DELIVERY_FEE;
    const total = subtotal + deliveryFee;

    // The order is always created as "pending" payment. If the customer
    // chose to pay by card, the frontend immediately calls
    // POST /api/payments/:orderId/charge right after this (see paymentService)
    // to actually process payment. Cash-on-delivery orders simply stay
    // pending until payment is collected at delivery.
    const order = await Order.create({
      user: req.user._id,
      items,
      subtotal,
      deliveryFee,
      total,
      deliveryAddress: { fullName, phone, email, address },
      paymentMethod: paymentMethod === "card" ? "card" : "cash-on-delivery",
      paymentStatus: "pending",
      status: "Pending",
    });

    res.status(201).json(order);
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    next(error);
  }
};

// @route  GET /api/orders
// @desc   Get the logged-in user's own orders
// @access Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/orders/admin/all
// @desc   Get every order in the system (admin only)
// @access Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @route  PUT /api/orders/:id/status
// @desc   Update an order's status (admin only)
// @access Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      "Pending",
      "Confirmed",
      "Preparing",
      "Ready",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};
// @route  GET /api/orders/:id
// @desc   Get a single order. Owner or admin only.
// @access Private
export const getOrderById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Order not found" });
    }
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const isOwner = order.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};
