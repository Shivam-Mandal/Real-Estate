# 🏡 Real Estate Platform

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React_19-cyan?style=for-the-badge&logo=react)
![Node](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-success?style=for-the-badge&logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css)

A production-ready full-stack real estate marketplace built with the MERN stack. This monorepo includes a public client application, an administrative dashboard, and a secure RESTful backend API.

For detailed architecture, tech stack breakdowns, and deeper documentation, please see the [**Project Documentation**](./PROJECT_DOCUMENTATION.md).

---

## 📋 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Quick Start Setup](#-quick-start-setup)
- [Default Admin Credentials](#-default-admin-credentials)
- [API Overview](#-api-overview)
- [Future Enhancements](#-future-enhancements)

---

## ✨ Features

- **Three-Tier Architecture**: Divided into `client`, `adminpanel`, and `backend`.
- **Authentication & Security**: JWT-based auth with refresh tokens, password hashing via bcrypt.
- **Media Management**: Scalable image uploading managed via Cloudinary.
- **Responsive UI**: Mobile-first design across all views ensuring grid-to-single-column behavior on smaller screens.
- **Analytics Dashboard**: `adminpanel` includes interactive charts and insights using Recharts.

---

## 🏗 Project Structure

- **`/client`**: The public-facing React application for browsing listings, viewing property details, and submitting inquiries.
- **`/adminpanel`**: A secure React dashboard for administrators to manage properties, view analytics, handle inquiries, and control users.
- **`/backend`**: The Node.js/Express API with MongoDB, handling auth, user roles, data persistence, and media storage integration.

---

## 🚀 Quick Start Setup

### 1. Environment Configuration
Copy each `.env.example` to `.env` in all three directories (`backend`, `client`, and `adminpanel`), and provide your MongoDB URI, Cloudinary credentials, and JWT secrets.

### 2. Install Dependencies
Run `npm install` inside each of the three directories:
```bash
cd backend && npm install
cd ../client && npm install
cd ../adminpanel && npm install
```

### 3. Database Initialization
Ensure your MongoDB server is running. Then, seed the database with initial users and test data from inside the `backend` directory:
```bash
npm run seed
```

### 4. Run Development Servers
Open three separate terminal windows and start the applications:

**Backend** (Runs on port `5000`):
```bash
cd backend
npm run dev
```

**Client** (Runs on Vite's default port):
```bash
cd client
npm run dev
```

**Admin Panel** (Runs on port `5174`):
```bash
cd adminpanel
npm run dev -- --port 5174
```

---

## 🔑 Default Admin Credentials

After running the seed script, you can log into the `/adminpanel` with the following credentials:
- **Email**: `admin@estate.com`
- **Password**: `Admin@123`

---

## 📡 API Overview

The backend uses a standard RESTful structure with a shared `/api` base path (`http://localhost:5000/api`).

- **`/api/auth`**: Registration, login, password reset, refresh token management, and session clears.
- **`/api/properties`**: CRUD operations for property listings, filtering, stats generation, and admin management.
- **`/api/users` & `/api/agents`**: User account and agent profile management.
- **`/api/payments`**: Plan subscription management and payment logging.
- **`/api/messages`**: Inquiry submissions and status tracking.

*(For full endpoint details, please refer to the backend source code or the swagger docs if implemented).*

---

## 🔮 Future Enhancements (Bonus Features)

The platform is built to scale and can be extended with:
- **Wishlist Support**: Allowing signed-in users to save favorite properties.
- **Property Comparison**: Side-by-side evaluation of listings.
- **Advanced SEO**: Metadata management and semantic markup optimization for property pages.
- **Caching Layer**: Redis integration to speed up frequent queries (featured listings, UI filters).
- **Lazy Loading**: Continued performance improvements via advanced asset loading techniques.
