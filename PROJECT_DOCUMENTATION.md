# Real Estate Platform - Production Documentation

## 1. Project Overview

The Real Estate Platform is a comprehensive, production-ready full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It serves as a real estate marketplace and is divided into three primary components:

1. **Client (`/client`)**: The public-facing website where end-users can browse property listings, view property details, and submit inquiries.
2. **Admin Panel (`/adminpanel`)**: A restricted dashboard for administrators and agents to manage properties, view analytics, handle user inquiries, and manage users.
3. **Backend (`/backend`)**: A robust RESTful API built with Express.js and MongoDB that powers both the Client and the Admin Panel. It includes features like JWT authentication, role-based access control, and image uploads.

---

## 2. Architecture & Tech Stack

### Core Technologies (MERN)
- **Database**: MongoDB (managed via Mongoose ODM)
- **Backend Framework**: Express.js (Node.js environment)
- **Frontend Framework**: React.js (built with Vite for fast HMR and optimized builds)

### Backend Tech Stack (`/backend`)
- **Server**: Node.js & Express.js (`^5.1.0`)
- **Database**: MongoDB (`mongoose ^8.19.2`)
- **Authentication**: JSON Web Tokens (`jsonwebtoken ^9.0.2`), bcryptjs (`^2.4.3`) for password hashing.
- **Media Storage**: Cloudinary (`^2.5.1`) with Multer (`^2.0.2`) for local/cloud file uploads.
- **Security & Middleware**: `cors`, `cookie-parser`, `dotenv`, and logging with `morgan`.

### Frontend - Client (`/client`)
- **Build Tool**: Vite (`^8.0.4`)
- **UI Library**: React (`^19.2.4`)
- **Routing**: React Router DOM (`^7.9.4`)
- **Styling**: Tailwind CSS (`v4.1.12`) with mobile-first responsive design.
- **Icons**: Lucide React (`^0.542.0`)
- **HTTP Client**: Axios (`^1.12.2`)

### Frontend - Admin Panel (`/adminpanel`)
- **Build Tool**: Vite (`^8.0.4`)
- **UI Library**: React (`^19.2.4`)
- **Routing**: React Router DOM (`^7.9.4`)
- **Styling**: Tailwind CSS (`v4.1.12`)
- **Data Visualization**: Recharts (`^3.2.1`) for analytics dashboards.
- **Icons**: Lucide React (`^0.542.0`)
- **HTTP Client**: Axios (`^1.12.2`)

---

## 3. Project Structure

The repository is structured as a monorepo containing three distinct projects.

### Root Directory
```text
/REAL_ESTATE
├── adminpanel/   # React Admin Dashboard
├── backend/      # Node/Express REST API
├── client/       # React Public Website
└── README.md     # Quick start guide
```

### Backend Structure (`/backend/src`)
- `config/`: Configuration files (Database connections, external APIs).
- `controllers/`: Request handlers and business logic.
- `models/`: Mongoose schemas and database models.
- `routes/`: Express route definitions.
- `middleware/`: Custom middleware (Auth guards, error handling, upload interceptors).
- `services/`: Reusable business logic and external integrations (e.g., Cloudinary).
- `utils/`: Helper functions and utilities.
- `data/`: Seed scripts and mock data.
- `app.js` & `server.js`: Express app setup and server entry point.

### Frontend Structure (`/client/src` & `/adminpanel/src`)
- `api/`: API client configurations and endpoint functions.
- `assets/`: Static assets (images, logos).
- `components/`: Reusable UI components (Buttons, Cards, Navbars).
- `context/`: React Context providers for state management (Auth, Theme).
- `hooks/`: Custom React hooks.
- `layouts/`: Page layout wrappers (e.g., MainLayout, DashboardLayout).
- `pages/`: Route-level page components.
- `routes/`: Application routing configuration.
- `services/`: Client-side business logic.
- `utils/`: Formatting and helper utilities.

---

## 4. Setup and Installation

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local instance or Atlas Cluster)
- Cloudinary Account (for media uploads)

### Installation Steps

1. **Clone & Setup Environment Variables**
   Navigate to each directory (`backend`, `client`, `adminpanel`) and copy the `.env.example` file to `.env`. Fill in the required values (Database URI, Cloudinary credentials, JWT secrets).

2. **Install Dependencies**
   Run the following command inside each of the three directories:
   ```bash
   npm install
   ```

3. **Database Seeding**
   To populate the database with initial admin credentials and test properties, run the following inside the `/backend` directory:
   ```bash
   npm run seed
   ```
   **Default Admin Credentials:**
   - Email: `admin@estate.com`
   - Password: `Admin@123`

4. **Start Development Servers**
   Open three terminal instances and start the respective servers:
   - **Backend**: `npm run dev` (Runs on `http://localhost:5000`)
   - **Client**: `npm run dev` (Runs on Vite default port)
   - **Admin Panel**: `npm run dev -- --port 5174` (Runs on port 5174)

---

## 5. API Design & Routes

The backend follows RESTful principles with the base URL: `http://localhost:5000/api`

### Authentication (`/api/auth`)
- `POST /register`: Create a new account.
- `POST /login`: Authenticate and receive JWT tokens.
- `POST /refresh`: Refresh access token.
- `GET /me`: Get authenticated user profile.
- `POST /logout`: Clear session.

### Properties (`/api/properties`)
- `GET /`: List properties (supports pagination, filtering, searching).
- `GET /featured`: Retrieve featured properties.
- `GET /:slug`: Get property details.
- `POST /`: Create property (Admin/Agent).
- `PUT /:id`: Update property.
- `DELETE /:id`: Delete property.

### Users & Agents (`/api/users`, `/api/agents`)
- `GET /`: Retrieve lists of users/agents (Admin only).
- `PATCH /:id`: Update roles or block status.

### Messages/Inquiries (`/api/messages`)
- `POST /`: Submit an inquiry (Client).
- `GET /`: View messages (Admin).

---

## 6. Key Features & Best Practices

- **Security**: Passwords are cryptographically hashed using `bcryptjs`. Authentication uses secure JWT strategies. The API endpoints are protected by Role-Based Access Control (RBAC) middleware.
- **Responsiveness**: The frontend (both Client and Admin) uses a Mobile-First approach utilizing Tailwind CSS, ensuring grid-to-single-column behavior on smaller devices.
- **Media Management**: Instead of storing images locally, the platform integrates with Cloudinary for efficient, optimized image delivery and transformation.
- **Code Linting**: Both frontend projects utilize ESLint configurations specifically tailored for React hooks and modern JS to enforce code quality.
- **Modular Routing**: The React Router v7+ is used for clean, declarative, and nested routing in the frontends.

---

*Generated for Real Estate Platform maintainers and developers.*
