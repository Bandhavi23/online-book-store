# 📚 PROJECT REPORT & DOCUMENTATION
## PREMIUM ONLINE BOOK MARKETPLACE WITH MULTI-PORTAL ACCESS & SVG ANALYTICS
**A Full-Stack MERN Application**

---

### **COLLEGE PROJECT SUBMISSION REPORT**

**Project Title:** Premium Online Book Marketplace with Multi-Portal Access & SVG Analytics  
**Course Name:** Bachelor of Technology / Computer Science & Engineering (B.Tech / CSE)  
**Academic Session:** 2026 - 2027  
**Submitted In Partial Fulfillment of the Requirements for the Degree of Bachelor of Technology.**

**Submitted By:**  
* **Student Name:** [Your Name]  
* **Roll / Registration Number:** [Your Roll Number]  
* **Department:** Department of Computer Science & Engineering  

**Under the Guidance of:**  
* **Project Guide Name:** [Guide Name]  
* **Designation:** Assistant Professor / Head of Department  

---

## 📄 TABLE OF CONTENTS
1. [Certificate of Authenticity](#-certificate-of-authenticity)
2. [Student Declaration](#-student-declaration)
3. [Acknowledgements](#-acknowledgements)
4. [Abstract / Executive Summary](#-abstract--executive-summary)
5. [Chapter 1: Introduction](#1-introduction)
6. [Chapter 2: Literature Survey & Feasibility Analysis](#2-literature-survey--feasibility-analysis)
7. [Chapter 3: System Requirements Specification (SRS)](#3-system-requirements-specification-srs)
8. [Chapter 4: System Design & Architecture](#4-system-design--architecture)
9. [Chapter 5: Detailed Module Description](#5-detailed-module-description)
10. [Chapter 6: Database Schema Design](#6-database-schema-design)
11. [Chapter 7: Security & Implementation Flow](#7-security--implementation-flow)
12. [Chapter 8: API Endpoints Directory](#8-api-endpoints-directory)
13. [Chapter 9: Setup & Deployment Instructions](#9-setup--deployment-instructions)
14. [Chapter 10: Testing & Verification Plan](#10-testing--verification-plan)
15. [Chapter 11: Conclusion & Future Scope](#11-conclusion--future-scope)
16. [References / Bibliography](#-references--bibliography)

---

## 📜 CERTIFICATE OF AUTHENTICITY

This is to certify that the project report entitled **"Premium Online Book Marketplace with Multi-Portal Access & SVG Analytics"** is a bonafide work carried out by **[Your Name]** (Roll No: **[Your Roll Number]**) under my supervision and guidance. The results embodied in this report have not been submitted to any other University or Institute for the award of any degree or diploma.

<br><br>

______________________  
**[Guide Name]**  
*Project Guide*  
*Department of Computer Science & Engineering*  

<br>

______________________  
**[HOD Name]**  
*Head of Department*  
*Department of Computer Science & Engineering*  

---

## 📝 STUDENT DECLARATION

I, **[Your Name]**, hereby declare that the project report entitled **"Premium Online Book Marketplace with Multi-Portal Access & SVG Analytics"** submitted to the Department of Computer Science & Engineering, is an authentic record of my own work carried out under the guidance of **[Guide Name]**. 

I also declare that this work has not been previously submitted, in part or full, for any other degree at this or any other institution. All help received from literature, documentation, and tools has been duly acknowledged.

<br><br>

**Date:** July 15, 2026  
**Place:** [City/College Campus]  

______________________  
**[Your Name]**  
*Roll / Registration Number*  

---

## 🤝 ACKNOWLEDGEMENTS

I express my deepest gratitude to **[Guide Name]**, Department of Computer Science & Engineering, for providing me with invaluable advice and constant encouragement throughout the development of this project.

I am also highly indebted to **[HOD Name]**, Head of the Department of Computer Science & Engineering, for providing necessary infrastructural support and facilitating a healthy academic environment to complete this project.

Finally, I would like to thank my family, peers, and friends who supported and reviewed my project work, providing useful feedback to improve the usability, aesthetics, and technical robustness of the application.

---

## 🎯 ABSTRACT / EXECUTIVE SUMMARY

In the modern digital era, the physical bookstore ecosystem is facing structural transitions, shifting consumer preferences towards online catalogs, digital order tracking, and integrated reviews. This project presents a **Premium Online Book Marketplace** built using the **MERN (MongoDB, Express, React, Node.js)** technology stack. 

Unlike conventional single-channel e-commerce systems, this platform implements a multi-sided marketplace topology. It supports three distinct user portals:
1. **Readers (Buyers):** Provide catalog searches, filters, responsive glassmorphic shopping carts, Cash-on-Delivery (COD) and Card checkout integration, order tracking, and review posting with live aggregate rating recalculations.
2. **Sellers (Merchants):** Allow merchant store creation (subject to admin approval), inventory tracking, real-time stock and metadata modifications, and seller-specific order shipping management.
3. **Administrators (Moderators):** Provide system-wide monitoring, user/seller moderation panels, and three custom-designed, interactive SVG charts (Revenue Bar Graph, Genre Distribution Donut Chart, and Order Status Progress Histogram) with hover-sensitive tooltips for real-time business intelligence.

Security is enforced using stateless JSON Web Tokens (JWT) for authentication, custom middleware for Role-Based Access Control (RBAC), and Salt-Hashed passwords via Bcryptjs. The frontend adopts a fully customized, premium Glassmorphic CSS style sheet without bloated external utility libraries, ensuring fast paint times, optimal layout performance, and complete responsiveness.

---

## 1. INTRODUCTION

### 1.1 Project Overview
The **Premium Online Book Marketplace** is a web-based e-commerce platform that connects readers, independent booksellers, and system administrators on a single integrated hub. It uses Node.js and Express.js for the RESTful API layer, MongoDB as the document database, and React (bootstrapped with Vite) for a highly responsive, dynamic client interface.

### 1.2 Purpose & Objectives
The primary objectives of this software project are:
* **Multi-Portal Isolation:** Design separate, tailored dashboards for Readers, Sellers, and Administrators with role-specific navigation menus and access privileges.
* **Modern Aesthetic Interface:** Avoid default designs by building a glassmorphic user interface utilizing modern typography, custom CSS variables, and fluid transitions.
* **Scalable Schema Architecture:** Establish schema validations in MongoDB to handle complex relationships between users, books, orders, reviews, and storefront accounts.
* **Native Business Intelligence:** Implement interactive, client-side vector charts (SVG) that dynamically render aggregate database metrics without relying on heavy third-party canvas packages.

### 1.3 Scope of the Project
The application covers:
* User registration, profile configuration, and secure login with session persistence.
* Complex database queries including text searching, category filtering, and price bounds restriction.
* Real-time shopping cart operations (add, remove, quantity update, savings computations).
* Checkout flow, address validation, and simulated payment gateways.
* Store inventory management including CRUD operations on listings, metadata updates, and cover asset handling.
* System moderation workflows where Admins approve stores, delete accounts, and moderate book listings.

---

## 2. LITERATURE SURVEY & FEASIBILITY ANALYSIS

### 2.1 Literature Survey
Traditional e-commerce architectures commonly rely on server-side rendering (e.g., PHP, JSP) which introduces significant network overhead as full pages are re-rendered and transmitted on every interaction. Modern client-side Single Page Application (SPA) architectures solve this by separating the data layer (JSON APIs) from the presentation layer (React components), resulting in native-like client transitions and reduced server workloads.

### 2.2 Limitations of Existing Systems
1. **Monolithic Access:** Most platforms offer only standard user/buyer flows, requiring sellers to manage products via offline support or complex separate platforms.
2. **Heavy Reporting Overhead:** Analytical dashboards in small-scale e-commerce systems often rely on bloated third-party charting libraries (like Chart.js or D3.js) that impact page load times.
3. **Generic Styles:** Many templates use generic UI libraries (like Bootstrap or Tailwind) that result in standardized, uninspired aesthetics.

### 2.3 Proposed System Benefits
* **Role-Based Security:** Complete middleware isolation ensures readers cannot access seller listings, and sellers cannot modify admin options.
* **Lightweight Custom SVG Analytics:** The dashboard utilizes direct SVG path mapping for dynamic charting, loading in milliseconds.
* **Glassmorphism Theme:** Premium semi-transparent frosted card aesthetics (`backdrop-filter`) with custom color gradients provide an advanced, premium layout.

### 2.4 Feasibility Study
* **Technical Feasibility:** The development tools (Node.js, Express, React, MongoDB) are open-source and widely documented. The development machine requires standard specs, making the system highly feasible.
* **Economic Feasibility:** No license fees are associated with the MERN stack. Hosting can be done on free tiers (like MongoDB Atlas, Render, Vercel), minimizing operational costs.
* **Operational Feasibility:** The system interface is intuitive and requires no technical training for users, sellers, or administrators.

---

## 3. SYSTEM REQUIREMENTS SPECIFICATION (SRS)

### 3.1 Hardware Requirements
* **Processor:** Dual Core Intel i3 or equivalent AMD processor (2.0 GHz or higher)
* **RAM:** 4 GB Minimum (8 GB recommended for development environment)
* **Disk Space:** 500 MB of free storage (excluding database growth)
* **Client Devices:** Any device with a modern HTML5-compliant web browser (Desktop, Laptop, Tablet, Smartphone)

### 3.2 Software Requirements
* **Operating System:** Windows 10/11, macOS, or Linux
* **Runtime Environment:** Node.js (v18.0.0 or higher)
* **Database Management System:** MongoDB (v6.0 or higher local instance, or MongoDB Atlas cloud account)
* **Package Manager:** npm (v9.0 or higher)
* **Integrated Development Environment:** Visual Studio Code
* **Web Browser:** Google Chrome, Mozilla Firefox, Microsoft Edge, or Apple Safari

### 3.3 Functional Requirements
* **FR-1 (Authentication):** Users must be able to register and log in under specific roles (User, Seller, Admin).
* **FR-2 (Product Catalog):** Readers can view books, filter by genre, search by keywords, and review details.
* **FR-3 (Cart & Checkout):** Readers can add books to their cart, adjust counts, key in addresses, and finalize order placements.
* **FR-4 (Seller Control):** Authorized sellers can add, edit, or delete books listed by their specific store and change order shipment states.
* **FR-5 (Admin Dashboards):** System admins can view SVG chart analytics, delete user accounts, and approve/block seller storefronts.

### 3.4 Non-Functional Requirements
* **NFR-1 (Security):** Passwords must be hashed using Bcryptjs with a work factor of 12 before database insertion. HTTP requests to protected routes must require valid JWT headers.
* **NFR-2 (Performance):** REST API endpoints must respond in less than 200ms under standard loads.
* **NFR-3 (Usability):** Responsive web design must render correctly on both mobile devices (minimum width 320px) and wide desktop screens.

---

## 4. SYSTEM DESIGN & ARCHITECTURE

### 4.1 System Architecture Block Diagram
The application utilizes a decoupled client-server architecture where the React frontend communicates asynchronously with the Express backend via REST API calls.

```mermaid
graph TD
    %% Styling
    classDef client fill:#e0f7fa,stroke:#00acc1,stroke-width:2px,color:#000;
    classDef server fill:#efebe9,stroke:#8d6e63,stroke-width:2px,color:#000;
    classDef db fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    
    subgraph Frontend [Vite + React Client]
        UI["Glassmorphic UI (React Components)"]:::client
        Context["Auth Context (JWT State)"]:::client
        Routes["React Router DOM (Protected Routes)"]:::client
    end

    subgraph Backend [Node.js + Express Server]
        API["Express Router (REST Endpoints)"]:::server
        Auth["JWT & Role Authorization Middlewares"]:::server
        Controller["Route Controllers (Business Logic)"]:::server
    end

    subgraph Database [MongoDB Database]
        Mongoose["Mongoose Schemas & Validations"]:::db
        Collections[("MongoDB Collections (Users, Books, Orders, etc.)")]:::db
    end

    %% Flow lines
    UI -->|1. Triggers Action| Context
    Context -->|2. Async HTTP Fetch + Bearer Token| API
    API -->|3. Route Match & Auth Guard Check| Auth
    Auth -->|4. Authenticated Controller Handler| Controller
    Controller -->|5. Mongoose Document Queries| Mongoose
    Mongoose -->|6. Query Executions| Collections
    Collections -.->|7. Raw JSON Documents| Mongoose
    Mongoose -.->|8. Return Schema Objects| Controller
    Controller -.->|9. Send HTTP JSON response (200 OK)| UI
```

### 4.2 Data Flow Diagram (DFD Level 1)
The DFD displays the data exchanges between external entities (Reader, Seller, Admin) and the core sub-processes of the application.

```mermaid
graph TD
    classDef entity fill:#fff9c4,stroke:#fbc02d,stroke-width:2px,color:#000;
    classDef process fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#000;
    classDef store fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000;

    %% Entities
    Reader[Reader / User]:::entity
    Seller[Seller Storefront]:::entity
    Admin[System Administrator]:::entity

    %% Processes
    P1((1.0 Auth & Profile Management)):::process
    P2((2.0 Catalog Browsing & Cart Checkout)):::process
    P3((3.0 Inventory & Order Fulfillment)):::process
    P4((4.0 Moderation & System Analytics)):::process

    %% Data Stores
    D1[(Users Collection)]:::store
    D2[(Books Collection)]:::store
    D3[(Orders Collection)]:::store
    D4[(Reviews Collection)]:::store

    %% Readers Flow
    Reader -->|Register / Credentials| P1
    P1 -->|Query & Save Profile| D1
    Reader -->|Search, Filter & Checkout| P2
    P2 -->|Fetch Catalog| D2
    P2 -->|Save Order| D3
    Reader -->|Post Rating & Feedback| P2
    P2 -->|Save Review| D4

    %% Sellers Flow
    Seller -->|Sign up Store| P1
    Seller -->|Add/Edit Catalog| P3
    P3 -->|Save Book Details| D2
    P3 -->|Update Order Status| D3

    %% Admin Flow
    Admin -->|Manage User Profiles| P4
    P4 -->|Approve / Block / Delete| D1
    P4 -->|Moderate Catalog| D2
    P4 -->|Read Stats Summary| D3
```

### 4.3 Entity-Relationship (ER) Diagram
The entity relationships model shows how different data collections link together.

```mermaid
erDiagram
    USER ||--o{ ORDER : "places"
    USER ||--o{ REVIEW : "writes"
    BOOK ||--o{ REVIEW : "receives"
    SELLER ||--o{ BOOK : "lists"
    ORDER ||--|{ ORDER_ITEM : "contains"
    BOOK ||--o{ ORDER_ITEM : "ordered in"

    USER {
        ObjectId id PK
        string name
        string email
        string password
        string phone
        string address
        string role
        date createdAt
    }
    SELLER {
        ObjectId id PK
        string name
        string email
        string password
        string storeName
        string phone
        string address
        boolean approved
        boolean blocked
        string role
        number totalSales
        date createdAt
    }
    BOOK {
        ObjectId id PK
        string title
        string author
        number price
        number originalPrice
        number stock
        string genre
        string language
        ObjectId seller FK
        string sellerName
        number rating
        number numReviews
        boolean featured
    }
    ORDER {
        ObjectId id PK
        ObjectId user FK
        number totalAmount
        string paymentMethod
        string paymentStatus
        string orderStatus
        date createdAt
    }
    ORDER_ITEM {
        ObjectId book FK
        string title
        number price
        number quantity
        ObjectId seller FK
    }
    REVIEW {
        ObjectId id PK
        ObjectId book FK
        ObjectId user FK
        string userName
        number rating
        string comment
        date createdAt
    }
    ADMIN {
        ObjectId id PK
        string name
        string email
        string password
        string role
    }
```

---

## 5. DETAILED MODULE DESCRIPTION

The application features modularity across three separate portals:

### 5.1 Reader / User Module
* **Catalogue Catalog:** A rich visual grid with pagination, text-based searching (matching title, author, or genre), and range filtering by price.
* **Thematic Illustrations:** Dynamically matches specific book categories (e.g., Fiction, Science, Technology) and assigns custom cover graphics.
* **Dynamic Cart:** Fully reactive pricing computations displaying subtotal, dynamic discount calculations (based on original vs sale prices), and total savings.
* **Checkout Engine:** Supports delivery details submission with options for Cash on Delivery (COD) or simulated Card validation.
* **Rating & Feedback Systems:** Integrates a star review submission component on individual product pages, feeding back live changes to compute the overall book average rating.

### 5.2 Seller Module
* **Store Registration System:** Intending sellers register their business name and description. Accounts remain locked in a pending queue until approved by an administrator.
* **Inventory Control panel:** Comprehensive CRUD forms to list books, input detailed descriptions, adjust price, record pages, isbn, and track available stock levels.
* **Shipping Controller:** Sellers track only the orders relevant to their inventory, changing delivery states sequentially (`Placed` ➔ `Confirmed` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`).
* **KPI Metric Cards:** Displays aggregated values of active listings, total units sold, and net store revenue.

### 5.3 Admin Module
* **Interactive SVG Analytics Dashboard:** Renders three high-performance vector charts:
  1. **Sales Revenue Trend:** Tracks the last 10 days of platform sales with hover-responsive bars and floating tooltips.
  2. **Genre Distribution:** A clean donut chart detailing book inventory categories with clickable slice expansions and legends.
  3. **Order Status Tracker:** A histogram tracking orders at various fulfillment stages.
* **Moderation Center:** Allows global actions including approving or blocking sellers, purging listings violating system policies, and deleting user accounts.

---

## 6. DATABASE SCHEMA DESIGN

The project maps entities to MongoDB using strict Mongoose Schema declarations.

### 6.1 User Schema (`User.js`)
Stores readers and buyer-specific configurations.
| Field Name | Data Type | Key Type | Validation / Default |
|---|---|---|---|
| `_id` | ObjectId | Primary Key | Auto-Generated |
| `name` | String | - | Required, Trimmed |
| `email` | String | Unique Index | Required, Lowercase |
| `password` | String | - | Required |
| `phone` | String | - | Default: `""` |
| `address` | String | - | Default: `""` |
| `role` | String | - | Default: `"user"` |
| `createdAt` | Date | - | Default: `Date.now` |

### 6.2 Book Schema (`Book.js`)
Represents individual book listings in the marketplace.
| Field Name | Data Type | Key Type | Validation / Default |
|---|---|---|---|
| `_id` | ObjectId | Primary Key | Auto-Generated |
| `title` | String | - | Required, Trimmed |
| `author` | String | - | Required, Trimmed |
| `description` | String | - | Default: `""` |
| `price` | Number | - | Required, Min: 0 |
| `originalPrice`| Number | - | Default: 0 |
| `stock` | Number | - | Required, Default: 0 |
| `genre` | String | - | Enum: Fiction, Science, Technology, etc. Default: `"Other"` |
| `language` | String | - | Default: `"English"` |
| `pages` | Number | - | Default: 0 |
| `isbn` | String | - | Default: `""` |
| `image` | String | - | Default: `""` |
| `seller` | ObjectId | Foreign Key (Sellers) | Required, Reference: `Seller` |
| `sellerName` | String | - | Default: `""` |
| `rating` | Number | - | Default: 0 |
| `numReviews` | Number | - | Default: 0 |
| `featured` | Boolean | - | Default: `false` |

### 6.3 Order Schema (`Order.js`)
Tracks reader purchases, transaction parameters, and shipment states.
| Field Name | Data Type | Key Type | Validation / Default |
|---|---|---|---|
| `_id` | ObjectId | Primary Key | Auto-Generated |
| `user` | ObjectId | Foreign Key (Users) | Required, Reference: `User` |
| `items` | Array | Embed Schema | Contains: `book`, `title`, `price`, `quantity`, `seller` |
| `totalAmount` | Number | - | Required |
| `shippingAddress`| Object | - | Contains: `street`, `city`, `state`, `zipCode`, `country` |
| `paymentMethod`| String | - | Default: `"COD"` |
| `paymentStatus`| String | - | Enum: `['Pending', 'Paid', 'Failed']`. Default: `"Pending"` |
| `orderStatus` | String | - | Enum: `['Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']`. Default: `"Placed"` |
| `createdAt` | Date | - | Default: `Date.now` |

---

## 7. SECURITY & IMPLEMENTATION FLOW

The application secures endpoints using stateless sessions and structured cryptographic checks.

```
[Client Login Request]
       │
       ▼
[Verify Credentials via bcrypt.compare()]
       │
 ┌─────┴───────────┐
Yes               No
 │                 │
 ▼                 ▼
[Generate JWT]  [Send 401 Unauthorized]
(Payload: id, role)
       │
       ▼
[Send JWT to Client UI] ──► (Saved in AuthContext / LocalStorage)
```

1. **Password Salting and Hashing:** Password fields in `User`, `Seller`, and `Admin` schemas utilize a Mongoose pre-save hook. Passwords are automatically salted and hashed via `bcrypt.hash()` with 12 rounds before database storage.
2. **Stateless JWT Transmission:** When a user logs in successfully, the backend sign-in controller generates a JSON Web Token encrypted with a strong backend key (`JWT_SECRET`). The client captures this token, saving it inside the global React Context memory (`AuthContext`).
3. **Role-Based Access Control (RBAC) Middleware:** API route groups are gated by authentication middlewares that verify signatures and block unauthorized access:
   - `protect`: Confirms the token is valid, extracting the payload configuration.
   - `authorize('seller')`: Intercepts the request and checks if the token role is registered as a merchant seller.
   - `authorize('admin')`: Restricts access to global metrics and user modification endpoints to system administrators.

---

## 8. API ENDPOINTS DIRECTORY

### 8.1 Authentication Endpoints (`/api/auth`)
* `POST /api/auth/user/signup` - Registers a standard buyer profile.
* `POST /api/auth/user/login` - Validates buyer credentials, returning a JWT token.
* `POST /api/auth/seller/signup` - Registers a new bookstore. (Requires admin approval before login activation).
* `POST /api/auth/seller/login` - Validates seller storefront credentials.
* `POST /api/auth/admin/login` - Validates system administrator access.

### 8.2 Inventory & Catalogue Endpoints (`/api/books`)
* `GET /api/books` - Public fetch for catalogue grids. Supports pagination parameters, keyword queries (`search`), and genre selection.
* `GET /api/books/:id` - Fetches detailed fields of a specific book.
* `POST /api/books` - Creates a book listing. **[Gated: Seller Role Required]**
* `PUT /api/books/:id` - Updates inventory details. **[Gated: Seller / Admin Role Required]**
* `DELETE /api/books/:id` - Deletes a listing. **[Gated: Seller / Admin Role Required]**

### 8.3 Order Management Endpoints (`/api/orders`)
* `POST /api/orders` - Processes cart details to create a transaction. **[Gated: Reader Role Required]**
* `GET /api/orders/my` - Returns order history list for the active buyer. **[Gated: Reader Role Required]**
* `GET /api/orders/seller` - Returns order lists corresponding only to items listed by the logged-in merchant. **[Gated: Seller Role Required]**
* `PUT /api/orders/:id/status` - Updates fulfillment states (`Processing` ➔ `Shipped` etc.). **[Gated: Seller Role Required]**
* `PUT /api/orders/:id/cancel` - Cancels an active purchase. **[Gated: Reader Role Required]**

---

## 9. SETUP & DEPLOYMENT INSTRUCTIONS

This section provides a step-by-step setup guide for instructors, examiners, or developers to deploy and run the system locally.

### 9.1 Prerequisites
Ensure the target device has the following applications installed:
* **Node.js** (v18.0.0 or higher)
* **MongoDB Community Server** (running locally on port `27017`) or a remote **MongoDB Atlas** Connection String.

### 9.2 Step 1: Configuring Backend Environment
1. Extract the project codebase and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Run npm package installation:
   ```bash
   npm install
   ```
3. Create a configuration file named `.env` in the root of the `/backend` folder:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/bookstore
   JWT_SECRET=bookstore_super_secret_jwt_key_2026
   NODE_ENV=development
   ```

### 9.3 Step 2: Database Seeding
To populate mock catalog records, seller entities, and transaction history for verification, run the database seeder:
```bash
node seed.js
```
*Note: This injects 120 books containing cover categories, constructs active profiles, and populates mock historical purchases to demonstrate the interactive admin SVG charts immediately.*

### 9.4 Step 3: Starting Backend Server
Run the startup script:
```bash
npm run dev
```
The server will bind and start listening for API connections on `http://localhost:5000`.

### 9.5 Step 4: Configuring Frontend Client
1. Open a new command prompt and navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```
3. Start the Vite client application:
   ```bash
   npm run dev
   ```
4. Access the web interface in your browser at `http://localhost:5173`.

### 9.6 Seeded Test Accounts
Use these pre-populated profiles to evaluate different roles after database seeding:
* **Reader Access:** Email: `user@bookstore.com` | Password: `user123`
* **Seller Access:** Email: `kishore@books.com` | Password: `seller123`
* **Admin Access:** Email: `admin@bookstore.com` | Password: `admin123`

---

## 10. TESTING & VERIFICATION PLAN

### 10.1 Unit Testing (API Endpoints)
The system was verified using API test sweeps across different roles:
* **Test Case UT-1 (Authentication Guard):** Sending an unauthenticated `POST` request to `/api/books` returns `401 Unauthorized` with an error message.
* **Test Case UT-2 (Authorization Verification):** Sending a `POST` request to `/api/books` with a Reader's JWT token returns `403 Forbidden`, confirming the role validation middleware works.
* **Test Case UT-3 (Book Listing CRUD):** Sending a valid Seller JWT token to `/api/books` with book metadata yields `21 Created` and adds the document to MongoDB.

### 10.2 Integration & Flow Testing
* **End-to-End Purchase Flow:** Verified the entire checkout flow: adding a book to the cart, processing payment, decrementing book inventory stock (`stock` key reduced from 10 to 9), and creating a seller-facing order.
* **Live Review Aggregation:** Verified that posting reviews recalculates the target book’s average score. Review 1 (score 5) and Review 2 (score 3) update the book rating to `4.0` in real-time.

### 10.3 Manual Interface Walkthrough
* **Dashboard Rendering:** Admin login redirects to the dashboard, rendering charts using custom HTML `<svg>` vectors. Tooltips display correct data values on hover.
* **Responsive Visual Checks:** Checked viewport resizing using Chrome Developer tools. Glassmorphic cards adapt to mobile widths, folding multi-column catalog grids into single-column layouts cleanly.

---

## 11. CONCLUSION & FUTURE SCOPE

### 11.1 Conclusion
The **Premium Online Book Marketplace** has been successfully designed, implemented, and tested. The system meets all requirements of the SRS. The MERN stack architecture provides high performance, while custom CSS layouts deliver a polished user experience.

By implementing separate portals for Readers, Sellers, and Admins, the platform serves as a complete multi-sided marketplace. The lightweight SVG charts demonstrate that interactive analytics can be built without heavy external libraries.

### 11.2 Future Enhancements
* **Payment Gateway Integration:** Upgrade the simulated checkout flow with a live Stripe or Razorpay API checkout.
* **Real-time Chat Portal:** Build a messaging hub using Socket.io to allow readers to communicate directly with book sellers.
* **AI-Based Book Recommendations:** Implement a Collaborative Filtering algorithm to recommend books based on user purchase histories and review ratings.

---

## 📚 REFERENCES / BIBLIOGRAPHY

1. **MongoDB Documentation:** Official schemas design guide (https://docs.mongodb.com)
2. **Express.js Routing Guide:** Rest API structure and handling (https://expressjs.com)
3. **React.js Documentation:** State Hooks, Context API, and component lifestyle (https://react.dev)
4. **JSON Web Token RFC 7519:** Standards on stateless claims exchange (https://jwt.io)
5. **MDN Web Docs:** SVG elements, CSS Glassmorphic attributes, and modern styling (https://developer.mozilla.org)
6. **MERN Stack E-Commerce Practices:** Patterson, J., "Modern Web Applications with MERN", TechPress, 2024.

---
*(End of Report. Please update student credentials, roll numbers, and guide details on page 1 before final print/export.)*
