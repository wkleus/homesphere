# HomeSphere – Real Estate App

![React](https://img.shields.io/badge/React-19.0+-61DAFB?logo=react&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.0+-CA4245?logo=reactrouter&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.0+-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?logo=postgresql&logoColor=white)
![Resend](https://img.shields.io/badge/Email-Resend-orange?logo=mail.ru&logoColor=white)
![Render](https://img.shields.io/badge/API-Render.com-46E3B7?logo=render&logoColor=white)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-orange?logo=vercel)
![i18n](https://img.shields.io/badge/i18n-EN%20%7C%20DE%20-blue)
![Supabase Auth](https://img.shields.io/badge/Supabase%20Auth-Enabled-3ECF8E?logo=supabase&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)
![bcrypt](https://img.shields.io/badge/Security-bcrypt-00599C?logo=lock&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen?logo=vitest)
![Status](https://img.shields.io/badge/Status-In_Progress-yellow)

🔗 [Live Demo](https://homesphere-web.vercel.app)

HomeSphere is a full-stack real estate platform for property seekers and administrators. Browse listings across Europe, filter by category and deal type, save favorites, and contact agents via email. Admins can manage the entire property catalog through a protected dashboard.

**Tech Stack:** React frontend with a Node.js/Express REST API, PostgreSQL on Supabase, Resend for emails, and react‑i18next for multilingual support (EN/DE).

Built with **security**, **performance**, and **user experience** in mind – featuring JWT authentication, server-side password hashing, lazy loading, and a fully responsive design.

---

## Screenshots

<table>
  <tr>
    <td align="center">
      <img src="client/public/screenshots/home.png" alt="Home" height="320" />
      <br><em>Home – Navbar with contact info and hero heading</em>
    </td>
    <td align="center">
      <img src="client/public/screenshots/main.png" alt="Main" height="340" />
      <br><em>Main – Property listings with category and deal type filters</em>
    </td>
  </tr>

  <tr>
    <td align="center">
      <img src="client/public/screenshots/footer.png" alt="Footer" height=280" />
      <br><em>Footer – Opening hours and contact details</em>
    </td>
    <td align="center">
      <img src="client/public/screenshots/details.png" alt="Property Detail" height="360" />
      <br><em>Detail Page – Full property info with stats and pricing</em>
    </td>
  </tr>

  <tr>
    <td align="center">
      <img src="client/public/screenshots/contact-form.png" alt="Contact Form" height="300" />
      <br><em>Contact Form</em>
    </td>
    <td align="center">
      <img src="client/public/screenshots/favorites-page.png" alt="Favorites Page" height="360" />
      <br><em>Favorites Page</em>
    </td>
  </tr>

  <tr>
    <td align="center">
      <img src="client/public/screenshots/calculator.png" alt="Mortgage Calculator" height="300" />
      <br><em>Mortgage Calculator</em>
    </td>
    <td align="center">
      <img src="client/public/screenshots/contact-page.png" alt="Contact Page" height="300"  />
      <br><em>Contact Page</em>
    </td>
  </tr>

  <tr>
    <td align="center">
      <img src="client/public/screenshots/login-page.png" alt="Login Page" height="320" />
      <br><em>Login Page</em>
    </td>
    <td align="center">
      <img src="client/public/screenshots/admin-dashboard-page_in-progress.png" alt="Admin Dashboard Page" height="320" />
      <br><em>Admin Dashbaord - still in progress</em>
    </td>
  </tr>
</table>

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API](#api)
- [Authentication](#authentication)
- [Deployment](#deployment)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [Available Scripts](#available-scripts)
- [Roadmap](#roadmap)

---

## Features

### Property Management

- Property listings fetched from PostgreSQL database via REST API
- Filter by category (Apartment, Chalet, Residence, Studio, Townhouse)
- Filter by deal type (Rent / Buy)
- Detail page with full property info, stats, and interactive map
- Mortgage calculator on property detail pages

### Authentication & Security

- Secure authentication with JWT tokens and server-side password hashing (bcrypt)
- Protected admin routes with role-based access
- Environment-based configuration for dev/prod

### User Experience & User Interface (UX/UI)

- Responsive layout for mobile, tablet, and desktop
- Modern UI with Phosphor and Lucide icons for clean, professional visuals
- Smooth animations with Framer Motion for page transitions and interactions
- Loading and error states for all API calls
- Multi-language support (EN/DE) with react-i18next
- Favorites system with localStorage persistence

### Performance

- Optimised images with lazy loading and WebP support
- Custom `useFetch` hook for efficient data fetching
- Memoized components to prevent unnecessary re-renders

### Developer Experience

- Modular component structure for easy maintenance
- Centralised API configuration
- Testing with Vitest + React Testing Library + Supertest
- Separate deployments (Vercel for frontend, Render for API)

---

## Tech Stack

|              | Tool                           | Version |
| ------------ | ------------------------------ | ------- |
| **Frontend** | React                          | 19      |
|              | React Router DOM               | 7       |
|              | Phosphor Icons                 | 1       |
|              | Lucide Icons                   | 1       |
|              | Yup                            | 1       |
|              | Vite                           | 8       |
|              | CSS Custom Properties          |         |
|              | react-i18next                  | 15      |
|              | Leaflet + react-leaflet        | 1 / 4   |
|              | Vitest + React Testing Library | 4 / 16  |
|              | Framer Motion                  | 12      |
| **Backend**  | Node.js                        |         |
|              | Express                        | 4       |
|              | CORS                           | 2       |
|              | pg (node-postgres)             | 8       |
|              | dotenv                         | 17      |
|              | express-rate-limit             | 7       |
|              | he(XSS sanitization)           | 1       |
|              | Resend                         | 6       |
|              | Vitest + Supertest             | 4 / 7   |
|              | bcrypt                         | 6       |
|              | jsonwebtoken                   | 9       |
| **Database** | PostgreSQL via Supabase        |         |
| **Hosting**  | Vercel (Frontend)              |         |
|              | Render (Backend API)           |         |
|              | Supabase (Database)            |         |
| **Auth**     | JWT (JSON Web Tokens)          |         |
|              | bcrypt (password hashing)      |         |
| **Email**    | Resend                         |         |
| **Testing**  | Vitest                         |         |
|              | React Testing Library          |         |
|              | Supertest                      |         |

---

## Project Structure

```
homesphere/
├── client/                                 # React Frontend
│   ├── public/
│   │   ├── favicons/
│   │   ├── photos/                         # Property images
│   │   └── screenshots/                    # README screenshots
│   ├── src/
│   │    ├── App.jsx
│   │    ├── App.css
│   │    ├── main.jsx
│   │    ├── index.html
│   │    ├── config/
│   │    │   ├── supabase.js                # Supabase configuration
│   │    │   └── api.js                     # Central API URL config (dev/prod)
│   │    ├── context/
│   │    │   ├── AuthContext.js             # Context object for auth state
│   │    │   ├── AuthProvider.jsx           # Provides auth state to entire app
│   │    │   ├── useAuth.js                 # Custom hook for consuming auth context
│   │    │   └── FavoritesContext.jsx       # Global favorites state with localStorage
│   │    ├── i18n/                          # i18next configuration
│   │    │   └── locales/
│   │    │        ├── en/translation.json
│   │    │        └── de/translation.json
│   │    ├── hooks/
│   │    │   └── useFetch.js                # Custom fetch hook
│   │    ├── __tests__/
│   │    │   ├── setup.js                   # Test environment setup
│   │    │   ├── useFetch.test.js           # Tests for useFetch hook
│   │    │   └── FavoritesContext.test.jsx  # Tests for FavoritesContext
│   │    ├── components/
│   │    │   ├── Navbar/
│   │    │   ├── Heading/
│   │    │   ├── Footer/
│   │    │   ├── Loadingspinner/            # Spinner for loading time
│   │    │   ├── MapModal/                  # Leaflet map modal with Nominatim
│   │    │   ├── ContactForm/               # Multi-step modal with Yup validation
│   │    │   ├── MortgageCalculator/        # Monthly payment calculator with useMemo
│   │    │   ├── ProtectedRoute/            # Protect routes from unauthorized access
│   │    │   └── Main/
│   │    │       ├── RealEstate.jsx         # Filter logic + listings
│   │    │       └── RealEstateCard/
│   │    │           ├── RealEstateDetails/
│   │    │           └── RealEstatePhoto/
│   │    │               ├── RealEstateCategory/
│   │    │               ├── RealEstateStatus/
│   │    │               └── IconItem/
│   │    └── pages/
│   │        ├── EstateDetails/             # Detail page with map, mortgage calculator
│   │        ├── Contact/                   # Company contact info page
│   │        ├── Login/                     # Login page for user authentication
│   │        ├── Admin/                     # Admin dashboard providing CRUD operations
│   │        └── Favorites/                 # Saved properties page
│   └── package.json
└── server/                                 # Node.js / Express Backend
    ├── db.js                               # PostgreSQL connection pool
    ├── server.js                           # Express server & routes
    ├── server.start.js                     # Entry point – starts the Express server
    ├── server.test.js                      # Backend integration tests (Supertest)
    ├── vitest.connfig.js                   # Vitest config for server
    ├── schema.sql                          # Database table definition
    ├── seed.sql                            # Initial data (entries)
    ├── .env
    └── package.json
```

---

## API

The backend is a custom Node.js/Express REST API connected to a PostgreSQL database on Supabase, deployed on [Render.com](https://render.com):

### Public Endpoints:

```
GET  https://homesphere-kifc.onrender.com/api/entries
GET  https://homesphere-kifc.onrender.com/api/entries/:id
POST https://homesphere-kifc.onrender.com/api/contact
POST https://homesphere-kifc.onrender.com/api/login
```

---

## Authentication

The application uses a secure JWT-based authentication system:

1. **Login**: User credentials are sent to `/api/login`
2. **Password Hashing**: Passwords are hashed server-side using bcrypt
3. **JWT Generation**: On successful login, a JWT token is generated using `JWT_SECRET`
4. **Protected Routes**: Admin routes require a valid JWT in the Authorization header
5. **Session**: Token is stored client-side and sent with each protected request

---

## Deployment

### Frontend (Vercel)

- Automatic deployments on push to main branch
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

### Backend (Render)

- Manual or automatic deployments from GitHub
- Environment variables: `DATABASE_URL`, `RESEND_API_KEY`, `CONTACT_EMAIL`, `JWT_SECRET`
- Rate limiting: 3 requests/10min for contact endpoint

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/wkleus/homesphere.git
cd homesphere
```

### 2. Set up the database

Create a PostgreSQL database (e.g. on [Supabase](https://supabase.com)) and run the following SQL files in order:

```
server/schema.sql   ← creates the entries table
server/seed.sql     ← inserts all entries
```

### 3. Configure environment variables

Create `.env` files for both backend and frontend. Use the following templates:

#### Create `server/.env`:

```
# Server port (Render sets this automatically in production)
PORT=3000

# PostgreSQL connection string (Supabase)
DATABASE_URL=your_postgresql_connection_string

# Resend API key for email sending
RESEND_API_KEY=your_resend_api_key

# Email address that receives contact form submissions
CONTACT_EMAIL=your@email.com

# JWT Secret for authentication tokens (generate with: openssl rand -hex 32)
JWT_SECRET=your_generated_jwt_secret
```

#### Create `client/.env`:

```
# Supabase configuration (for authentication)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **⚠️ Security Note:** Never commit `.env` files to Git. Both files are already excluded via `.gitignore`. Consider creating `.env.example` files to show required variables without exposing sensitive data.

### 4. Start the backend

```bash
cd server
npm install
npm run dev
```

API runs at `http://localhost:3000`

### 5. Start the frontend

```bash
cd client
npm install
npm run dev
```

App runs at `http://localhost:5000`

Or check out the 🔗 **[Live Demo](https://homesphere-web.vercel.app)**

---

## Testing

**Frontend** tests are written with **Vitest** and **React Testing Library**.

```bash
cd client
npm test            # watch mode
npm run test:run    # run once
```

| Test file                   | What it covers                                                          |
| --------------------------- | ----------------------------------------------------------------------- |
| `useFetch.test.js`          | loading state, successful fetch, undefined url guard                    |
| `FavoritesContext.test.jsx` | toggle add/remove, isFavorite, localStorage persistence, provider error |

**Backend** tests are written with **Vitest** and **Supertest**.

```bash
cd server
npm test          # watch mode
npm run test:run  # run once
```

| Test file        | What it covers                                                  |
| ---------------- | --------------------------------------------------------------- |
| `servre.test.js` | GET /api/entries → checks it returns 200 and camelCase data     |
|                  | GET /api/entries/:id → checks 404 for missing entry             |
|                  | POST /api/contact → checks 400 when required fields are missing |

---

## Available Scripts

### Client

| Command            | Description               |
| ------------------ | ------------------------- |
| `npm run dev`      | Start frontend dev server |
| `npm run build`    | Build for production      |
| `npm run preview`  | Preview production build  |
| `npm run lint`     | Run ESLint                |
| `npm test`         | Run tests in watch mode   |
| `npm run test:run` | Run tests once            |

### Server

| Command            | Description                |
| ------------------ | -------------------------- |
| `npm run dev`      | Start backend with nodemon |
| `npm start`        | Start backend (production) |
| `npm test`         | Run tests in watch mode    |
| `npm run test:run` | Run tests once             |

---

## Roadmap

### Completed

- [x] Frontend deployment on Vercel
- [x] Backend deployment on Render
- [x] PostgreSQL database on Supabase
- [x] REST API with property entries
- [x] Category & deal-type filters
- [x] Property detail page
- [x] Custom `useFetch` hook
- [x] Responsive layout
- [x] Multi-step contact form with Yup validation
- [x] Email delivery via Resend
- [x] Favorites system with Context API and localStorage
- [x] Multilingual support (EN/DE) with react-i18next
- [x] Mortgage calculator with annuity formula (useMemo)
- [x] Map integration with Leaflet and OpenStreetMap geocoding
- [x] Frontend unit tests for useFetch and FavoritesContext (Vitest + React Testing Library)
- [x] Backend integration tests for all API endpoints (Supertest)
- [x] Admin Login for authentication
- [x] Authentication with Supabase Auth
- [x] Admin dashboard for CRUD actions
- [x] SEO improvements: lazy loading + compressed Webp images
- [x] Security: server-side password hashing with JWT authentication

### Next Steps

- [ ] Advanced search - Price, rooms, size, combined filters
- [ ] More SEO improvements
