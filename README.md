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
