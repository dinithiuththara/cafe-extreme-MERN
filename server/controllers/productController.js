import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

// @route  GET /api/products
// @desc   List products. Supports ?category=slug-or-id, ?search=text, ?featured=true
// @access Public
export const getProducts = async (req, res, next) => {
  try {
    const { category, search, featured } = req.query;
    const filter = {};

    if (category) {
      // Accept either a Mongo ObjectId or a human-readable slug (e.g. "iced-coffee")
      if (mongoose.Types.ObjectId.isValid(category)) {
        filter.category = category;
      } else {
        const categoryDoc = await Category.findOne({ slug: category });
        // If the slug doesn't match anything, force an empty result set
        // rather than accidentally returning all products.
        filter.category = categoryDoc ? categoryDoc._id : null;
      }
    }
    if (featured === "true") filter.isFeatured = true;
    if (search) filter.$text = { $search: search };

    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/products/:id
// @access Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name slug");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @route  POST /api/products
// @access Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @route  PUT /api/products/:id
// @access Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @route  DELETE /api/products/:id
// @access Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};
