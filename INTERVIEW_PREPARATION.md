# Café Extreme — Complete Software Engineering Internship Interview Guide & Study Master

> **Target Role:** Software Engineering Intern / Junior Full-Stack Developer  
> **Repository:** `dinithiuththara/cafe-extreme-MERN`  
> **Stack:** MERN (MongoDB, Express.js, React 18, Node.js) + Vite + Tailwind CSS + Framer Motion  
> **Prepared for:** Dinithi Uththara  
> **Purpose:** Honest, confident, deep technical preparation grounded in the actual codebase.

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Technology Stack Deep Dive](#2-technology-stack-deep-dive)
3. [Project Structure & Important Files](#3-project-structure--important-files)
4. [Step-by-Step Application Traces (User Flows)](#4-step-by-step-application-traces-user-flows)
5. [Code Walkthrough (Line-by-Line Beginner Explanations)](#5-code-walkthrough-line-by-line-beginner-explanations)
6. [Database Architecture & MongoDB Operations](#6-database-architecture--mongodb-operations)
7. [API Specification & HTTP Communication](#7-api-specification--http-communication)
8. [Authentication, Authorization & Security Analysis](#8-authentication-authorization--security-analysis)
9. [Core Software Engineering Principles in This Project](#9-core-software-engineering-principles-in-this-project)
10. [Your 1-Minute Elevator Pitch](#10-your-1-minute-elevator-pitch)
11. [Your 3–5 Minute Technical Deep-Dive](#11-your-35-minute-technical-deep-dive)
12. [Interview Questions Categorized by Topic](#12-interview-questions-categorized-by-topic)
13. [Model Answers with Project Connections](#13-model-answers-with-project-connections)
14. [Code Verification Questions (Did You Really Build It?)](#14-code-verification-questions-did-you-really-build-it)
15. [Things You Should NOT Claim (Red Flags & Inconsistencies)](#15-things-you-should-not-claim-red-flags--inconsistencies)
16. [Project Weaknesses & 8 Realistic Improvements](#16-project-weaknesses--8-realistic-improvements)
17. [Git & Development Workflow](#17-git--development-workflow)
18. [Last-Minute 10-Minute Interview Cheat Sheet](#18-last-minute-10-minute-interview-cheat-sheet)

---

# 1. Project Overview

### What is Café Extreme?
Café Extreme is a full-stack, responsive web application for a specialty coffee shop based in Sri Lanka. It serves two distinct audiences:
1. **Customers:** Can discover menu offerings (Hot Coffee, Iced Coffee, Iced Tea), customize drinks with real-time add-on pricing (milk choices, extra espresso shots), manage an interactive cart, securely sign up/sign in, place delivery orders, and track order histories and favorites on a personal dashboard.
2. **Administrators (Store Managers):** Can monitor live sales analytics, update catalog products, manage menu categories, review real-time orders, toggle order preparation/delivery statuses, inspect payment audit logs, and toggle customer account activation status through a protected back-office portal.

### What Problem Does It Solve?
Traditional coffee shops take orders via phone or third-party delivery aggregators (which take 20–30% commission and don’t handle drink customizations like milk substitutions or extra espresso shots well). Café Extreme provides an independent, brand-tailored online ordering portal that recalculates drink prices server-side, manages order lifecycles, and maintains an audit trail of transactions.

### Who Would Use It?
* **Coffee Lovers / Daily Commuters:** Customers browsing menu options and ordering custom coffee for home or office delivery.
* **Café Baristas & Kitchen Staff:** Viewing incoming orders, reading specific customized add-on requests (e.g., "Coconut milk + Add extra shot"), and transitioning orders from `Pending` -> `Confirmed` -> `Preparing` -> `Ready`.
* **Café Owner / Manager:** Monitoring daily revenue, tracking top-selling beverages, managing inventory availability, and updating menu prices.

### Technology Stack at a Glance
* **Frontend:** React 18 (SPA), Vite (Bundler), Tailwind CSS (Styling), React Router DOM v6 (Routing), Framer Motion (Animations), Lucide React (Icons), Axios (HTTP Client).
* **Backend:** Node.js (Runtime environment), Express.js (REST API web framework, ES Modules), Mongoose (Object Data Modeling / ODM), bcryptjs (Password hashing), jsonwebtoken (JWT Auth), Stripe SDK (Payment gateway integration with built-in Demo mode).
* **Database:** MongoDB Atlas (Cloud NoSQL Database).

### Architecture
The project follows a **Decoupled Client-Server (Three-Tier) Architecture**:
```
┌────────────────────────────────────────────────────────┐
│             PRESENTATION TIER (Frontend)               │
│  React 18 + Vite (SPA running on port 5173 in dev)     │
│  Axios HTTP Client + Auth & Cart React Context         │
└──────────────────────────┬─────────────────────────────┘
                           │ JSON via RESTful HTTP APIs
                           │ (Vite reverse proxy: /api -> :5000)
┌──────────────────────────▼─────────────────────────────┐
│             APPLICATION TIER (Backend API)             │
│  Node.js + Express.js (REST server on port 5000)       │
│  Controllers -> Middlewares (Auth, Error) -> Services  │
└──────────────────────────┬─────────────────────────────┘
                           │ Mongoose Driver (Binary TCP)
┌──────────────────────────▼─────────────────────────────┐
│                DATA TIER (Database)                    │
│  MongoDB Atlas Cluster (NoSQL Document Store)          │
│  Collections: users, products, categories, orders,     │
│               payments                                 │
└────────────────────────────────────────────────────────┘
```

### How Frontend, Backend, and Database Communicate
1. The **Frontend** initiates an asynchronous HTTP request using Axios (`client/src/services/api.js`).
2. An **Axios Request Interceptor** inspects `localStorage` for `cafe_extreme_token`. If found, it injects an HTTP Header: `Authorization: Bearer <jwt-token>`.
3. During local development, the **Vite Dev Server Proxy** (`client/vite.config.js`) forwards all `/api/*` traffic to `http://localhost:5000` to avoid Cross-Origin Resource Sharing (CORS) blocks.
4. The **Express Backend Server** receives the HTTP request, logs it via `morgan`, parses JSON payloads via `express.json()`, and matches the URL path in `server/server.js`.
5. Route middleware (`protect`, `adminOnly`) validates the JWT token and verifies user permissions.
6. The matching **Controller** executes business logic and issues asynchronous queries to MongoDB via **Mongoose Models**.
7. **MongoDB** reads or writes documents on disk and returns BSON/JSON results to Mongoose.
8. The Controller formats the response and returns HTTP status codes (e.g., `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`) along with a JSON payload to the React frontend.
9. React receives the JSON data, updates component state (`useState` / Context), and React DOM triggers a re-render.

### How a Typical Request Travels: End-to-End Example (Fetching Products)
1. **User Action:** Customer clicks "Menu" on the navbar (`/menu`).
2. **React Page Mounts:** `Menu.jsx` mounts and triggers `useProducts(queryParams)`.
3. **HTTP Dispatch:** `productService.getAll({ category: 'hot-coffee' })` calls Axios `api.get('/products?category=hot-coffee')`.
4. **Network:** Vite proxies the GET request to `http://localhost:5000/api/products?category=hot-coffee`.
5. **Express Routing:** In `server/server.js`, `app.use('/api/products', productRoutes)` catches the request and routes it to `productRoutes.js`, which invokes `getProducts` in `productController.js`.
6. **Controller Logic:** `productController.js` resolves the slug `hot-coffee` to a MongoDB Category `_id`, builds the query filter `{ category: categoryId }`, and executes:
   ```javascript
   Product.find(filter).populate("category", "name slug").sort({ createdAt: -1 })
   ```
7. **Database Query:** MongoDB searches the `products` collection, joins category metadata, and returns matching documents.
8. **HTTP Response:** Express returns status `200` with the JSON array of products.
9. **State Update:** In `useProducts.js`, `setProducts(data)` updates React state.
10. **Re-render:** Framer Motion animates the product cards into the viewport.

---

# 2. Technology Stack Deep Dive

### 1. MongoDB
* **What it is:** A document-oriented, NoSQL database that stores data as flexible, JSON-like BSON (Binary JSON) documents.
* **Why it is used:** Coffee shop menu items have dynamic and nested attributes (such as varying add-on options per drink: milk choices vs extra shots vs syrups). In a relational SQL database, this would require 4 or 5 normalized tables with foreign keys (`products`, `product_addons`, `addon_groups`, `addon_options`). MongoDB allows embedding add-ons directly inside the product document.
* **Where it is used:** Hosted on MongoDB Atlas (`server/config/db.js`), storing users, products, categories, orders, and payments.
* **Real-world Analogy:** Think of a traditional SQL database as an Excel workbook where every sheet must have fixed, rigid columns. MongoDB is like a digital filing cabinet where every folder holds index cards formatted as JSON; cards can contain nested bullet points without breaking other cards.
* **Example in Project:**
  ```javascript
  // server/models/Product.js
  addOns: [{ name: "Milk Choice", type: "required-single", options: [{ label: "Coconut Milk", priceDelta: 150 }] }]
  ```

### 2. Express.js
* **What it is:** A minimal, unopinionated web server framework for Node.js.
* **Why it is used:** Node.js built-in `http` module is verbose and low-level. Express provides high-level routing, request parsing, middleware composition, and error management.
* **Where it is used:** `server/server.js`, `server/routes/*.js`, `server/controllers/*.js`.
* **Real-world Analogy:** Express is the head waiter at a restaurant. When a customer speaks (HTTP request), the waiter checks their reservation (auth middleware), directs the order to the correct station in the kitchen (controller), and brings the prepared dish back (JSON response).
* **Example in Project:**
  ```javascript
  // server/routes/productRoutes.js
  router.post("/", protect, adminOnly, createProduct);
  ```

### 3. React 18
* **What it is:** A declarative, component-based frontend JavaScript library for building interactive user interfaces using a Virtual DOM.
* **Why it is used:** Enables a Single Page Application (SPA) where pages transition instantly without white-screen browser reloads. It handles dynamic UI changes (such as recalculating cart totals when add-ons change) seamlessly.
* **Where it is used:** Entire `client/src` directory.
* **Key Concepts in this Project:**
  * **Components:** Reusable UI building blocks (`ProductCard.jsx`, `Navbar.jsx`, `OrderStatusBadge.jsx`).
  * **State (`useState`):** Internal component memory that triggers re-rendering when modified (e.g., active tabs, form inputs).
  * **Side Effects (`useEffect`):** Executes lifecycle actions like fetching products on mount or registering scroll event listeners.
  * **Props:** Read-only data passed from parent components to child components (`<OrderStatusBadge status={order.status} />`).
  * **Context (`createContext`, `useContext`):** Global state shared across the entire component tree without "prop drilling" (`AuthContext.jsx`, `CartContext.jsx`).
* **Real-world Analogy:** React is like building with LEGO bricks. Instead of building a single wooden house that must be remade completely whenever you want to change a window, you build small modular blocks (components). If one block changes, only that block updates.

### 4. Node.js
* **What it is:** An open-source, cross-platform JavaScript runtime engine built on Google Chrome's V8 engine that executes JavaScript outside the browser.
* **Why it is used:** Allows developers to use JavaScript across both frontend and backend (full-stack JavaScript), sharing logic and data formatting patterns. Its event-driven, non-blocking I/O model handles concurrent requests efficiently.
* **Where it is used:** Powers the backend runtime environment (`server/server.js`).
* **Real-world Analogy:** JavaScript is the musical score; Google V8 is the musician. Inside a browser, the musician only plays inside a theater. Node.js lets that musician play outside the theater on any street or stage in the world (the server's operating system).

### 5. Mongoose
* **What it is:** An Object Data Modeling (ODM) library for MongoDB and Node.js.
* **Why it is used:** MongoDB by itself does not enforce strict data types or validation. Mongoose adds schemas, type checking, default values, pre/post middleware hooks, and model helper methods.
* **Where it is used:** `server/models/*.js`.
* **Example in Project:**
  ```javascript
  // server/models/User.js - pre-save hook for automatic password hashing
  userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  ```

### 6. Tailwind CSS
* **What it is:** A utility-first CSS framework providing low-level CSS utility classes directly in JSX markup.
* **Why it is used:** Eliminates writing separate `.css` files with naming conflicts. Enables rapid, responsive styling with theme consistency defined in `tailwind.config.js` (e.g., custom colors: `charcoal: #14100D`, `copper: #C9A15A`, `cream: #F5EDE0`).
* **Where it is used:** All JSX files and `client/src/index.css`.

### 7. Vite
* **What it is:** A next-generation frontend build tool and local dev server powered by native ES modules.
* **Why it is used:** Replaces older, slower bundlers like Create React App (Webpack). It boots up in milliseconds and provides instant Hot Module Replacement (HMR) while coding.
* **Where it is used:** `client/vite.config.js`.

### 8. Framer Motion
* **What it is:** A production-ready animation and gesture library for React.
* **Why it is used:** Implements smooth UI transitions, page entrance animations, hover states, and parallax scrolling (`useScroll`, `useTransform`).
* **Where it is used:** `HeroSection.jsx`, `Menu.jsx`, `Cart.jsx`, `CategoryMenuPage.jsx`.

### 9. Axios
* **What it is:** A Promise-based HTTP client for the browser and Node.js.
* **Why it is used over native `fetch`:** Automatically transforms JSON payloads (eliminating extra `res.json()` calls), provides centralized Request and Response Interceptors, and cleanly handles HTTP error statuses.
* **Where it is used:** `client/src/services/api.js`.

### 10. JSON Web Token (JWT) & bcryptjs
* **What they are:** 
  * `jsonwebtoken`: An open industry standard (RFC 7519) for securely transmitting information between parties as a digitally signed JSON object.
  * `bcryptjs`: An adaptive cryptographic hash function based on the Blowfish cipher for hashing passwords.
* **Why they are used:** Passwords should never be stored in plain text. JWT enables stateless authentication: the server signs a token with a secret key; the client stores it and presents it on subsequent requests without requiring server-side session memory.
* **Where they are used:** `server/controllers/authController.js`, `server/middleware/auth.js`, `server/models/User.js`.

---

# 3. Project Structure & Important Files

### Directory Tree Overview
```
cafe-extreme-menu-update/
├── README.md                     # High-level developer documentation & setup guide
├── INTERVIEW_PREPARATION.md      # Comprehensive interview study guide (this document)
├── client/                       # Frontend React Single Page Application (Vite)
│   ├── index.html                # Single HTML shell with Google Fonts & root div
│   ├── package.json              # Frontend dependencies and dev scripts
│   ├── tailwind.config.js        # Custom brand color tokens (charcoal, espresso, copper)
│   ├── vite.config.js            # Dev proxy config (/api -> :5000) & rollup options
│   ├── public/                   # Static assets served as-is
│   │   ├── images/               # Product JPGs (Espresso, Cappuccino, etc.)
│   │   └── videos/               # Hero & category background MP4 videos
│   └── src/
│       ├── main.jsx              # React root mount; wraps App in BrowserRouter, Auth, Cart
│       ├── App.jsx               # Client route definitions & protected route guards
│       ├── index.css             # Tailwind directives, base focus styles, extraction-ring keyframes
│       ├── components/           # Reusable UI widgets
│       │   ├── Navbar.jsx        # Sticky responsive navbar with search modal & cart pill
│       │   ├── Footer.jsx        # Brand links, opening hours, social links
│       │   ├── ProductCard.jsx   # Product display with animated extraction ring & quick-add
│       │   ├── OrderStatusBadge.jsx # Color-coded status badge for orders
│       │   ├── RouteGuards.jsx   # ProtectedRoute & AdminRoute route wrappers
│       │   ├── admin/            # Admin specific UI components
│       │   │   └── BarChart.jsx  # Dependency-free HTML/CSS bar chart
│       │   ├── home/             # Homepage modular sections
│       │   │   ├── HeroSection.jsx       # Video hero with parallax Framer Motion text
│       │   │   ├── ProductShowcase.jsx   # Grid showcase for featured/popular items
│       │   │   ├── CategoryExplorer.jsx  # Category cards preview
│       │   │   ├── AboutSection.jsx      # Brand story with video/image preview
│       │   │   ├── ExperienceSection.jsx # Coffee quality value propositions
│       │   │   ├── CTASection.jsx        # Call-to-action banner
│       │   │   └── LocationSection.jsx   # Physical café address & opening hours
│       │   └── menu/
│       │       └── CategoryVideoIntro.jsx # Video banner for Hot/Iced category pages
│       ├── context/              # Global React state management
│       │   ├── AuthContext.jsx   # User login, logout, register, token persistence
│       │   └── CartContext.jsx   # Cart item collection, add-on lineKey builder, price sums
│       ├── hooks/                # Custom React hooks
│       │   ├── useAuth.js        # Shortcut hook for AuthContext
│       │   ├── useCart.js        # Shortcut hook for CartContext
│       │   └── useProducts.js    # Data-fetching hook with cleanup & parameter change refetch
│       ├── layouts/              # Visual shell layouts
│       │   ├── MainLayout.jsx    # Customer layout: Navbar + Page Outlet + Footer
│       │   └── AdminLayout.jsx   # Admin layout: Dark sidebar + Light content area
│       ├── pages/                # Route level views
│       │   ├── Home.jsx          # Customer landing page
│       │   ├── Menu.jsx          # Interactive menu with search and category filtering
│       │   ├── HotCoffee.jsx     # Dedicated Hot Coffee page (wraps CategoryMenuPage)
│       │   ├── IcedCoffee.jsx    # Dedicated Iced Coffee page (wraps CategoryMenuPage)
│       │   ├── CategoryMenuPage.jsx # Shared template for Hot & Iced coffee video menus
│       │   ├── ProductDetails.jsx # Customization page (add-ons, quantity, favorites)
│       │   ├── Cart.jsx          # Full cart review with item removal & quantity stepper
│       │   ├── Checkout.jsx      # Order placement with delivery details form
│       │   ├── OrderConfirmation.jsx # Post-checkout receipt with order summary
│       │   ├── Dashboard.jsx     # Customer account hub (Overview, Orders, Profile, Favorites)
│       │   ├── SignIn.jsx        # Login page with redirect preservation
│       │   ├── SignUp.jsx        # Account registration with password confirmation
│       │   ├── About.jsx         # Café backstory and heritage
│       │   ├── Contact.jsx       # Inquiry form & contact info
│       │   ├── NotFound.jsx      # 404 fallback page
│       │   └── Admin/            # Admin portal views
│       │       ├── AdminDashboard.jsx  # Overview metrics (revenue, orders, users, charts)
│       │       ├── AdminOrders.jsx     # Order listing with status dropdown selector
│       │       ├── AdminProducts.jsx   # Product CRUD table and modal
│       │       ├── AdminCategories.jsx # Category CRUD table with automatic slug creation
│       │       ├── AdminUsers.jsx      # User list with activation/deactivation toggle
│       │       ├── AdminPayments.jsx   # Audit logs of payment records
│       │       ├── AdminAnalytics.jsx  # Sales trends, top selling drinks by unit/revenue
│       │       └── AdminSettings.jsx   # Admin password change form
│       ├── services/             # API communication layer (Axios wrappers)
│       │   ├── api.js            # Axios instance with auth interceptor & 401 handling
│       │   ├── authService.js    # /auth endpoints (register, login, me)
│       │   ├── productService.js # /products and /categories endpoints
│       │   ├── orderService.js   # /orders endpoints (create, getMyOrders, updateStatus)
│       │   ├── paymentService.js # /payments endpoints (charge, confirm)
│       │   ├── userService.js    # /users endpoints (profile, password, favorites)
│       │   └── adminService.js   # /admin endpoints (stats, payments, user statuses)
│       └── utils/
│           └── format.js         # formatPrice (LKR currency) and formatDate utilities
└── server/                       # Node.js + Express REST API Backend
    ├── .env                      # Environment secrets (PORT, MONGO_URI, JWT_SECRET)
    ├── package.json              # Server dependencies (ES Modules: "type": "module")
    ├── server.js                 # Express app initialization, middleware pipeline, listener
    ├── config/
    │   └── db.js                 # Mongoose connection to MongoDB Atlas
    ├── models/                   # Mongoose database schemas
    │   ├── User.js               # User accounts, hashed passwords, roles, favorites
    │   ├── Product.js            # Coffee items, prices, add-on schemas, text indexes
    │   ├── Category.js           # Categories with URL slugs and display ordering
    │   ├── Order.js              # Order items snapshot, delivery address, status enum
    │   └── Payment.js            # Payment audit logs (gateway, reference ID, amount)
    ├── controllers/              # Route handling business logic
    │   ├── authController.js     # User registration, login verification, token generation
    │   ├── productController.js  # Product querying, text search, admin CRUD
    │   ├── categoryController.js # Category listing, admin CRUD
    │   ├── orderController.js    # Server-side item validation, order creation, statuses
    │   ├── paymentController.js  # Payment charging, gateway dispatch, status sync
    │   ├── userController.js     # User profiles, passwords, favorites, admin aggregate
    │   └── adminController.js    # Dashboard stats aggregation (Promise.all, $facet/$group)
    ├── routes/                   # Express router definitions
    │   ├── authRoutes.js         # /api/auth
    │   ├── productRoutes.js      # /api/products
    │   ├── categoryRoutes.js     # /api/categories
    │   ├── orderRoutes.js        # /api/orders
    │   ├── paymentRoutes.js      # /api/payments
    │   ├── userRoutes.js         # /api/users
    │   └── adminRoutes.js        # /api/admin
    ├── middleware/               # Express request pipeline middlewares
    │   ├── auth.js               # JWT verification (protect) & role authorization (adminOnly)
    │   └── errorHandler.js       # 404 notFound & centralized error transformer
    ├── services/                 # External service integrations
    │   └── paymentService.js     # Stripe SDK integration with auto fallback to Demo Mode
    ├── utils/
    │   └── generateToken.js      # Signs JWT with userId and expiration
    └── seed/                     # Database population scripts
        ├── seedAdmin.js          # CLI script to create/promote admin account from .env
        └── seedProducts.js       # Populates initial 19 café products and add-ons
```

### 20 Most Important Files You Must Know Before Tomorrow

| # | File Name | Purpose & Role | Key Functions / Symbols | Communicates With |
|---|-----------|----------------|--------------------------|-------------------|
| 1 | `server/server.js` | Express app entry point. Sets up middleware pipeline, mounts routes, starts HTTP server. | `connectDB()`, `express.json()`, `app.listen()` | `config/db.js`, all route files, `middleware/errorHandler.js` |
| 2 | `server/config/db.js` | Connects to MongoDB Atlas using Mongoose. | `connectDB()` | `mongoose`, `server/.env` |
| 3 | `server/models/User.js` | Mongoose User model with pre-save password hash and comparison method. | `userSchema.pre("save")`, `comparePassword()` | `bcryptjs`, `authController.js` |
| 4 | `server/models/Product.js` | Product model with embedded add-on schemas and full-text index. | `productSchema.index()`, `addOnOptionSchema` | `productController.js`, `orderController.js` |
| 5 | `server/models/Order.js` | Order model storing immutable snapshot of ordered items, add-ons, and statuses. | `orderSchema`, `orderItemSchema` | `orderController.js`, `paymentController.js` |
| 6 | `server/models/Payment.js` | Separates payment transactions from orders for multi-gateway flexibility. | `paymentSchema` | `paymentController.js`, `paymentService.js` |
| 7 | `server/middleware/auth.js` | Verifies JWT from Authorization header and blocks non-admins. | `protect()`, `adminOnly()` | `jsonwebtoken`, `models/User.js` |
| 8 | `server/middleware/errorHandler.js` | Global error handling middleware; normalizes Mongoose & Cast errors. | `notFound()`, `errorHandler()` | Catch blocks in all controllers |
| 9 | `server/controllers/authController.js` | Handles user registration, credentials check, and token generation. | `registerUser()`, `loginUser()`, `getCurrentUser()` | `models/User.js`, `generateToken.js` |
| 10 | `server/controllers/orderController.js` | Validates cart items against DB prices and creates orders. | `buildValidatedItems()`, `createOrder()`, `updateOrderStatus()` | `models/Order.js`, `models/Product.js` |
| 11 | `server/controllers/adminController.js` | Runs MongoDB aggregation pipelines for metrics and revenue over time. | `getDashboardStats()`, `getAllPayments()` | `models/Order.js`, `models/Product.js`, `models/User.js` |
| 12 | `server/services/paymentService.js` | Handles Stripe PaymentIntents with automatic fallback to test demo mode. | `isStripeConfigured()`, `chargeOrder()`, `confirmPayment()` | `stripe`, `paymentController.js` |
| 13 | `client/src/App.jsx` | React root route configuration; configures customer and admin routes. | `<Routes>`, `<Route>`, `<ProtectedRoute>`, `<AdminRoute>` | All pages, `RouteGuards.jsx`, `Layouts` |
| 14 | `client/src/services/api.js` | Base Axios client with request/response interceptors for JWT. | `api.interceptors.request`, `api.interceptors.response` | `localStorage`, all frontend services |
| 15 | `client/src/context/AuthContext.jsx` | React context providing user authentication state across the app. | `login()`, `register()`, `logout()`, `updateUser()` | `authService.js`, `localStorage` |
| 16 | `client/src/context/CartContext.jsx` | Cart state management with composite `lineKey` for add-on selections. | `addToCart()`, `buildLineKey()`, `updateQuantity()`, `clearCart()` | `localStorage`, `useCart.js` |
| 17 | `client/src/hooks/useProducts.js` | Custom hook for fetching products with query filters and cleanup cancel flag. | `useProducts()` | `productService.js` |
| 18 | `client/src/pages/ProductDetails.jsx` | Product customization view (milk choice, extra shot, real-time price total). | `handleSelect()`, `handleAddToCart()`, `toggleFavorite()` | `useCart.js`, `useAuth.js`, `productService.js` |
| 19 | `client/src/pages/Checkout.jsx` | Order placement form collecting delivery details and sending cart to API. | `handleSubmit()`, `handleChange()` | `useCart.js`, `orderService.js` |
| 20 | `client/src/components/RouteGuards.jsx` | Higher-order route guards for authentication and admin role verification. | `ProtectedRoute()`, `AdminRoute()` | `useAuth.js`, React Router `<Navigate>` |

---

# 4. Step-by-Step Application Traces (User Flows)

### Flow 1: User Registration
```
User (Browser) 
  ──(1) Fills Name, Email, Password, ConfirmPassword──> [SignUp.jsx]
  ──(2) Client-side validation (length >= 6, match)──> [SignUp.jsx]
  ──(3) Calls register()──> [AuthContext.jsx]
  ──(4) Calls authService.register()──> [api.js]
  ──(5) POST /api/auth/register──> [authRoutes.js]
  ──(6) Calls registerUser()──> [authController.js]
  ──(7) Checks User.findOne({ email })──> [MongoDB Atlas]
  ──(8) Calls User.create({ name, email, password })──> [models/User.js]
  ──(9) pre('save') hashes password using bcrypt.genSalt(10)──> [bcryptjs]
  ──(10) Returns created user & signed JWT──> [generateToken.js]
  ──(11) Frontend receives { user, token }──> [AuthContext.jsx]
  ──(12) Saves token to localStorage('cafe_extreme_token')──> [Browser Storage]
  ──(13) Sets user state & navigates to '/'──> [React Router]
```

### Flow 2: User Login & Session Hydration
1. **User Action:** Customer enters email and password on `/signin` and clicks "Sign In".
2. **Form Capture:** `SignIn.jsx` captures values in local state `form`.
3. **Dispatch:** `handleSubmit` calls `login(form.email, form.password)` from `useAuth()`.
4. **Service Call:** `authService.login({ email, password })` sends HTTP `POST /api/auth/login`.
5. **Route Matching:** Express matches `server/routes/authRoutes.js` line 8 and calls `loginUser` in `authController.js`.
6. **Query User with Password:** Because `password` has `select: false` on `User.js`, the controller explicitly runs:
   ```javascript
   User.findOne({ email: email.toLowerCase() }).select("+password");
   ```
7. **Account Check:** Verifies user exists and `user.isActive === true` (account not deactivated by admin).
8. **Password Comparison:** Calls `user.comparePassword(password)` which calls `bcrypt.compare()`.
9. **Token Generation:** If matched, calls `generateToken(user._id)` (`jsonwebtoken.sign`).
10. **Client Storage:** `AuthContext.jsx` saves `data.token` into `localStorage.setItem('cafe_extreme_token', token)` and sets `user` state.
11. **Navigation:** Navigates the user to their intended destination (or `/` by default) using React Router's `location.state?.from`.
12. **Session Hydration on Reload:** When the user refreshes any page, `AuthContext.jsx`'s `useEffect` checks if a token exists in `localStorage`. If present, it calls `authService.getCurrentUser()` (`GET /api/auth/me`). The Axios request interceptor attaches the token as `Bearer <token>`, `protect` middleware verifies it, and the user state is restored without requiring them to log in again.

### Flow 3: Menu Browsing, Filtering, and Live Search
1. **User Action:** Customer opens `/menu` and types "vanilla" into the search bar, or clicks the "Hot Coffee" filter pill.
2. **URL State Synchronization:** In `Menu.jsx`, clicking a category pill updates the URL search params: `setSearchParams({ category: 'hot-coffee' })`.
3. **Custom Hook Execution:** `useProducts(queryParams)` detects parameter change via `[JSON.stringify(params)]`.
4. **API Request:** `productService.getAll({ category: 'hot-coffee', search: 'vanilla' })` triggers `GET /api/products?category=hot-coffee&search=vanilla`.
5. **Backend Processing:** In `productController.js` (`getProducts`):
   * Inspects `req.query.category`: Resolves slug `'hot-coffee'` to category document ID using `Category.findOne({ slug: category })`.
   * Inspects `req.query.search`: Appends text query `{ $text: { $search: 'vanilla' } }`.
   * Executes Mongoose query:
     ```javascript
     Product.find(filter).populate("category", "name slug").sort({ createdAt: -1 });
     ```
6. **Response & Render:** Express responds with an array of products. In `Menu.jsx`, `<AnimatePresence>` smoothly fades in the filtered results using `<ProductCard>`.

### Flow 4: Product Customization & Adding to Cart
1. **User Action:** Customer clicks on "Caffè Latte" (`/product/:id`).
2. **Loading Product:** `ProductDetails.jsx` calls `productService.getById(id)` to retrieve product data and add-on configurations.
3. **Customization:** 
   * "Milk Choice" is marked `required-single`. The component defaults to the first option ("Cow Milk", +Rs 0).
   * User clicks "Coconut Milk" (+Rs 150). `handleSelect` updates the `selections` state.
   * User increments quantity to 2.
   * `ProductDetails.jsx` recalculates `unitPrice = product.price + 150`.
4. **Adding to Cart:** User clicks "Add to Cart":
   * Calls `addToCart(product, selectedAddOns, quantity)` from `useCart()`.
5. **Unique Line Key Generation:** In `CartContext.jsx`, `buildLineKey` computes a composite string:
   ```javascript
   // Format: <productId>__<groupName>:<optionLabel>
   "66f1...__Milk Choice:Coconut Milk"
   ```
6. **Cart State Update:**
   * If an item with the identical `lineKey` exists, its quantity increments.
   * Otherwise, a new cart item object is appended to the array.
   * `useEffect` syncs the entire cart array to `localStorage.setItem('cafe_extreme_cart', JSON.stringify(items))`.

### Flow 5: Checkout & Order Creation
1. **User Action:** Authenticated customer clicks "Proceed to Checkout" from `/cart` and reaches `/checkout`.
2. **Form Fill:** Customer confirms delivery details (Name, Email, Phone, Street Address).
3. **Submission:** User clicks "Place Order".
4. **Request Dispatch:** `orderService.create(payload)` sends `POST /api/orders` with:
   ```json
   {
     "items": [{ "productId": "...", "quantity": 2, "selectedAddOns": [...] }],
     "deliveryAddress": { "fullName": "...", "phone": "...", "email": "...", "address": "..." }
   }
   ```
5. **Auth Middleware:** `protect` middleware reads the Bearer token, validates it against `JWT_SECRET`, queries `User.findById(decoded.id)`, and attaches the user document to `req.user`.
6. **Server-Side Validation (Crucial Security Step):** In `orderController.js`, `buildValidatedItems()` ignores any client-supplied prices. It queries each product from the database, checks `product.isAvailable`, verifies that every selected add-on exists on that product model, uses the database's `priceDelta`, and calculates `lineTotal = unitPrice * quantity`.
7. **Order Save:** Express creates the document in MongoDB with `paymentStatus: "pending"` and `status: "Pending"`.
8. **Confirmation:** The server responds with `201 Created` and the order document.
9. **Cart Clearing & Redirect:** `Checkout.jsx` calls `clearCart()` (wiping `localStorage`), and redirects to `/order-confirmation/:orderId`.

### Flow 6: Admin Order Management
1. **Access Control:** Store manager navigates to `/admin/orders`. `AdminRoute` verifies `user.role === 'admin'`.
2. **Data Fetching:** Calls `orderService.getAllAdmin()` (`GET /api/orders/admin/all`).
3. **Backend Middleware:** Passes `protect` and `adminOnly`.
4. **Database Population:** `Order.find().populate("user", "name email").sort({ createdAt: -1 })`.
5. **Status Update:** Admin changes an order's status dropdown from "Pending" to "Preparing".
6. **Update API:** `orderService.updateStatus(orderId, 'Preparing')` sends `PUT /api/orders/:id/status`.
7. **Validation:** `orderController.js` validates that status is one of the allowed enum values:
   `["Pending", "Confirmed", "Preparing", "Ready", "Out for Delivery", "Delivered", "Cancelled"]`.
8. **Persistence:** `Order.findByIdAndUpdate(req.params.id, { status }, { new: true })`.
9. **UI Feedback:** The orders table updates its row in-place without reloading the page.

---

# 5. Code Walkthrough (Line-by-Line Beginner Explanations)

### Code Block 1: JWT Protection Middleware (`server/middleware/auth.js`)
```javascript
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Not authorized, user not found or inactive" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid or expired token" });
  }
};
```
* **1. What does this code do?** It acts as a security guard for private API routes. It reads the incoming HTTP `Authorization` header, extracts the token, verifies that the token was signed with the server's secret key, finds the user in the database, ensures their account is active, and attaches the user document to `req.user` before letting the request proceed.
* **2. Why is it needed?** HTTP is stateless. The server has no memory of who visited previously. Without this middleware, any stranger on the internet could create orders in someone else's name or view private order histories.
* **3. What happens if it is removed?** All private routes would either fail (because `req.user` is undefined) or anyone could access protected user and admin data without logging in.
* **4. What data goes into it?** An incoming HTTP Request with an `Authorization: Bearer <token>` header.
* **5. What data comes out?** If valid, it attaches `req.user` and calls `next()`. If invalid, it immediately halts the request and returns an HTTP `401 Unauthorized` JSON response.
* **6. Which other files use it?** `authRoutes.js`, `orderRoutes.js`, `userRoutes.js`, `productRoutes.js`, `adminRoutes.js`.

---

### Code Block 2: Defensive Server-Side Price Recalculation (`server/controllers/orderController.js`)
```javascript
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
```
* **1. What does this code do?** It takes the items sent by the client cart, fetches the real product from MongoDB, checks if it is available, verifies that every selected add-on legitimately belongs to that product, recalculates the exact price using database numbers, and calculates `lineTotal`.
* **2. Why is it needed?** **Never trust the client!** A malicious user could open DevTools or use Postman to send an order saying an Espresso costs Rs 1 instead of Rs 550, or that extra shots cost Rs 0. This function guarantees that order prices are calculated strictly on the backend.
* **3. What happens if it is removed?** Attackers could buy anything on the menu for any price they invent.
* **4. What data goes into it?** An array of unverified cart items from `req.body.items`.
* **5. What data comes out?** An array of sanitized, verified, calculated order items ready for the `Order` model.
* **6. Which other file uses it?** Called directly by `createOrder` in `orderController.js`.

---

### Code Block 3: Axios Request and Response Interceptors (`client/src/services/api.js`)
```javascript
const api = axios.create({ baseURL });

// Attach the JWT (if present) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cafe_extreme_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralize "session expired" handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("cafe_extreme_token");
    }
    return Promise.reject(error);
  }
);
```
* **1. What does this code do?** 
  * The Request Interceptor automatically intercepts every outgoing HTTP request from the frontend and adds the `Authorization` header with the stored JWT token.
  * The Response Interceptor listens to all responses; if the backend ever returns `401 Unauthorized` (e.g., token expired after 7 days), it cleans up `localStorage` so the user gracefully falls back to logged-out state.
* **2. Why is it needed?** Without this, every single service file (`orderService.js`, `userService.js`, `productService.js`, `adminService.js`) would have to manually fetch the token from `localStorage` and attach headers on every single API call (repetitive code violating DRY — Don't Repeat Yourself).
* **3. What happens if it is removed?** Authenticated API requests would fail because no authorization header would be sent, and expired tokens would remain stuck in `localStorage`.
* **4. What data goes into it?** Outgoing Axios request config and incoming Axios responses/errors.
* **5. What data comes out?** Modified request config with headers, or rejected Promise error.
* **6. Which other files use it?** Every frontend service file (`authService.js`, `productService.js`, `orderService.js`, `paymentService.js`, `userService.js`, `adminService.js`).

---

### Code Block 4: Composite Line Key in Cart (`client/src/context/CartContext.jsx`)
```javascript
const buildLineKey = (productId, selectedAddOns) => {
  const addOnKey = selectedAddOns
    .map((a) => `${a.groupName}:${a.optionLabel}`)
    .sort()
    .join("|");
  return `${productId}__${addOnKey}`;
};
```
* **1. What does this code do?** It creates a deterministic string ID for a line in the cart by combining the product ID and the sorted add-on choices.
* **2. Why is it needed?** Imagine you add a "Caffè Latte with Cow Milk" to your cart, and then you add a "Caffè Latte with Coconut Milk". If the cart only tracked items by `productId`, the second Latte would either overwrite the first one or just increment its quantity! With `buildLineKey`, the cart recognizes that they have different add-on configurations and keeps them as two separate rows in the cart. But if you add another "Caffè Latte with Cow Milk", it matches the key and correctly increments the quantity to 2.
* **3. What happens if it is removed?** Users would not be able to order multiple customized versions of the same drink in a single order.
* **4. What data goes into it?** `productId` (string) and `selectedAddOns` (array of objects).
* **5. What data comes out?** A unique string key like `"66f2...__Milk Choice:Coconut Milk|Extra Shot:Add Extra Shot"`.
* **6. Which other file uses it?** Used throughout `CartContext.jsx` (`addToCart`, `updateQuantity`, `removeFromCart`).

---

### Code Block 5: Optimistic UI Update (`client/src/pages/ProductDetails.jsx`)
```javascript
<button
  onClick={async () => {
    if (!isAuthenticated) {
      navigate("/signin", { state: { from: { pathname: `/product/${id}` } } });
      return;
    }
    setIsFavorite((v) => !v); // (1) Optimistic update
    try {
      await userService.toggleFavorite(product._id); // (2) Async API call
    } catch {
      setIsFavorite((v) => !v); // (3) Revert on failure
    }
  }}
>
  <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
</button>
```
* **1. What does this code do?** When the user clicks the Heart button, the UI updates the heart icon *instantly* before waiting for the server to reply. If the server request succeeds, nothing more needs to be done. If the network or server fails, it catches the error and flips the heart back to its previous state.
* **2. Why is it needed?** In high-latency mobile networks, waiting 500ms for a server response makes buttons feel sluggish and unresponsive. Optimistic UI gives the user immediate visual feedback.
* **3. What happens if it is removed?** The heart would lag and only update after the network round-trip finishes.
* **4. What data goes into it?** Current boolean state `isFavorite`.
* **5. What data comes out?** Instant toggled state in React, backed by a persistent MongoDB update in the user's `favorites` array.
* **6. Which other file uses it?** `userService.js` (`toggleFavorite`), `userController.js`.

---

# 6. Database Architecture & MongoDB Operations

### Database Technology & Name
* **Technology:** MongoDB Atlas (Cloud NoSQL).
* **Database Name:** `cafe-extreme` (configured in `MONGO_URI` in `server/.env`).
* **Connection String Pattern:**
  `mongodb+srv://<username>:<password>@cluster0.2qanrnx.mongodb.net/cafe-extreme?appName=Cluster0`

### Core Terminology Explained for Beginners
* **Document:** A single record in MongoDB (equivalent to a row in SQL). Formatted as JSON/BSON.
* **Collection:** A group of documents (equivalent to a table in SQL). Example: `products`, `orders`.
* **Schema:** The blueprint defined in Mongoose that specifies fields, types, validators, and defaults.
* **Model:** The compiled Mongoose wrapper around a schema that provides query methods (`Product.find()`, `User.create()`).
* **ObjectId (`_id`):** A unique 12-byte identifier automatically generated by MongoDB for every document (consisting of timestamp, machine ID, process ID, and counter).
* **Referencing:** Storing the `_id` of one document inside another document (like a Foreign Key in SQL).
* **Population (`.populate()`):** Mongoose's method of automatically replacing a referenced `_id` with the actual document from the other collection during a query (like an `INNER JOIN` in SQL).

### Database Schema Diagrams & Relationships

```
┌────────────────────────┐              ┌────────────────────────┐
│        Category        │              │          User          │
├────────────────────────┤              ├────────────────────────┤
│ _id: ObjectId          │              │ _id: ObjectId          │
│ name: String           │              │ name: String           │
│ slug: String (unique)  │              │ email: String (unique) │
│ description: String    │              │ password: String (hash)│
│ order: Number          │              │ role: 'user'|'admin'   │
└───────────▲────────────┘              │ phone: String          │
            │                           │ favorites: [ObjectId]──┼──┐
            │ 1:N                       │ isActive: Boolean      │  │
            │ (referenced)              └───────────▲────────────┘  │
┌───────────┴────────────┐                          │               │
│        Product         │                          │ 1:N           │
├────────────────────────┤                          │ (referenced)  │
│ _id: ObjectId          │                          │               │
│ name: String           │              ┌───────────┴────────────┐  │
│ description: String    │              │         Order          │  │
│ price: Number          │              ├────────────────────────┤  │
│ category: ObjectId     │              │ _id: ObjectId          │  │
│ image: String          │              │ user: ObjectId ────────┤  │
│ isAvailable: Boolean   │◄─────────────┤ items: [orderItem]     │  │
│ isFeatured: Boolean    │ 1:N snapshot │ subtotal, deliveryFee  │  │
│ addOns: [addOnGroup]   │              │ total: Number          │  │
└────────────────────────┘              │ deliveryAddress: Object│  │
                                        │ paymentMethod: String  │  │
                                        │ paymentStatus: String  │  │
                                        │ status: String (enum)  │  │
                                        │ payment: ObjectId ─────┼──┤
                                        └───────────▲────────────┘  │
                                                    │ 1:1           │
                                                    │ (referenced)  │
                                        ┌───────────┴────────────┐  │
                                        │        Payment         │  │
                                        ├────────────────────────┤  │
                                        │ _id: ObjectId          │  │
                                        │ order: ObjectId        │  │
                                        │ user: ObjectId         │  │
                                        │ gateway: 'stripe'|'demo│  │
                                        │ gatewayReferenceId     │  │
                                        │ amount: Number         │  │
                                        │ status: String (enum)  │  │
                                        └────────────────────────┘  │
                                                                    │
    User.favorites references Product._id ──────────────────────────┘
```

### Advanced MongoDB Operations Used in This Project

#### 1. Text Indexing & Full-Text Search
In `server/models/Product.js`:
```javascript
productSchema.index({ name: "text", description: "text" });
```
In `server/controllers/productController.js`:
```javascript
if (search) filter.$text = { $search: search };
```
* **Why it matters:** Instead of slow regex matching (`$regex`), MongoDB creates an inverted index on keywords in `name` and `description` for high-performance searching.

#### 2. Aggregation Pipeline with `$lookup` (Left Outer Join)
In `server/controllers/userController.js` (`getAllUsers`):
```javascript
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
```
* **Explanation:** Joins the `orders` collection onto the `users` collection where `user._id === order.user`. Then `$project` extracts user fields and computes `orderCount` by taking the `$size` of the joined orders array. This avoids fetching all order details to the Node.js server just to count them!

#### 3. Grouping & Unwinding for Analytics
In `server/controllers/adminController.js` (`getDashboardStats`):
```javascript
// Unwind array of items in each order to calculate top products by quantity sold
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
```
* **Explanation:** Every order contains an `items` array. `$unwind` flattens the array so each item becomes its own temporary document. Then `$group` groups by product name, sums the quantities sold and revenue generated, sorts descending, and limits to the top 5!

---

# 7. API Specification & HTTP Communication

### Full API Endpoint Table

| HTTP Method | Endpoint | Description & Purpose | Protected? | Request Data | Response | Controller File |
|-------------|----------|-----------------------|------------|--------------|----------|-----------------|
| **POST** | `/api/auth/register` | Create a new user account | Public | `{ name, email, password, confirmPassword }` | `201: { user, token }` | `authController.js` |
| **POST** | `/api/auth/login` | Authenticate user & return token | Public | `{ email, password }` | `200: { user, token }` | `authController.js` |
| **GET** | `/api/auth/me` | Fetch logged-in user profile from token | Private (User) | None (Bearer header) | `200: { user }` | `authController.js` |
| **GET** | `/api/products` | Get list of products with filters | Public | Query: `?category=...&search=...&featured=...` | `200: [ Product ]` | `productController.js` |
| **GET** | `/api/products/:id` | Get details for single product | Public | Params: `id` | `200: Product` | `productController.js` |
| **POST** | `/api/products` | Create a new product | Private (Admin) | `{ name, price, category, description, image, ... }` | `201: Product` | `productController.js` |
| **PUT** | `/api/products/:id` | Update product details | Private (Admin) | `{ ...fieldsToUpdate }` | `200: Product` | `productController.js` |
| **DELETE** | `/api/products/:id` | Remove product | Private (Admin) | Params: `id` | `200: { message }` | `productController.js` |
| **GET** | `/api/categories` | List all categories sorted by order | Public | None | `200: [ Category ]` | `categoryController.js` |
| **POST** | `/api/categories` | Create a new category | Private (Admin) | `{ name, slug, description, order }` | `201: Category` | `categoryController.js` |
| **PUT** | `/api/categories/:id` | Update a category | Private (Admin) | `{ ...fieldsToUpdate }` | `200: Category` | `categoryController.js` |
| **DELETE** | `/api/categories/:id` | Delete a category | Private (Admin) | Params: `id` | `200: { message }` | `categoryController.js` |
| **POST** | `/api/orders` | Place a new order | Private (User) | `{ items, deliveryAddress, paymentMethod }` | `201: Order` | `orderController.js` |
| **GET** | `/api/orders` | Get logged-in user's orders | Private (User) | None (Bearer header) | `200: [ Order ]` | `orderController.js` |
| **GET** | `/api/orders/:id` | Get single order (Owner or Admin) | Private (User/Admin) | Params: `id` | `200: Order` | `orderController.js` |
| **GET** | `/api/orders/admin/all` | List every order across system | Private (Admin) | None (Bearer header) | `200: [ Order ]` | `orderController.js` |
| **PUT** | `/api/orders/:id/status` | Update an order's fulfillment status | Private (Admin) | `{ status: "Preparing" }` | `200: Order` | `orderController.js` |
| **POST** | `/api/payments/:orderId/charge` | Initiate payment (Demo or Stripe) | Private (Owner) | Params: `orderId` | `200: { order, clientSecret, demoMode }` | `paymentController.js` |
| **POST** | `/api/payments/:orderId/confirm` | Confirm payment completion | Private (Owner) | Params: `orderId` | `200: { order, paid: true }` | `paymentController.js` |
| **PUT** | `/api/users/me` | Update logged-in user name/phone | Private (User) | `{ name, phone }` | `200: { user }` | `userController.js` |
| **PUT** | `/api/users/me/password` | Change user password | Private (User) | `{ currentPassword, newPassword }` | `200: { message }` | `userController.js` |
| **GET** | `/api/users/favorites` | Get user's populated favorite products | Private (User) | None (Bearer header) | `200: [ Product ]` | `userController.js` |
| **POST** | `/api/users/favorites/:productId`| Toggle favorite status for product | Private (User) | Params: `productId` | `200: { isFavorite, favorites }` | `userController.js` |
| **GET** | `/api/users/admin/all` | List all users with order counts | Private (Admin) | None (Bearer header) | `200: [ UserWithOrderCount ]` | `userController.js` |
| **PUT** | `/api/users/admin/:id/status` | Activate/Deactivate customer account | Private (Admin) | `{ isActive: false }` | `200: User` | `userController.js` |
| **GET** | `/api/admin/stats` | Aggregated revenue and order metrics | Private (Admin) | None (Bearer header) | `200: { totals, revenueOverTime, popularProducts, ... }` | `adminController.js` |
| **GET** | `/api/admin/payments` | Audit list of all payment transactions | Private (Admin) | None (Bearer header) | `200: [ Payment ]` | `adminController.js` |
| **GET** | `/api/health` | Server heartbeat health check | Public | None | `200: { status: "ok", timestamp }` | `server.js` |

### HTTP Methods Used and Why
* **GET:** Safe, idempotent data retrieval without modifying server state (`/api/products`, `/api/orders`).
* **POST:** Non-idempotent resource creation (`/api/orders`, `/api/auth/register`, `/api/products`).
* **PUT:** Idempotent updates replacing or modifying resource attributes (`/api/products/:id`, `/api/orders/:id/status`).
* **DELETE:** Idempotent removal of a resource (`/api/products/:id`, `/api/categories/:id`).

---

# 8. Authentication, Authorization & Security Analysis

### How Authentication & Authorization Work in This Project
1. **Password Hashing:** Passwords are never stored in plain text. When a user registers or updates their password, Mongoose's `pre('save')` hook generates a cryptographic salt using `bcrypt.genSalt(10)` and hashes the password with `bcrypt.hash`.
2. **Stateless JWT Tokens:** Upon successful login, `generateToken(user._id)` creates a signed token containing `{ id: user._id }` signed with `JWT_SECRET` and an expiration time of 7 days (`7d`).
3. **Protected Routes:** The `protect` middleware extracts the token from the `Authorization: Bearer <token>` header, decodes it with `jwt.verify`, and verifies the user exists and is active.
4. **Role-Based Access Control (RBAC):** The `adminOnly` middleware inspects `req.user.role`. If `req.user.role !== "admin"`, it immediately returns HTTP `403 Forbidden`.
5. **Ownership Authorization:** In `orderController.js` (`getOrderById`) and `paymentController.js` (`chargeOrderPayment`), the code explicitly compares:
   ```javascript
   const isOwner = order.user.toString() === req.user._id.toString();
   if (!isOwner && req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
   ```
   This prevents User A from viewing or modifying User B's orders even if User A knows User B's order ID.

### Security Weaknesses an Interviewer Might Point Out (And How to Answer!)

#### Weakness 1: JWT Stored in `localStorage`
* **What is wrong:** The frontend stores the token in browser `localStorage` (`client/src/services/api.js`).
* **Why it matters:** Any Cross-Site Scripting (XSS) vulnerability or rogue third-party script running on the page can read `localStorage.getItem()` and steal the user's token.
* **How it should be improved:** Store the JWT in an `httpOnly`, `secure`, `sameSite: 'strict'` cookie. JavaScript cannot read `httpOnly` cookies, making token theft via XSS impossible.

#### Weakness 2: Placeholder `JWT_SECRET` in `.env`
* **What is wrong:** `server/.env` currently has `JWT_SECRET=replace_with_a_long_random_string`.
* **Why it matters:** If an attacker knows the secret string (or if it remains default), they can forge valid admin tokens on their own computer and gain full control over the database.
* **How it should be improved:** Use a cryptographically generated 256-bit secret (e.g., `openssl rand -hex 64`) and inject it through secure environment managers (like Doppler or AWS Secrets Manager) rather than committed files.

#### Weakness 3: No Refresh Token Rotation
* **What is wrong:** The access token is valid for 7 continuous days (`7d`).
* **Why it matters:** If a token is intercepted, the attacker has access for a whole week with no way for the server to revoke it before expiration.
* **How it should be improved:** Implement short-lived access tokens (15 minutes) paired with a rotating refresh token stored in an `httpOnly` cookie and tracked in a database blacklist.

#### Weakness 4: Lack of Rate Limiting
* **What is wrong:** Endpoints like `POST /api/auth/login` have no request rate limits.
* **Why it matters:** An attacker can perform automated brute-force attacks to guess user passwords.
* **How it should be improved:** Use `express-rate-limit` to restrict failed login attempts to 5 per IP address per 15-minute window.

#### Weakness 5: Stripe Webhook Omission
* **What is wrong:** Payment completion relies on client-triggered API calls (`/payments/:orderId/confirm`).
* **Why it matters:** If the customer's internet cuts out immediately after Stripe charges their card, the client never calls `/confirm`, leaving the order marked as "pending" even though money was deducted.
* **How it should be improved:** Implement an asynchronous Stripe Webhook listener on the server (`stripe.webhooks.constructEvent`) listening to `payment_intent.succeeded` events directly from Stripe servers.

---

# 9. Core Software Engineering Principles in This Project

1. **Separation of Concerns (SoC) & MVC Pattern**
   * *Concept:* Isolating data modeling (Model), request routing/business logic (Controller), and visual presentation (View/React).
   * *In this project:* Routes (`productRoutes.js`) only define paths; Controllers (`productController.js`) only execute logic; Models (`Product.js`) only enforce data schemas; Services (`api.js`) only handle network requests.
   * *Interview Answer:* "I strictly separated concerns across the stack—Express routes handle HTTP mapping, controllers process business logic, and Mongoose models encapsulate data validation, ensuring modular and testable code."

2. **Component-Based Architecture & Reusability**
   * *Concept:* Building complex user interfaces from small, self-contained, composable components.
   * *In this project:* `<ProductCard>` is reused across `Home.jsx`, `Menu.jsx`, `CategoryMenuPage.jsx`, and `Dashboard.jsx` (Favorites tab).
   * *Interview Answer:* "I designed atomic, reusable components like `ProductCard` and `OrderStatusBadge`, which drastically reduced duplicate code and guaranteed visual and functional consistency across the application."

3. **Defensive Programming (Server-Side Recalculation)**
   * *Concept:* Never trusting client input for critical business rules like prices, discounts, or quantities.
   * *In this project:* `orderController.js` recomputes the price of every item and add-on from MongoDB rather than trusting prices passed by the frontend cart.
   * *Interview Answer:* "I followed defensive programming principles by treating all client inputs as potentially untrusted, recalculating line totals and verifying add-on availability on the server before persisting orders."

4. **Event Bubbling & Event Propagation Control**
   * *Concept:* Controlling DOM event bubbling when interactive elements are nested inside clickable containers.
   * *In this project:* In `ProductCard.jsx`, the quick-add "+" button is nested inside a React Router `<Link>`. The click handler executes `e.preventDefault()` and `e.stopPropagation()` so adding a product to the cart doesn't trigger navigation to the details page.
   * *Interview Answer:* "In `ProductCard`, I used `e.stopPropagation()` on the quick-add button to stop event bubbling up to the wrapping Link tag, allowing instant cart additions without unwanted page transitions."

5. **Data Snapshotting for Transactional Integrity**
   * *Concept:* Copying historical point-in-time data into receipts/orders instead of relying on mutable foreign keys.
   * *In this project:* In `Order.js`, the `orderItemSchema` stores the snapshot of `name`, `unitPrice`, `selectedAddOns`, and `lineTotal` at the time of purchase. If the store manager changes the price of an Espresso next month, past customer orders and financial reports remain historically accurate.
   * *Interview Answer:* "I snapshotted order item details and prices directly inside the order document at checkout time, preventing future product price edits from corrupting historical order records."

---

# 10. Your 1-Minute Elevator Pitch

*(Practice saying this out loud until it feels completely natural!)*

> "I developed **Café Extreme**, a full-stack coffee ordering and store management platform built using the MERN stack—MongoDB, Express, React, and Node.js—with Tailwind CSS and Vite.
>
> The problem it solves is giving independent specialty cafés their own branded online ordering system without paying steep aggregator commissions, while supporting complex beverage customizations like milk choices and extra espresso shots with live price updates.
>
> On the frontend, I used React with Context API for persistent global state across authentication and the shopping cart, and Framer Motion for smooth, premium animations.
>
> On the backend, I built a RESTful API with Express, secured private routes using JWT and role-based access control for customers and administrators, and integrated Stripe with an automatic test demo mode.
>
> One technical aspect I focused on was **defensive data validation**: even though the client calculates cart totals in real-time, the backend re-validates every item and add-on against MongoDB to prevent client-side price tampering. It gave me great hands-on experience designing end-to-end full-stack architectures."

---

# 11. Your 3–5 Minute Technical Deep-Dive

*(Use this when the interviewer says: "Walk me through your project in detail.")*

### Part 1: The Goal & Architecture (1 minute)
"Café Extreme was designed as an end-to-end e-commerce solution for a modern coffee house. I wanted to build something that was visually stunning on the customer side while offering real operational utility on the admin side.

Architecturally, I separated it into a decoupled three-tier system: a React 18 Single Page Application powered by Vite, communicating via a RESTful API with a Node.js/Express backend, which interfaces with a MongoDB Atlas cloud database through Mongoose. In development, I configured Vite's dev server to proxy `/api` requests to port 5000, eliminating CORS issues."

### Part 2: Frontend State & Customization Pipeline (1.5 minutes)
"On the frontend, the core challenge was handling drink customizations. A single product, like a Caffè Latte, can have required single-choice add-ons like Cow Milk or Coconut Milk, plus optional add-ons like extra espresso shots, each with their own price deltas.

To handle this cleanly:
* I created a `CartContext` with a custom `buildLineKey` utility. Instead of tracking cart items purely by product ID, it hashes the product ID with the sorted add-on labels. That way, if a customer orders one Latte with Oat Milk and another with Coconut Milk, the cart tracks them as separate line items rather than merging them inappropriately.
* For authentication, I built an `AuthContext` with custom `useAuth` and `useCart` hooks.
* I used Axios request interceptors to automatically inject the Bearer JWT token from `localStorage` into all outgoing API calls, and response interceptors to automatically clear credentials if a 401 Unauthorized status is ever returned.
* For styling and motion, I used Tailwind CSS with custom brand tokens and Framer Motion for scroll-linked parallax on the hero section."

### Part 3: Backend Security, Validation & Analytics (1.5 minutes)
"On the backend, I prioritized security and data integrity:
* Passwords are never stored in plain text; Mongoose `pre('save')` hooks hash passwords using `bcryptjs` with 10 salt rounds.
* I created modular middleware: `protect` verifies the JWT signature and extracts the user, while `adminOnly` ensures that operational endpoints—like updating product catalogs, viewing financial metrics, or toggling user account status—are strictly restricted to admins.
* For order placement, I enforced defensive validation. In `orderController`, the server takes the raw product IDs and add-on selections, queries the actual products from MongoDB, verifies availability, pulls the exact price deltas, and computes the total server-side.
* For the admin analytics dashboard, I leveraged MongoDB Aggregation Pipelines using `$lookup` for relational-style joins, `$unwind` to flatten order items, and `$group` to compute 14-day daily revenue trends and top-selling products directly inside the database engine."

### Part 4: Challenges & What I Learned (1 minute)
"One interesting challenge was handling payment processing in development without requiring real financial credentials. I implemented a gateway-agnostic `paymentService`. If a `STRIPE_SECRET_KEY` is present, it creates real Stripe PaymentIntents; if absent, it seamlessly falls back to a deterministic demo mode. This allowed the entire checkout flow to be tested end-to-end out of the box.

If I were to take this further into production, my first priorities would be migrating tokens from `localStorage` to `httpOnly` cookies, implementing refresh token rotation, and adding Stripe webhooks for asynchronous payment confirmations."

---

# 12. Interview Questions Categorized by Topic

### A. Beginner & Foundational Questions (15 Questions)
1. What is the difference between frontend and backend?
2. What is a Single Page Application (SPA)?
3. What is the difference between synchronous and asynchronous code in JavaScript?
4. What is a Promise in JavaScript?
5. How does `async/await` work?
6. What is a REST API?
7. What is JSON?
8. What is the difference between `let`, `const`, and `var`?
9. What is an HTTP status code, and what do 200, 201, 400, 401, 403, 404, and 500 mean?
10. What is an environment variable and why do we use `.env` files?
11. What is the difference between client-side routing and server-side routing?
12. What does npm stand for and what is the purpose of `package.json`?
13. What is the difference between dependencies and devDependencies?
14. What is Git, and what does `.gitignore` do?
15. What is CORS and why does it happen?

### B. Project-Specific Questions (20 Questions)
16. Walk me through the architecture of Café Extreme.
17. Why did you choose the MERN stack for this coffee shop project?
18. How do drink add-ons (milk options, extra shots) affect the product price?
19. How does the cart distinguish between two of the same drink with different customizations?
20. Why do you store order item details as a snapshot in the Order document?
21. What happens when a user clicks "Quick Add" (+) on a product card?
22. How is search implemented across the coffee menu?
23. How does the application prevent customers from tampering with item prices at checkout?
24. What payment options does the application support?
25. How does the payment service decide whether to use Stripe or Demo mode?
26. How does the admin dashboard calculate total revenue?
27. How does the admin toggle whether a user account is active or deactivated?
28. What prevents an admin from deactivating their own admin account?
29. How does the app handle a user trying to view an order that belongs to another customer?
30. Where is the user's authentication token stored on the client?
31. How does the client remember that a user is logged in after a page refresh?
32. What happens if a customer visits a protected URL like `/dashboard` while logged out?
33. What happens if a regular customer visits an admin URL like `/admin/orders`?
34. Why do categories have URL slugs like `hot-coffee`?
35. How is the fixed delivery fee handled across the application?

### C. React & Frontend Questions (15 Questions)
36. What is the Virtual DOM and how does React use it?
37. What are React hooks? Name three used in this project.
38. Explain `useState` and how you used it in `ProductDetails.jsx`.
39. Explain `useEffect` and how you used it in `useProducts.js`.
40. Why did you use `JSON.stringify(params)` in the dependency array of `useProducts.js`?
41. What is the purpose of the cleanup function (`cancelled = true`) inside `useEffect`?
42. What is the difference between props and state?
43. What is "prop drilling" and how did `AuthContext` and `CartContext` solve it?
44. What does `useMemo` do and where is it used in `CartContext.jsx`?
45. What does `useCallback` do and why did you wrap `addToCart` and `login` in it?
46. How does conditional rendering work in React? Give an example from this project.
47. What is an optimistic UI update, and where is it used in this project?
48. Why is `e.stopPropagation()` needed in `ProductCard.jsx`?
49. How do `<Outlet />` and `<Routes>` work in React Router DOM?
50. What is the purpose of `Vite` and how does the dev proxy work?

### D. Node.js & Express Backend Questions (12 Questions)
51. What is Express middleware and what is `next()`?
52. Why does the order of middleware matter in `server.js`?
53. Why must `errorHandler` be placed after all route handlers in `server.js`?
54. Why does `router.get("/admin/all")` need to be defined before `router.get("/:id")` in `orderRoutes.js`?
55. What is the difference between `req.params`, `req.query`, and `req.body`?
56. How does `express.json()` work?
57. What does `morgan` do in your server?
58. What is the purpose of `Promise.all` in `adminController.js`?
59. How does error handling work across asynchronous Express controllers?
60. What is an ES Module (`import/export`) versus CommonJS (`require/module.exports`)?
61. What does `process.exit(1)` mean in `db.js`?
62. How does the server handle a 404 route that does not exist?

### E. Database & MongoDB Questions (12 Questions)
63. Why did you choose MongoDB over a relational database like PostgreSQL or MySQL?
64. What is the difference between MongoDB and Mongoose?
65. What is a Mongoose pre-save hook?
66. What does `select: false` mean on the user password field?
67. What is the difference between embedding documents and referencing documents in Mongoose?
68. When would you use `.populate()` in Mongoose?
69. What is a MongoDB text index and where is it used here?
70. What is a MongoDB Aggregation Pipeline?
71. What does `$lookup` do in MongoDB?
72. What does `$unwind` do in MongoDB?
73. What is the difference between `Product.create()` and `Product.findByIdAndUpdate()`?
74. What is a `CastError` in Mongoose and how does your error handler treat it?

### F. Security Questions (10 Questions)
75. How are passwords secured in this application?
76. What is a salt in password hashing and why is it needed?
77. How does JSON Web Token (JWT) authentication work?
78. What information is stored inside your JWT payload?
79. What is the security risk of storing JWTs in `localStorage`?
80. What is the difference between authentication and authorization?
81. How does your backend prevent horizontal privilege escalation in orders?
82. What is NoSQL injection and how can Express apps defend against it?
83. Why should sensitive keys like `STRIPE_SECRET_KEY` never appear in frontend code?
84. What is the risk of having a weak default `JWT_SECRET` in `.env`?

### G. Difficult Follow-Up & Deep Questions (15 Questions)
85. If two customers place an order for the last bag of coffee beans simultaneously, how would the system handle concurrency?
86. Why did you put Three.js in `package.json` if the hero uses an HTML5 video?
87. If MongoDB goes down, how does the Express backend respond to incoming requests?
88. In `Checkout.jsx`, why was the payment method UI simplified to default to cash-on-delivery?
89. How would you migrate this application to support server-side Stripe webhooks?
90. How would you handle database transactions across multiple collections in Mongoose?
91. What happens if a category is deleted while products are still assigned to it?
92. Why did you build a custom SVG `BarChart` instead of using Chart.js or Recharts?
93. How would you implement pagination if the menu grew to 10,000 products?
94. How would you implement real-time order status updates for customers without polling?
95. How does your backend prevent duplicate user registrations with the same email?
96. What is the impact of running `npm run seed` on an existing database?
97. What is the difference between `findByIdAndUpdate` with `{ new: true }` versus without it?
98. Why does `User.findOne().select("+password")` need the plus sign?
99. If a customer changes their name in the profile tab, how does the navbar update immediately without refreshing the page?

---

# 13. Model Answers with Project Connections

Here are model answers for the most critical questions. Each includes the short answer you can say in an interview, the conceptual explanation, and the exact project connection.

---

### Question 1: "How does authentication work in this application?"
* **Short interview answer:**  
  "We use stateless JWT authentication with bcrypt password hashing. When a user logs in, the server validates their hashed password, creates a signed JWT containing their user ID, and sends it to the client. The client stores it in `localStorage` and attaches it via an Axios interceptor to the `Authorization` header on subsequent requests. Our backend `protect` middleware verifies the token and attaches the user to `req.user`."
* **Explanation:**  
  Traditional sessions store session IDs in server memory, requiring stateful tracking or Redis. JWTs are self-contained; the server verifies the digital signature using a secret key without looking up a session table.
* **Project connection:**  
  Found in `server/controllers/authController.js` (`loginUser`), `server/middleware/auth.js` (`protect`), and `client/src/services/api.js` (Axios interceptor).

---

### Question 2: "How does the backend prevent a user from buying a coffee for Rs 1 by modifying the client request?"
* **Short interview answer:**  
  "We practice defensive programming and never trust client-supplied prices. The client only sends the product ID, quantity, and selected add-on option labels. In `orderController.js`, our `buildValidatedItems` function queries the real product document from MongoDB, verifies availability, looks up the actual price and add-on price deltas from the database, and calculates the total server-side."
* **Explanation:**  
  Client-side code runs in the user's browser and can always be inspected, modified, or bypassed via curl or Postman. All business logic, financial totals, and permissions must be validated on the backend.
* **Project connection:**  
  `server/controllers/orderController.js` lines 10–53 (`buildValidatedItems`).

---

### Question 3: "Why did you need `buildLineKey` in your CartContext?"
* **Short interview answer:**  
  "Because coffee orders can have different customizations for the same base product. If a customer adds a Caffè Latte with Coconut Milk and another Caffè Latte with Cow Milk, tracking items solely by `productId` would merge them together. `buildLineKey` creates a composite key from the product ID and sorted add-on labels so distinct custom drinks stay on separate rows while identical configurations merge quantities."
* **Explanation:**  
  In e-commerce with configurable variants, a cart item's identity is defined by the product ID plus its specific combination of variant attributes.
* **Project connection:**  
  `client/src/context/CartContext.jsx` lines 11–17 (`buildLineKey`).

---

### Question 4: "Why did you define `router.get('/admin/all')` before `router.get('/:id')` in `orderRoutes.js`?"
* **Short interview answer:**  
  "In Express, routes are evaluated in the order they are defined. If `/:id` came first, Express would treat the string `'admin'` as an `:id` parameter and attempt to find an order with the ID `'admin'`. That would trigger a Mongoose `CastError` because `'admin'` is not a valid 24-character hexadecimal ObjectId. Defining specific static routes before dynamic parameter routes prevents this collision."
* **Explanation:**  
  Express router matches paths from top to bottom. Route ordering is a fundamental aspect of URL pattern matching.
* **Project connection:**  
  `server/routes/orderRoutes.js` lines 16–22, which explicitly includes a comment explaining this exact ordering requirement.

---

### Question 5: "What is an optimistic UI update and where did you use it?"
* **Short interview answer:**  
  "An optimistic update means updating the user interface immediately assuming the server request will succeed, and rolling back if it fails. I used this for the favorite Heart button on `ProductDetails.jsx`. When clicked, the heart fills immediately, giving instant feedback. If the network request fails in the `catch` block, it reverts the state."
* **Explanation:**  
  Waiting for an HTTP round trip can introduce a 200–500ms delay, making simple button clicks feel unresponsive. Optimistic updates improve perceived performance.
* **Project connection:**  
  `client/src/pages/ProductDetails.jsx` lines 169–174:
  ```javascript
  setIsFavorite((v) => !v);
  try {
    await userService.toggleFavorite(product._id);
  } catch {
    setIsFavorite((v) => !v); // revert
  }
  ```

---

### Question 6: "How does your admin dashboard calculate analytics efficiently without fetching all orders into Node.js?"
* **Short interview answer:**  
  "We use MongoDB Aggregation Pipelines to process data inside the database engine. For example, to find popular products, we use `$unwind` to flatten order items, and `$group` by product name to sum quantities and revenue, then sort and limit to the top 5. The Node server only receives the final aggregated summary, which minimizes memory and network overhead."
* **Explanation:**  
  Fetching thousands of documents into Node.js and running JavaScript array methods (`.reduce()`, `.filter()`) wastes CPU and RAM. Pushing computation to the database engine using aggregation pipelines is significantly faster.
* **Project connection:**  
  `server/controllers/adminController.js` lines 10–66 (`getDashboardStats`).

---

### Question 7: "What is the difference between embedding and referencing in MongoDB, and how did you choose in this project?"
* **Short interview answer:**  
  "Embedding stores related data as nested subdocuments inside the parent document, while referencing stores an `ObjectId` linking to a document in another collection. We embedded add-on options inside products because they belong exclusively to that drink and are always read together. We referenced `Category` inside `Product` and `User` inside `Order` because categories and users exist independently and relate to multiple entities."
* **Explanation:**  
  Rule of thumb in MongoDB: "Embed when data is contained, bounded, and queried together. Reference when data is unbound, frequently updated independently, or shared across multiple documents."
* **Project connection:**  
  Embedded: `addOns` in `Product.js` and `orderItemSchema` in `Order.js`.  
  Referenced: `category` in `Product.js` and `user` in `Order.js`.

---

### Question 8: "Why did you use Axios interceptors instead of attaching tokens manually?"
* **Short interview answer:**  
  "To maintain clean code and follow the DRY (Don't Repeat Yourself) principle. Manually fetching the token from `localStorage` in every single service function is repetitive and error-prone. The request interceptor injects the header into every outgoing call automatically, and the response interceptor centrally catches 401 Unauthorized errors to purge expired tokens."
* **Explanation:**  
  Interceptors act like middleware for HTTP clients. They let you run code before a request is sent or after a response is received.
* **Project connection:**  
  `client/src/services/api.js` lines 10–28.

---

### Question 9: "How does the payment service support both Stripe and Demo mode?"
* **Short interview answer:**  
  "Our `paymentService.js` is gateway-agnostic. It checks whether `STRIPE_SECRET_KEY` is present in environment variables. If present, it creates real Stripe PaymentIntents and returns a `clientSecret`. If the key is omitted, it automatically operates in demo mode, returning a simulated reference ID and marked as succeeded. This makes the entire application testable out of the box without requiring paid credentials."
* **Explanation:**  
  Using feature flags or environment checks to provide fallback mock implementations enables seamless development and review environments.
* **Project connection:**  
  `server/services/paymentService.js` (`chargeOrder`, `isDemoMode`, `confirmPayment`).

---

### Question 10: "What happens if a user inputs an invalid MongoDB ID into an endpoint like `/api/products/123`?"
* **Short interview answer:**  
  "Mongoose throws a `CastError` because `'123'` is not a valid 24-character hexadecimal ObjectId. Our centralized error handling middleware in `errorHandler.js` specifically detects `err.name === 'CastError' && err.kind === 'ObjectId'`, catches it, sets the HTTP status code to 404, and returns `{ message: 'Resource not found' }` rather than leaking an internal server stack trace."
* **Explanation:**  
  Robust APIs gracefully catch database casting and validation exceptions, translating them into standard client-friendly HTTP status codes.
* **Project connection:**  
  `server/middleware/errorHandler.js` lines 15–19.

---

# 14. Code Verification Questions (Did You Really Build It?)

Interviewers love testing whether you truly understand your codebase or just copy-pasted it. Here are the exact questions they ask and the precise answers based on your actual files:

### 1. "Why did you choose `bcryptjs` instead of standard `bcrypt`?"
* **The Truth from the Code:** `bcryptjs` is written in 100% pure JavaScript, whereas native `bcrypt` relies on C++ bindings that require node-gyp and a C++ compiler (like Python and Visual Studio Build Tools on Windows). On Windows machines, native `bcrypt` frequently causes installation errors. `bcryptjs` installs smoothly anywhere with zero native compilation dependencies.

### 2. "Why does `User.js` have `select: false` on the password field?"
* **The Truth from the Code:** To prevent catastrophic security leaks. Whenever developers run `User.find()` or `User.findById()`, Mongoose excludes the `password` field by default. That way, if a controller accidentally returns the raw `user` document to the frontend, the hashed password will never leak into the JSON response. When we explicitly need it for login verification, we must deliberately write `.select("+password")`.

### 3. "What does `e.stopPropagation()` do on the quick-add button in `ProductCard.jsx`?"
* **The Truth from the Code:** In `ProductCard.jsx`, the whole card is wrapped in a React Router `<Link to={'/product/' + product._id}>`. If a user clicks the "+" quick-add button, the click event naturally bubbles up the DOM tree to the parent `<Link>`, which would immediately navigate the user to the product details page. Calling `e.stopPropagation()` stops event bubbling, allowing the cart state to update while keeping the user on the current page.

### 4. "Why is there a cleanup flag (`cancelled = true`) in `useProducts.js`?"
* **The Truth from the Code:** To prevent race conditions and memory leaks. If a user quickly switches between category tabs ("Hot Coffee", then immediately "Iced Coffee"), two network requests are fired. If the first request arrives *after* the second request, it could overwrite the state with stale data. Setting `cancelled = true` in the `useEffect` cleanup function guarantees that only the response from the most recent active effect updates state.

### 5. "Why do you stringify the params in `useProducts.js` dependency array (`[JSON.stringify(params)]`)?"
* **The Truth from the Code:** In JavaScript, objects are compared by reference, not by value. If you pass an object literal like `{ category: 'hot-coffee' }` into `useProducts`, React sees a brand-new object reference on every single render. That would cause `useEffect` to trigger infinitely. By using `JSON.stringify(params)`, we compare a primitive string, so `useEffect` only re-runs when the actual parameter values change.

### 6. "How does the navbar know when to turn dark and blur on scroll?"
* **The Truth from the Code:** In `client/src/components/Navbar.jsx`, a `useEffect` registers a window scroll listener: `window.addEventListener("scroll", () => setScrolled(window.scrollY > 40))`. When the page scrolls past 40 pixels, `scrolled` becomes true, applying Tailwind classes: `bg-charcoal/95 backdrop-blur-md shadow-premium py-3`. The cleanup function removes the event listener on unmount.

### 7. "How does the profile tab in the dashboard update the navbar's user name without reloading?"
* **The Truth from the Code:** `AuthContext.jsx` exposes an `updateUser(partialUser)` function that merges updated profile attributes into the shared `user` state. When the profile form in `Dashboard.jsx` succeeds, it calls `updateUser({ name, phone })`. Because `Navbar.jsx` reads from `useAuth()`, React's reactivity triggers an immediate re-render of the navbar.

---

# 15. Things You Should NOT Claim (Red Flags & Inconsistencies)

During an interview, being caught claiming you wrote something that clearly has inconsistencies will hurt your credibility. Knowing your code's quirks and explaining them honestly turns potential red flags into proof of deep understanding!

### 1. Unused 3D Dependencies in `client/package.json`
* **The Issue:** `client/package.json` contains `"three"`, `"@react-three/fiber"`, and `"@react-three/drei"`. In addition, `client/vite.config.js` configures a manual rollup chunk for `three`.
* **The Reality:** Three.js is **NOT used anywhere** in the actual codebase! The hero section (`HeroSection.jsx`) uses a standard HTML5 `<video>` tag with Framer Motion.
* **What to say in the interview:**  
  *"Early in the design phase, an interactive 3D coffee cup was planned for the hero section using Three.js and React Three Fiber, which is why those dependencies and the Vite manual chunk were added. However, we opted for a cinematic background video instead to improve initial load speed, battery efficiency, and mobile responsiveness. The Three.js packages were left in `package.json` and are dead dependencies that should be uninstalled."*

### 2. Redundant `mongodb` Package in `server/package.json`
* **The Issue:** `server/package.json` lists `"mongodb": "^7.6.0"` alongside `"mongoose": "^8.5.1"`.
* **The Reality:** The server communicates exclusively via Mongoose. Mongoose already bundles its own tested MongoDB driver.
* **What to say in the interview:**  
  *"The standalone `mongodb` package was accidentally added during initial setup. Since Mongoose manages its own native driver under the hood, the standalone dependency is redundant and should be pruned."*

### 3. Client Payment Service Disconnect in `Checkout.jsx`
* **The Issue:** `client/src/services/paymentService.js` exists and the backend has complete `/api/payments/:orderId/charge` endpoints.
* **The Reality:** `Checkout.jsx` does not currently import or call `paymentService`. Orders placed through the checkout form currently submit without a payment method and default to `cash-on-delivery` with `paymentStatus: "pending"`.
* **What to say in the interview:**  
  *"The backend payment architecture and client service wrapper are fully implemented to support card charges and Stripe clientSecrets. In the current checkout UI, the form directly creates the order as Cash on Delivery. Hooking the payment method toggle back into `Checkout.jsx` to call `paymentService.charge` for card payments is the immediate next frontend task."*

### 4. Placeholder Image Fallback Discrepancy
* **The Issue:** In `server/models/Product.js`, the default image is `"https://placehold.co/600x600/3B2A20/F5EDE0?text=Cafe+Extreme"`. However, in `client/src/pages/Admin/AdminProducts.jsx` line 11, the empty form defaults to `image: "/images/placeholder-coffee.jpg"`.
* **The Reality:** There is no file named `placeholder-coffee.jpg` in `client/public/images/`.
* **What to say in the interview:**  
  *"I noticed an inconsistency where the admin creation modal defaults to a local path that doesn't exist, while the Mongoose model defaults to a remote placeholder URL. Aligning both to use a unified SVG fallback is a needed fix."*

### 5. Orphaned References on Category Deletion
* **The Issue:** If an admin deletes a category (`DELETE /api/categories/:id`), `categoryController.js` simply calls `Category.findByIdAndDelete(req.params.id)`.
* **The Reality:** Any products that belonged to that category will retain a dangling `category` ObjectId pointing to a non-existent document.
* **What to say in the interview:**  
  *"Currently, category deletion doesn't perform a cascade update. In a production refactor, I would add a Mongoose middleware to reassign products to an 'Uncategorized' fallback or prevent deletion if products are still attached."*

### 6. Secrets in `.env`
* **The Issue:** `server/.env` contains a hardcoded placeholder `JWT_SECRET=replace_with_a_long_random_string` and a default admin password `123456`.
* **What to say in the interview:**  
  *"These are development defaults. In production, sensitive secrets must never be committed to source control and must be generated with high entropy."*

---

# 16. Project Weaknesses & 8 Realistic Improvements

When an interviewer asks: *"What would you improve in this project if you had more time?"*, pick 3 or 4 of these well-thought-out engineering answers:

### Improvement 1: Migrate JWT from `localStorage` to HttpOnly Cookies
* **Current Situation:** Token stored in `localStorage` and sent via `Authorization` header.
* **Problem:** Vulnerable to token theft via Cross-Site Scripting (XSS).
* **Proposed Improvement:** Set the JWT in an HTTP response cookie with `httpOnly: true`, `secure: true`, and `sameSite: 'strict'`.
* **Why it's useful:** The browser automatically attaches cookies to requests, and client-side JavaScript cannot read them, closing the XSS theft vector.
* **Implementation:** Use `res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })` on login, and `req.cookies.token` in `protect` middleware.

### Improvement 2: Add Real-Time Order Tracking with WebSockets (Socket.io)
* **Current Situation:** When an admin updates an order status, the customer only sees it if they manually refresh `/dashboard`.
* **Problem:** Poor user experience; delivery customers expect live status updates (like UberEats or Domino's tracker).
* **Proposed Improvement:** Integrate `Socket.io` between Express and React.
* **Why it's useful:** The barista can click "Preparing", and the customer's order tracker animates immediately in real-time.
* **Implementation:** When `updateOrderStatus` runs, emit `io.to(order.user).emit('order_updated', updatedOrder)`.

### Improvement 3: Implement Database Transactions for Multi-Document Operations
* **Current Situation:** Order creation and payment records are created in separate Mongoose calls.
* **Problem:** If payment document creation fails after the order is saved, the database enters an inconsistent partial state.
* **Proposed Improvement:** Use MongoDB Multi-Document ACID Transactions (`mongoose.startSession()`).
* **Why it's useful:** Ensures either both operations succeed or both roll back completely.

### Improvement 4: Implement Server-Side Pagination
* **Current Situation:** `Product.find(filter)` and `Order.find()` return all documents at once.
* **Problem:** If the store grows to 5,000 orders or products, memory usage will spike and network payloads will become huge.
* **Proposed Improvement:** Implement cursor-based or limit-offset pagination (`?page=1&limit=12`) using `.skip()` and `.limit()`.

### Improvement 5: Image Upload to Cloudinary / AWS S3
* **Current Situation:** Product images are static files inside `client/public/images` or external URL strings.
* **Problem:** Admin cannot easily upload fresh photography from their phone or computer through the admin panel.
* **Proposed Improvement:** Use `multer` middleware with Cloudinary or AWS S3 upload service, storing the secure image URL in MongoDB.

### Improvement 6: Automated Unit & Integration Testing
* **Current Situation:** No automated test suites (`test` script missing from `package.json`).
* **Problem:** Any code modification could silently break checkout calculations or authentication without detection.
* **Proposed Improvement:** Set up Jest / Supertest for backend API route testing and Vitest + React Testing Library for frontend components.

### Improvement 7: Input Validation with Joi or Zod
* **Current Situation:** Manual `if (!email || !password)` checks in controllers.
* **Problem:** Verbose, inconsistent validation across endpoints; edge cases (like invalid email formats or negative numbers) can slip through.
* **Proposed Improvement:** Use Zod schemas to validate request bodies before controllers execute.

### Improvement 8: Cascade Deletion / Orphan Handling
* **Current Situation:** Deleting a category leaves products with orphaned category IDs.
* **Proposed Improvement:** Use a Mongoose pre-hook on `findByIdAndDelete` to reassign matching products to an "Uncategorized" category or block deletion if `Product.countDocuments({ category: id }) > 0`.

---

# 17. Git & Development Workflow

### Git Terminology Explained
* **Repository (Repo):** The project folder tracked by Git containing all code, commits, and history (`dinithiuththara/cafe-extreme-MERN`).
* **Commit:** A snapshot of staged changes saved to history with a message and hash (e.g., `24f2467a Complete Café Extreme full-stack features...`).
* **Branch:** An independent line of development (e.g., `main`, `feature/payment-gateway`).
* **Push:** Uploading local commits to remote GitHub (`git push origin main`).
* **Pull:** Fetching and merging changes from GitHub into your local workspace (`git pull`).
* **Merge:** Combining two branches together.
* **`.gitignore`:** A text file listing files that Git should ignore (e.g., `node_modules`, `.env`, build outputs like `dist`).
* **Environment Variables (`.env`):** Configuration values kept outside the codebase for security and portability.

### The Development Workflow You Can Describe in Your Interview
> "During development, I followed standard Git practices:
> 1. Kept the `main` branch clean and deployable.
> 2. Structured work into atomic commits with descriptive commit messages.
> 3. Maintained strict environment hygiene by adding `node_modules` and `.env` files to `.gitignore` so credentials and heavy binaries were never pushed to GitHub.
> 4. Used an `.env.example` file to document all required environment keys for any team member cloning the repository."

---

# 18. Last-Minute 10-Minute Interview Cheat Sheet

### Project in 30 Seconds
"Café Extreme is a full-stack MERN coffee shop web application. Customers browse a responsive catalog, customize drinks with milk and extra shot add-ons with live price updates, manage a persistent cart, and place orders. Admins manage products, categories, orders, and view sales analytics on an authenticated back-office dashboard. It features stateless JWT authentication, defensive backend price recalculation, and a flexible payment service supporting Stripe and demo modes."

### Tech Stack
* **Frontend:** React 18, Vite, Tailwind CSS, React Router v6, Framer Motion, Lucide React, Axios.
* **Backend:** Node.js, Express.js (ES Modules), Mongoose, bcryptjs, jsonwebtoken, Stripe SDK.
* **Database:** MongoDB Atlas (Cloud NoSQL).

### Architecture
Three-tier decoupled client-server architecture. React SPA runs on Vite (port 5173 with `/api` proxy), Express REST API runs on Node (port 5000), MongoDB Atlas stores BSON documents.

### 10 Most Important Files
1. `server/server.js` (Express entry point & middleware)
2. `server/middleware/auth.js` (`protect` & `adminOnly` JWT auth)
3. `server/controllers/orderController.js` (Defensive order validation & creation)
4. `server/controllers/authController.js` (Register, login, token issue)
5. `server/controllers/adminController.js` (Aggregation analytics & stats)
6. `server/services/paymentService.js` (Stripe & demo mode handling)
7. `client/src/services/api.js` (Axios client with JWT interceptor)
8. `client/src/context/AuthContext.jsx` (Global authentication state)
9. `client/src/context/CartContext.jsx` (Cart state & `buildLineKey` logic)
10. `client/src/components/RouteGuards.jsx` (`ProtectedRoute` & `AdminRoute`)

### 10 Important Concepts
1. **Separation of Concerns:** Routes vs Controllers vs Models vs Views.
2. **Defensive Programming:** Server re-evaluates all prices against MongoDB.
3. **Stateless Authentication:** JWT signed with secret, verified per request.
4. **Data Snapshotting:** Order items store point-in-time price and add-on data.
5. **Event Bubbling:** `e.stopPropagation()` on quick-add button inside Link.
6. **Optimistic UI:** Favorite heart updates before the API response returns.
7. **Composite Keys:** `buildLineKey` hashes product ID with add-ons.
8. **Interceptors:** Axios injects JWT and handles 401s centrally.
9. **Aggregation Pipelines:** MongoDB `$unwind`, `$group`, `$lookup` for metrics.
10. **RBAC:** Role-Based Access Control distinguishing regular users from admins.

### 20 Questions You MUST Know Before Entering the Room
1. *What stack did you use?* -> MERN (MongoDB, Express, React, Node) + Tailwind + Vite.
2. *Where is the token stored?* -> `localStorage` under key `cafe_extreme_token`.
3. *How is the token sent to the backend?* -> In the `Authorization` header as `Bearer <token>` via Axios interceptor.
4. *How are passwords stored?* -> Hashed with `bcryptjs` using 10 salt rounds in a Mongoose `pre('save')` hook.
5. *Why is `password` marked `select: false`?* -> So it is never returned in database queries by default.
6. *What does the `protect` middleware do?* -> Verifies the JWT and attaches the active user to `req.user`.
7. *What does `adminOnly` do?* -> Checks if `req.user.role === 'admin'`; returns 403 if not.
8. *Can a customer buy an Espresso for Rs 1?* -> No, the server recalculates all prices directly from MongoDB.
9. *What is `buildLineKey`?* -> A composite key of `productId` and add-ons so different customizations don't overwrite each other.
10. *Why do order items snapshot prices?* -> So future catalog price changes don't change past receipts.
11. *How does the hero video load?* -> HTML5 `<video>` autoplay with fallback background color so the page never blocks.
12. *Why is Three.js in `package.json`?* -> A 3D coffee cup was originally planned, but replaced by a video for performance; it is a dead dependency to be pruned.
13. *What is Demo payment mode?* -> An automatic fallback when Stripe keys are absent so checkout can be tested end-to-end.
14. *What prevents an admin from deactivating themselves?* -> `userController.js` explicitly checks `req.params.id === req.user._id.toString()`.
15. *What prevents User A from viewing User B's order?* -> `getOrderById` verifies `order.user.toString() === req.user._id.toString() || req.user.role === 'admin'`.
16. *Why did you stringify params in `useProducts.js`?* -> Object references change every render; stringifying prevents infinite re-render loops.
17. *What does `Promise.all` do in the admin controller?* -> Runs user count, product count, order count, and revenue aggregation concurrently.
18. *What does `$unwind` do?* -> Deconstructs the items array in orders into individual documents for aggregation.
19. *What is an improvement you'd make?* -> Move JWT to HttpOnly cookies to protect against XSS.
20. *What is another improvement?* -> Add real-time order tracking using WebSockets (Socket.io).

### 10 Things You Should NOT Forget
1. Your backend uses **ES Modules** (`"type": "module"` in `server/package.json`), meaning `import/export` instead of `require()`.
2. Prices are in **Sri Lankan Rupees (Rs / LKR)**, matching the local café context.
3. The flat delivery fee is **Rs 300** (`DELIVERY_FEE = 300`).
4. The admin seed account has email `admin@cafeextreme.com`.
5. The customer site is a **dark luxury aesthetic** (`#14100D` charcoal, `#C9A15A` copper); the admin portal is a **crisp light grid** (`#FFFFFF`, `#F5EDE0`).
6. In `Checkout.jsx`, the UI currently places orders as Cash on Delivery; card payment via `paymentService.charge` was architected on backend/services but not yet hooked to the checkout button.
7. Three.js is **not** currently active in the app; be honest that it was an initial exploration replaced by video.
8. The search bar on the menu uses MongoDB **text indexes** on `name` and `description`.
9. Product cards have a unique SVG **extraction ring** animation that draws itself on hover (`ringDraw` keyframe).
10. Always stay calm, take a two-second pause before answering, and connect your answer back to the actual code files!

---
*Good luck with your interview! You know this project inside and out.*
