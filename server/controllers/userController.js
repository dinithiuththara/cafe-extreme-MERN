import User from "../models/User.js";

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  favorites: user.favorites,
  createdAt: user.createdAt,
});

// @route  PUT /api/users/me
// @desc   Update the logged-in user's name/phone
// @access Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;

    await user.save();
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

// @route  PUT /api/users/me/password
// @desc   Change the logged-in user's password
// @access Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword; // re-hashed automatically by the pre-save hook
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/users/favorites
// @desc   Get the logged-in user's favorite products (populated)
// @access Private
export const getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "favorites",
      populate: { path: "category", select: "name slug" },
    });
    res.json(user.favorites);
  } catch (error) {
    next(error);
  }
};

// @route  POST /api/users/favorites/:productId
// @desc   Toggle a product in the logged-in user's favorites
// @access Private
export const toggleFavorite = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    const index = user.favorites.findIndex((id) => id.toString() === productId);
    let isFavorite;
    if (index === -1) {
      user.favorites.push(productId);
      isFavorite = true;
    } else {
      user.favorites.splice(index, 1);
      isFavorite = false;
    }

    await user.save();
    res.json({ isFavorite, favorites: user.favorites });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/users/admin/all
// @desc   List every registered user, with their order count (admin only)
// @access Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "user",
          as: "orders",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          role: 1,
          isActive: 1,
          createdAt: 1,
          orderCount: { $size: "$orders" },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @route  PUT /api/users/admin/:id/status
// @desc   Activate or deactivate a user account (admin only)
// @access Private/Admin
export const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot deactivate your own account" });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(publicUser(user));
  } catch (error) {
    next(error);
  }
};
