import jwt from "jsonwebtoken";

// Creates a signed JWT containing the user's id.
// Expiry is controlled by JWT_EXPIRES_IN in .env (default 7d).
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};
