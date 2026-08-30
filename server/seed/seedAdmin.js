// Creates (or updates) the admin account using credentials from .env
// Run with: npm run seed:admin  (from the /server folder)

import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const run = async () => {
  await connectDB();

  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Missing ADMIN_NAME, ADMIN_EMAIL or ADMIN_PASSWORD in .env");
    process.exit(1);
  }

  const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });

  if (existing) {
    existing.role = "admin";
    existing.name = ADMIN_NAME;
    existing.password = ADMIN_PASSWORD; // re-hashed automatically by the pre-save hook
    existing.isActive = true;
    await existing.save();
    console.log(`Existing user ${ADMIN_EMAIL} promoted to admin and password synced from .env.`);
  } else {
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD, // hashed automatically by the User model
      role: "admin",
    });
    console.log(`Admin account created: ${ADMIN_EMAIL}`);
  }

  process.exit(0);
};

run().catch((err) => {
  console.error("Admin seeding failed:", err);
  process.exit(1);
});