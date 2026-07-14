# Online Book Store 📚

A complete full-stack MERN (MongoDB, Express, React, Node.js) web application representing an Online Book Store.

## Features
- **Admin Dashboard**: System control actions, registered users management, seller verification (approve/block stores), catalog moderation, and real-time interactive SVG charts (Sales Trend, Genre Distribution, Order Statuses).
- **Seller Portal**: Manage bookstore catalogs, register stores, check active/pending status, manage inventory, add books with cover images, and fulfill reader orders.
- **User Portal**: Search and filter books by genre, price range, and rating. Maintain a cart, check out with COD or card payment options, write reviews, and track order histories.
- **Modern UI**: Designed with glassmorphic cards, smooth interactive transitions, responsive layouts, and curated color palettes.

## Tech Stack
- **Frontend**: React, React Router, Axios, Lucide React, CSS Variables, Vite
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT (JSON Web Tokens), Bcryptjs, Multer
- **Proxying**: Configured Vite dev proxy to completely prevent CORS/Network conflicts.

## Setup Instructions
1. Clone the repository.
2. Initialize and start the backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. Initialize and start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
