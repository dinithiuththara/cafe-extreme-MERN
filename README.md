# Café Extreme

A full-stack, premium coffee-shop ordering platform built with the MERN stack
(MongoDB, Express, React, Node.js).

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [MongoDB Setup](#mongodb-setup)
- [Running the App](#running-the-app)
- [Seeding the Menu](#seeding-the-menu)
- [Creating an Admin Account](#creating-an-admin-account)
- [Payment Setup](#payment-setup)
- [Adding / Editing Products](#adding--editing-products)
- [Replacing the Hero Video](#replacing-the-hero-video)
- [Deployment Notes](#deployment-notes)

---

## Overview

Café Extreme is a complete online ordering system: customers browse a real
menu, add items (with configurable add-ons like milk choice and extra
shots), check out, pay (Stripe-ready with an automatic demo mode), and
track their order status from a personal dashboard. Admins manage the
entire operation — menu, categories, orders, users, and sales — from a
separate admin panel.

## Features

**Customer-facing**
- Cinematic video hero homepage with featured products, categories, brand
  story, and location info
- Full menu with category filters and live search
- Product details with configurable add-ons (milk choice, extra shot) and
  live price updates
- Cart with quantity controls and persistent storage
- Checkout with delivery details and payment method selection
- Stripe-ready payments (automatic demo mode without real keys)
- Order confirmation and full order history
- User dashboard: overview, orders, profile, favorites, account settings
- JWT authentication with protected routes

**Admin panel**
- Dashboard with revenue/orders/users/products totals and charts
- Product management (create/edit/delete, availability, featured status)
- Category management
- Order management with status updates
- User management (view accounts, activate/deactivate)
- Payment records
- Analytics (revenue over time, top products, order status distribution)

## Technologies

**Frontend:** React 18, Vite, Tailwind CSS, React Router, Axios, Framer
Motion, Lucide React

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Stripe SDK

## Folder Structure

```
cafe-extreme/
├── client/                 React + Vite frontend
│   ├── public/videos/      Hero video goes here
│   └── src/
│       ├── components/     Reusable UI (Navbar, Footer, ProductCard, home/*, admin/*)
│       ├── pages/          Route-level pages (+ pages/Admin for the admin panel)
│       ├── layouts/        MainLayout, AdminLayout
│       ├── context/        AuthContext, CartContext
│       ├── hooks/          useAuth, useCart, useProducts
│       ├── services/       Axios wrappers per API resource
│       └── utils/          Formatting helpers
│
├── server/                 Node/Express backend
│   ├── config/             MongoDB connection
│   ├── models/             User, Product, Category, Order, Payment
│   ├── controllers/        Route handler logic
│   ├── routes/             Express routers
│   ├── middleware/         Auth (JWT), error handling
│   ├── services/           paymentService.js (Stripe-ready, gateway-agnostic)
│   └── seed/                seedProducts.js, seedAdmin.js
│
├── .env.example
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB (local install or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- npm

## Installation

```bash
# From the project root
cd server && npm install
cd ../client && npm install
```

## Environment Variables

Copy `.env.example` to `server/.env` and fill in real values:

```bash
cp .env.example server/.env
```

| Variable | Description |
|---|---|
| `PORT` | Backend port (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign auth tokens |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used by `npm run seed:admin` |
| `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` | Optional — leave blank for demo payment mode |

The client reads `VITE_API_URL` (optional in dev, since Vite proxies
`/api` to the backend automatically — see `client/vite.config.js`).

## MongoDB Setup

**Local:**
```bash
# macOS (Homebrew)
brew services start mongodb-community
# MONGO_URI=mongodb://127.0.0.1:27017/cafe-extreme
```

**Atlas (cloud, free tier):**
1. Create a cluster at mongodb.com/atlas
2. Add a database user and allow your IP (or `0.0.0.0/0` for development)
3. Copy the connection string into `MONGO_URI` in `server/.env`

## Running the App

```bash
# Terminal 1 — backend
cd server
npm run dev        # starts on http://localhost:5000

# Terminal 2 — frontend
cd client
npm run dev         # starts on http://localhost:5173
```

Visit `http://localhost:5173`. API calls made from the client during
development are automatically proxied to the backend.

## Seeding the Menu

Populates MongoDB with the real Café Extreme menu (19 products across
Coffee, Iced Coffee, and Iced Tea):

```bash
cd server
npm run seed
```

This clears existing categories/products first, so it's safe to re-run.

## Creating an Admin Account

Set `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` in `server/.env`, then:

```bash
cd server
npm run seed:admin
```

Sign in at `/signin` with those credentials — the account will have
`role: "admin"` and can access `/admin`.

## Payment Setup

Payments are handled by `server/services/paymentService.js`, which
automatically detects whether Stripe is configured:

- **No `STRIPE_SECRET_KEY` set (default):** runs in demo mode. "Pay by
  Card" at checkout succeeds instantly with no real charge — fully
  testable out of the box.
- **`STRIPE_SECRET_KEY` set:** creates a real Stripe PaymentIntent and
  returns a `clientSecret`. To finish this integration, add
  [`@stripe/react-stripe-js`](https://stripe.com/docs/stripe-js/react) to
  the client and build a card form using that `clientSecret` — the
  backend is already structured to support it without further changes.

Never put `STRIPE_SECRET_KEY` in the client — it belongs only in
`server/.env`.

## Adding / Editing Products

No code changes required. Sign in as an admin, go to **Admin → Products**,
and use **Add Product** / the edit (pencil) icon on any row. Categories
work the same way under **Admin → Categories**.

Product add-ons (like Milk Choice or Extra Shot) are defined on the
`Product.addOns` field in the database — see
`server/seed/seedProducts.js` for the exact shape if you want to add new
add-on groups via a script, or extend `AdminProducts.jsx`'s form to edit
them directly in the UI.

## Replacing the Hero Video

Place your MP4 at:

```
client/public/videos/cafe-extreme-hero.mp4
```

That's the exact path `HeroSection.jsx` references — no code changes
needed. The page never blocks on the video loading; the dark charcoal
background shows immediately as a fallback while it buffers.

## Deployment Notes

- Set `NODE_ENV=production` on the server in production.
- Set a real `VITE_API_URL` for the client build if the frontend and
  backend are deployed separately.
- Use a real MongoDB Atlas cluster (not `127.0.0.1`) in production.
- Rotate `JWT_SECRET` and use a strong value — this is what all sessions
  are signed with.
- If enabling Stripe, remember to also implement a webhook endpoint for
  `payment_intent.succeeded` in production rather than relying solely on
  the client-triggered confirm call in `paymentService.js`.
