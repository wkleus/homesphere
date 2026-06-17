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
![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen?logo=vitest)
![Status](https://img.shields.io/badge/Status-In_Progress-yellow)

🔗 [Live Demo](https://homesphere-web.vercel.app)

A full‑stack real estate web application for browsing and discovering residential properties across Europe — from modern city apartments to remote alpine chalets.
The frontend is built with React and communicates with a custom Node.js/Express REST API. Data is stored in a PostgreSQL database hosted on Supabase.

The platform includes user authentication with a secure login system and an admin dashboard for managing property listings, images, and content.
Contact requests are delivered via email using Resend.
The application supports English and German through react‑i18next.

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
      <img src="client/public/screenshots/contact-page.png" alt="Contact Page" height="300" width="310" />
      <br><em>Contact Page on smaller screens</em>
    </td>
  </tr>
</table>

---

## Features

- **Property listings** fetched from a PostgreSQL database via REST API
- **Filter by category** (Apartment, Chalet, Residence, Studio, Townhouse)
- **Filter by deal type** (Rent / Buy)
- **Favorites system** – save properties via heart icon, persisted in localStorage
- **Loading & error states** for all API calls
- **Detail page** per property with full info and stats
- **Mortgage calculator** – monthly payment calculator with sliders on detail page
- **Contact agent** via multi-step form with Yup validation and email delivery via Resend
- **Custom `useFetch` hook** for reusable data fetching
- **Context API** for global favorites state
- **Client-side routing** via React Router
- **Responsive layout** for mobile and desktop
- **Framer motion**
- **Multilingual** – English and German via react-i18next, flag icons in Navbar
- **Map integration** – interactive Leaflet map per property with OpenStreetMap geocoding
- **Login page** for user authentication
- **Admin page** providing full CRUD operations
- **SEO** enhancements such as lazy loading and WebP support
- **Tested** - Frontend with Vitest + React Testing Library and Backend with Supertest
- **Separate deployments** – Frontend on Vercel, API on Render.com
- **PostgreSQL database** hosted on Supabase

---

## Tech Stack

|              | Tool                           | Version      |
| ------------ | ------------------------------ | ------------ |
| **Frontend** | React                          | 19           |
|              | React Router DOM               | 7            |
|              | Phosphor Icons                 | 1.4          |
|              | Yup                            | 1            |
|              | Vite                           | 8            |
|              | CSS Custom Properties          |              |
|              | react-i18next                  | 15           |
|              | Leaflet + react-leaflet        | 1.9 / 4      |
|              | Vitest + React Testing Library | 4 / 16       |
| **Backend**  | Node.js                        |              |
|              | Express                        | 4            |
|              | CORS                           | 2            |
|              | pg (node-postgres)             | 8            |
|              | dotenv                         | 17           |
|              | express-rate-limit             | 7            |
|              | he(XSS sanitization)           | 1            |
|              | Resend                         | 6            |
|              | Vitest + Supertest             | 4 / 7        |
| **Database** | PostgreSQL                     | via Supabase |
| **Hosting**  | Vercel                         | Frontend     |
|              | Render.com                     | Backend API  |
|              | Supabase                       | Database     |

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
│   │    │   └── api.js                     # Central API URL config (dev/prod)
│   │    ├── context/
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
│   │    │   ├── MapModal/                  # Leaflet map modal with Nominatim geocoding
│   │    │   ├── ContactForm/               # Multi-step modal with Yup validation
│   │    │   ├── MortgageCalculator/        # Monthly payment calculator with useMemo
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

```
GET  https://homesphere-kifc.onrender.com/api/entries
GET  https://homesphere-kifc.onrender.com/api/entries/:id
POST https://homesphere-kifc.onrender.com/api/contact
```

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

Create `server/.env`:

```
# Server port (Render sets this automatically in production)
PORT=3000

# PostgreSQL connection string (Supabase)
DATABASE_URL=your_postgresql_connection_string

# Resend API key for email sending
RESEND_API_KEY=your_resend_api_key

# Email address that receives contact form submissions
CONTACT_EMAIL=your@email.com
```

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
- [x] SEO improvements: lazy loading + compressed Webp images

### Next Steps

- [ ] Admin dashboard for CRUD actions
- [ ] Advanced search - Price, rooms, size, combined filters
- [ ] More SEO improvements
