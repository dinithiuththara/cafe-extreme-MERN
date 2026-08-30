import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Payment from "../models/Payment.js";

// @route  GET /api/admin/stats
// @desc   Aggregated dashboard metrics: totals, revenue/orders over time,
//         popular products, order status distribution.
// @access Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalProducts, totalOrders, revenueAgg] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // Last 14 days of paid revenue, grouped by day
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const revenueOverTime = await Order.aggregate([
      { $match: { paymentStatus: "paid", createdAt: { $gte: fourteenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const popularProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          quantitySold: { $sum: "$items.quantity" },
          revenue: { $sum: "$items.lineTotal" },
        },
      },
      { $sort: { quantitySold: -1 } },
      { $limit: 5 },
    ]);

    const orderStatusDistribution = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      totals: { totalRevenue, totalOrders, totalUsers, totalProducts },
      revenueOverTime,
      popularProducts,
      orderStatusDistribution,
    });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/admin/payments
// @desc   List all payment records (admin only)
// @access Private/Admin
export const getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate("order", "total status")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    next(error);
  }
};
