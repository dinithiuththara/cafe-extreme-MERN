// Seeds the database with the REAL Café Extreme menu (from the uploaded
// menu photo). Run with: npm run seed  (from the /server folder)
//
// Prices are in Sri Lankan Rupees (Rs), matching the source menu.

import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

dotenv.config();

// Generates a clean branded placeholder image for a product, so the menu
// looks intentional even before real product photography is uploaded.
// Swap these out later via the admin panel — see README "How to add products".
const placeholderImage = (name) =>
  `https://placehold.co/600x600/3B2A20/F5EDE0?text=${encodeURIComponent(name)}`;

// --- Shared add-on groups -------------------------------------------------

const milkChoice = {
  name: "Milk Choice",
  type: "required-single",
  options: [
    { label: "Cow Milk", priceDelta: 0 },
    { label: "Coconut Milk", priceDelta: 150 },
  ],
};

const extraShot = {
  name: "Extra Shot",
  type: "optional-single",
  options: [
    { label: "No Extra Shot", priceDelta: 0 },
    { label: "Add Extra Shot", priceDelta: 150 },
  ],
};

const cinnamon = {
  name: "Cinnamon",
  type: "optional-single",
  options: [
    { label: "No Cinnamon", priceDelta: 0 },
    { label: "Add Cinnamon", priceDelta: 0 }, // free per menu
  ],
};

// --- Categories ------------------------------------------------------------

const categories = [
  { name: "Hot Coffee", slug: "hot-coffee", order: 1, description: "Classic hot espresso-based coffee." },
  { name: "Iced Coffee", slug: "iced-coffee", order: 2, description: "Chilled espresso-based coffee." },
  { name: "Iced Tea", slug: "iced-tea", order: 3, description: "Refreshing cold teas and infusions." },
];

// --- Products (name, description, price, categorySlug, addOns, featured) --

const products = [
  // COFFEE
  { name: "Espresso", description: "A concentrated shot of rich, bold espresso.", price: 550, categorySlug: "hot-coffee", addOns: [extraShot], isFeatured: true },
  { name: "Espresso (Lungo)", description: "A longer pull of espresso for a smoother, milder taste.", price: 550, categorySlug: "hot-coffee", addOns: [extraShot] },
  { name: "Espresso Macchiato", description: "Espresso 'stained' with a touch of steamed milk foam.", price: 600, categorySlug: "hot-coffee", addOns: [milkChoice, extraShot] },
  { name: "Double Espresso", description: "Two shots of espresso for an extra bold kick.", price: 1100, categorySlug: "hot-coffee", addOns: [extraShot] },
  { name: "Caffè Americano", description: "Espresso diluted with hot water for a lighter body.", price: 600, categorySlug: "hot-coffee", addOns: [extraShot] },
  { name: "Caffè Latte", description: "Smooth espresso with double shots and silky steamed milk.", price: 1300, categorySlug: "hot-coffee", addOns: [milkChoice, cinnamon, extraShot], isFeatured: true },
  { name: "Cappuccino", description: "Espresso topped with steamed milk and a thick layer of foam.", price: 800, categorySlug: "hot-coffee", addOns: [milkChoice, cinnamon, extraShot], isFeatured: true },
  { name: "Mocha", description: "Double shot espresso blended with chocolate and steamed milk.", price: 1500, categorySlug: "hot-coffee", addOns: [milkChoice, extraShot] },
  { name: "Flat White", description: "Espresso with a thin layer of velvety micro-foam milk.", price: 800, categorySlug: "hot-coffee", addOns: [milkChoice, extraShot] },
  { name: "Piccolo Latte", description: "A small, strong latte with a bold espresso-to-milk ratio.", price: 700, categorySlug: "hot-coffee", addOns: [milkChoice, extraShot] },

  // ICED COFFEE
  { name: "Iced Americano", description: "Chilled espresso and water served over ice.", price: 650, categorySlug: "iced-coffee", addOns: [extraShot], isFeatured: true },
  { name: "Iced Cappuccino", description: "Espresso, milk and foam, shaken and served cold.", price: 850, categorySlug: "iced-coffee", addOns: [milkChoice, extraShot] },
  { name: "Iced Caffè Latte", description: "Double shot espresso with cold milk over ice.", price: 1350, categorySlug: "iced-coffee", addOns: [milkChoice, extraShot] },
  { name: "Iced Mocha", description: "Double shot espresso, chocolate and cold milk over ice.", price: 1550, categorySlug: "iced-coffee", addOns: [milkChoice, extraShot] },

  // ICED TEA
  { name: "Black Tea", description: "Classic chilled black tea, brewed fresh.", price: 550, categorySlug: "iced-tea" },
  { name: "Lime Tea", description: "Black tea infused with fresh, zesty lime.", price: 600, categorySlug: "iced-tea" },
  { name: "Butterfly Pea Flower Tea (Blue Tea)", description: "A vibrant blue floral tea, light and aromatic.", price: 650, categorySlug: "iced-tea", isFeatured: true },
  { name: "Hibiscus Tea", description: "Tart and fruity hibiscus infusion, served cold.", price: 650, categorySlug: "iced-tea" },
  { name: "Passion Fruit Iced Tea", description: "Tea brightened with sweet-tart passion fruit.", price: 750, categorySlug: "iced-tea" },
];

const run = async () => {
  await connectDB();

  console.log("Clearing existing categories and products...");
  await Category.deleteMany({});
  await Product.deleteMany({});

  console.log("Inserting categories...");
  const createdCategories = await Category.insertMany(categories);
  const slugToId = Object.fromEntries(createdCategories.map((c) => [c.slug, c._id]));

  console.log("Inserting products...");
  const productsToInsert = products.map(({ categorySlug, ...p }) => ({
    ...p,
    image: p.image || placeholderImage(p.name),
    category: slugToId[categorySlug],
  }));
  await Product.insertMany(productsToInsert);

  console.log(`Done. Seeded ${createdCategories.length} categories and ${productsToInsert.length} products.`);
  process.exit(0);
};

run().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
