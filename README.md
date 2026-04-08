# Real Estate Platform

Production-ready MERN starter for a real estate marketplace with:

- `client`: public website for browsing listings and submitting inquiries
- `adminpanel`: admin dashboard for analytics, listings, inquiries, and users
- `backend`: Express + MongoDB API with JWT auth, refresh tokens, and admin endpoints

## Setup

1. Copy each `.env.example` to `.env`
2. Install dependencies in `backend`, `client`, and `adminpanel`
3. Start MongoDB locally
4. Seed the backend with `npm run seed` inside `backend`
5. Run:
   - `backend`: `npm run dev`
   - `client`: `npm run dev`
   - `adminpanel`: `npm run dev -- --port 5174`

## Seed Admin

- Email: `admin@estate.com`
- Password: `Admin@123`

## 12. API Design

The backend follows a REST-style resource structure with a shared `/api` base path.

Base URL: `http://localhost:5000/api`

### `/api/auth`

- `POST /register` creates a new user account
- `POST /login` authenticates a user and issues tokens
- `POST /forgot-password` starts the password reset flow
- `POST /reset-password/:token` completes password reset
- `POST /refresh` refreshes the access token
- `POST /logout` clears the active session
- `GET /me` returns the authenticated user's profile

### `/api/properties`

- `GET /` lists properties with filters/query support
- `GET /featured` returns featured listings
- `GET /filters` returns filter metadata for the client UI
- `GET /stats` returns aggregate property statistics
- `GET /admin/all` returns admin/agent property management data
- `GET /:slug` returns a single property by slug
- `GET /:slug/similar` returns related properties
- `POST /` creates a new property
- `PUT /:id` updates an existing property
- `PATCH /:id/approval` updates approval status
- `DELETE /:id` deletes a property

### `/api/users`

- `GET /` returns the user list for admin management
- `POST /` creates a user from the admin panel
- `PATCH /:id` updates a user record

### `/api/agents`

- `GET /` returns all agent accounts for admin workflows

### `/api/payments`

- `GET /plans` lists subscription or listing plans
- `POST /plans` creates a new plan
- `PATCH /plans/:id` updates a plan
- `GET /logs` returns payment logs
- `POST /logs` records a payment event

### `/api/messages`

- `POST /` creates a new inquiry/message from the public site
- `GET /` returns messages for admin and agent dashboards
- `PATCH /:id/status` updates message status

### Supporting endpoints

- `GET /api/health` checks backend availability
- `GET /uploads/*` serves uploaded media assets

## 13. Responsiveness

The frontend experience is designed with a mobile-first approach across the public client and admin panel.

- Mobile-first design keeps core navigation, forms, and property browsing usable on small screens first
- Tablet optimization improves spacing, card density, and layout balance for medium-width devices
- Sidebar collapse on mobile prevents the admin dashboard navigation from consuming the full viewport on smaller devices
- Grid to single-column behavior ensures property cards, dashboard widgets, and content sections stack vertically on narrow screens

## 14. Bonus Features

The platform can be extended with additional user-experience and performance enhancements.

- Wishlist support allows signed-in users to save favorite properties for later review
- Property comparison helps users evaluate multiple listings side by side
- SEO optimization improves discoverability with metadata, semantic markup, and search-friendly property pages
- Lazy loading images reduces initial page weight and improves perceived performance
- Caching with Redis as an optional layer can speed up frequently requested data such as featured listings, filters, and stats
