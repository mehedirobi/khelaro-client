# Khelaro

Khelaro is a turf booking web application that helps players discover sports venues, book a playing slot, and manage reservations. It also provides separate dashboards for turf owners and administrators.

This repository contains the **client-side application**. Authentication is provided by Firebase, and booking and management data are served by a separately configured API backend.

## Features

- Browse turf listings and view venue details, amenities, and availability.
- Register and sign in with email and password.
- Follow a booking flow with booking confirmation, payment method selection, and a success page.
- View bookings, save turfs to a wishlist, and manage a customer profile.
- Give turf owners tools to manage their turfs, bookings, profile, and revenue.
- Give administrators tools to manage users, owners, turfs, bookings, and revenue.
- Restrict customer, owner, and admin dashboard routes by account role.
- Provide loading, empty, and error states for data-driven views.

## Tech stack

- React 19
- Vite 8
- React Router
- Firebase Authentication
- Tailwind CSS 4 and DaisyUI
- TanStack Query, Axios, and Fetch for API/data workflows
- Recharts for dashboard visualizations

## Requirements

- Node.js (a current LTS release is recommended)
- npm
- A Firebase project with Email/Password Authentication enabled
- The Khelaro API backend, running locally or deployed

## Getting started

1. Clone the repository and enter the project directory:

   ```bash
   git clone <repository-url>
   cd khelaro-client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and set the Firebase and API configuration:

   ```dotenv
   VITE_API_URL=http://localhost:3000
   VITE_FIREBASE_API_KEY=your-firebase-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

   Replace the example values with your Firebase project's web app configuration. `VITE_API_URL` should point to the API backend; the client defaults to `http://localhost:3000` in most API workflows.

4. Start the development server:

   ```bash
   npm run dev
   ```

   Open the local URL printed by Vite in your browser.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Build the production client in `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint across the project. |

## Application areas

| Area | Main capabilities |
| --- | --- |
| Public site | Home, turf discovery and details, about, and contact pages. |
| Customer | Booking flow, booking history and details, wishlist, and profile. |
| Turf owner | Overview, add and manage turfs, customer bookings, revenue, and profile. |
| Administrator | Overview and management pages for users, owners, turfs, bookings, revenue, and profile. |

Dashboard access depends on the user's role in the application. Create or assign test accounts and roles through the configured Firebase/API setup.

## Project structure

```text
src/
├── components/   # Public-site UI and shared components
├── contexts/     # Authentication context and user state
├── dashboard/    # Customer, owner, and admin dashboard pages
├── data/         # Local sample turf data
├── firebase/     # Firebase client configuration
├── hooks/        # Shared React hooks
├── layouts/      # Public and dashboard layouts
├── pages/        # Public, authentication, and booking pages
└── routes/       # Route definitions and role guards
```

## Backend and configuration notes

- The backend is not included in this repository. Start it separately and set `VITE_API_URL` to its base URL.
- User profile and application data rely on API endpoints; Firebase configuration alone does not provide booking or dashboard data.
- Vite exposes variables prefixed with `VITE_` to client-side code. Do not put private credentials or server-side secrets in these variables.
- The `.env` file is ignored by Git. Use your deployment platform's environment-variable settings for production.

## Production build

Run `npm run build` to create the production assets in `dist/`. Configure the hosting provider to serve the built files and support single-page application route fallback so client-side routes continue to work after refresh.
