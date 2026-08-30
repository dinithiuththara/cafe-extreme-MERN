import mongoose from "mongoose";

// A single choice inside an add-on group, e.g. { label: "Coconut Milk", priceDelta: 150 }
const addOnOptionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    priceDelta: { type: Number, required: true, default: 0 }, // extra cost in Rs, 0 = free
  },
  { _id: false }
);

// A group of add-on options, e.g. "Milk Choice" (required, pick one)
// or "Extra Shot" (optional, pick one or none)
const addOnGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // "Milk Choice", "Extra Shot"
    type: {
      type: String,
      enum: ["required-single", "optional-single"],
      default: "optional-single",
    },
    options: [addOnOptionSchema],
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image: {
      type: String,
      default: "https://placehold.co/600x600/3B2A20/F5EDE0?text=Cafe+Extreme",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    addOns: {
      type: [addOnGroupSchema],
      default: [],
    },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text" });

export default mongoose.model("Product", productSchema);
