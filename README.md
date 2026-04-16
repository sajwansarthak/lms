# LMS Project

A full‑stack Learning Management System (LMS) with a React (Vite) client and an Express + MongoDB server. Authentication and user management are powered by Clerk, media uploads by Cloudinary, and payments by Stripe.

## Tech Stack

### Client (`/client`)
- **React** (with **Vite**)
- **React Router**
- **Tailwind CSS**
- **Clerk** (`@clerk/clerk-react`) for auth/session
- **Axios** for API calls
- **React Toastify** for notifications

### Server (`/server`)
- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **Clerk** (`@clerk/express`) for auth middleware + backend SDK
- **Stripe** for payments
- **Cloudinary** for media hosting
- **Multer** for file uploads
- **Svix** for Clerk webhooks verification
- **Nodemon** for local dev

## Repository Structure

```text
.
├─ client/                 # React (Vite) frontend
└─ server/                 # Express backend
```

## Features (high level)

- **Authentication**: Sign in/sign up via Clerk
- **Role support**: Educator vs Student (role stored in Clerk public metadata)
- **Courses**: Browse and enroll (backend APIs under `/api/course`)
- **Educator flows**: Create/manage courses, educator dashboard (backend APIs under `/api/educator`)
- **Payments**: Purchase courses via Stripe Checkout
- **User data sync**: Clerk users are mirrored in MongoDB (via Clerk webhooks + on-demand sync in APIs)

## Prerequisites

- **Node.js 20.9+** (recommended: latest LTS)
- **MongoDB** (Atlas or local)
- A **Clerk** application (Publishable Key + Secret Key)
- **Cloudinary** account (for uploads)
- **Stripe** account (for payments + webhook secret)

## Environment Variables

Create `.env` files in both `client/` and `server/`.

### `client/.env`

```bash
# Clerk
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Backend
VITE_BACKEND_URL=http://localhost:3000

# App
VITE_CURRENCY=USD
```

### `server/.env`

```bash
# Server
PORT=3000

# MongoDB
MONGODB_URI=mongodb+srv://...

# Clerk
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Stripe
STRIPE_SECRET_KEY=sk_test_...

# App
CURRENCY=USD

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

> Note: Some variable names may differ slightly depending on your `server/configs/*.js` implementation. If the server logs complain about missing config, align the env var names accordingly.

## Install & Run (Local)

### 1) Install dependencies

```bash
cd client && npm install
cd ../server && npm install
```

### 2) Start the backend

```bash
cd server
npm run server
```

Server runs on `http://localhost:3000` by default.

### 3) Start the frontend

```bash
cd client
npm run dev
```

Vite will print the local URL (commonly `http://localhost:5173`).

## Useful Scripts

### Client (`client/package.json`)
- **`npm run dev`**: Start Vite dev server
- **`npm run build`**: Production build
- **`npm run preview`**: Preview production build
- **`npm run lint`**: Run ESLint

### Server (`server/package.json`)
- **`npm run server`**: Start API with nodemon
- **`npm start`**: Start API with node

## Deployment (Vercel)

This project is deployed on **Vercel**.

### Live URLs

- **Frontend**: `https://lms-frontend-git-main-sajwansarthaks-projects.vercel.app`

### Frontend (Vite)

- **Build command**: `npm run build`
- **Output**: `dist`
- **Environment variables (Vercel → Project → Settings → Environment Variables)**:
  - `VITE_CLERK_PUBLISHABLE_KEY`
  - `VITE_BACKEND_URL` (your deployed API base URL, e.g. `https://<your-backend>.vercel.app`)
  - `VITE_CURRENCY`

### Backend (Express as Serverless)

The Express app is exported from `server/server.js` and will run as a serverless function on Vercel.

- **Environment variables (Vercel)**:
  - `MONGODB_URI`
  - `CLERK_SECRET_KEY`
  - `CLERK_WEBHOOK_SECRET`
  - `STRIPE_SECRET_KEY`
  - `CURRENCY`
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`

> Tip: In production you usually don’t need to set `PORT` on Vercel.

## Webhooks (Clerk)

The backend exposes a Clerk webhook endpoint:

- **POST** `'/clerk'`

In the Clerk Dashboard, create a webhook and point it to:
- Local dev: use a tunneling tool (e.g. ngrok) and set the public URL + `/clerk`
- Production (Vercel): your deployed API URL + `/clerk`

Make sure `CLERK_WEBHOOK_SECRET` matches the webhook signing secret from Clerk.

## Payments (Stripe)

The backend exposes a Stripe webhook endpoint:

- **POST** `'/stripe'`

Configure the endpoint in Stripe and set the webhook secret as needed by your implementation.

## Common Troubleshooting

- **“User not found” after login**
  - Your MongoDB `users` collection must use the **Clerk user id** (e.g. `user_...`) as `_id`.
  - Users are typically created via Clerk `user.created` webhook. In local dev, ensure the webhook is reachable (tunnel) or rely on the server’s on-demand sync.

- **CORS / API URL issues**
  - Ensure `VITE_BACKEND_URL` points to your running server.
  - Ensure the server is running and accessible from the browser.

