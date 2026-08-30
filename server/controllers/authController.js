import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

// Shape the user object we send back to the client (never include password)
const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  createdAt: user.createdAt,
});

// @route  POST /api/auth/register
// @access Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      user: publicUser(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @route  POST /api/auth/login
// @access Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // password has `select: false` on the schema, so explicitly request it
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: "This account has been deactivated" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      user: publicUser(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/auth/me
// @access Private
export const getCurrentUser = async (req, res, next) => {
  try {
    res.json({ user: publicUser(req.user) });
  } catch (error) {
    next(error);
  }
};
