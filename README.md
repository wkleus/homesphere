# HomeSphere – Real Estate App

![React](https://img.shields.io/badge/React-19.0+-61DAFB?logo=react&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.0+-CA4245?logo=reactrouter&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.0+-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?logo=postgresql&logoColor=white)
![Resend](https://img.shields.io/badge/Email-Resend-000000?logo=mail.ru&logoColor=white)
![Render](https://img.shields.io/badge/API-Render.com-46E3B7?logo=render&logoColor=white)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)
![Status](https://img.shields.io/badge/Status-In_Progress-yellow)

🔗 [Live Demo](https://homesphere-web.vercel.app)

A fullstack real estate web application for browsing and discovering residential properties across Europe — from city apartments to alpine chalets. The React frontend fetches data from a custom Node.js/Express REST API backed by a PostgreSQL database hosted on Supabase. Contact requests are sent via email using Resend.

---

## Screenshots

<div style="display:flex; gap:12px; flex-wrap:wrap;">
  <div style="width:calc(50% - 6px); text-align:center;">
    <img src="client/public/screenshots/home.png" width="100%" alt="Home" />
    <p><em>Home – Navbar with contact info and hero heading</em></p>
  </div>
  <div style="width:calc(50% - 6px); text-align:center;">
    <img src="client/public/screenshots/main.png" width="100%" alt="Main" />
    <p><em>Main – Property listings with category and deal type filters</em></p>
  </div>
  <div style="width:calc(50% - 6px); text-align:center;">
    <img src="client/public/screenshots/footer.png" width="100%" alt="Footer" />
    <p><em>Footer – Opening hours and contact details</em></p>
  </div>
  <div style="width:calc(50% - 6px); text-align:center;">
    <img src="client/public/screenshots/details.png" width="100%" alt="Property Detail" />
    <p><em>Detail Page – Full property info with stats and pricing</em></p>
  </div>
   <div style="width:calc(50% - 6px); text-align:center;">
    <img src="client/public/screenshots/contact-form.png" width="100%" alt="Contact Form" />
    <p><em>Contact Form</em></p>
  </div> <div style="width:calc(50% - 6px); text-align:center;">
    <img src="client/public/screenshots/favorites-page.png" width="100%" alt="Favorites Page" />
    <p><em>Favorites Page</em></p>
  </div>
</div>

---

## Features

- **Property listings** fetched from a custom REST API
- **Filter by category** (Apartment, Chalet, Residence, Studio, Townhouse)
- **Filter by deal type** (Rent / Buy)
- **Favorites system** – save properties via heart icon, persisted in localStorage
- **Loading & error states** for all API calls
- **Detail page** per property with full info and stats
- **Contact agent** via multi-step form with Yup validation and email delivery via Resend
- **Custom `useFetch` hook** for reusable data fetching
- **Context API** for global favorites state
- **Client-side routing** via React Router
- **Responsive layout** for mobile and desktop
- **Separate deployments** – Frontend on Vercel, API on Render.com
- **PostgreSQL database** hosted on Supabase

---

## Tech Stack

|              | Tool                  | Version      |
| ------------ | --------------------- | ------------ |
| **Frontend** | React                 | 19           |
|              | React Router DOM      | 7            |
|              | Phosphor Icons        | 1.4          |
|              | Yup                   | 1            |
|              | Vite                  | 8            |
|              | CSS Custom Properties | —            |
| **Backend**  | Node.js               | —            |
|              | Express               | 4            |
|              | CORS                  | 2            |
|              | pg (node-postgres)    | 8            |
|              | dotenv                | 17           |
|              | express-rate-limit    | 7            |
|              | he(XSS sanitization)  | 1            |
|              | Resend                | 6            |
| **Database** | PostgreSQL            | via Supabase |
| **Hosting**  | Vercel                | Frontend     |
|              | Render.com            | Backend API  |
|              | Supabase              | Database     |

---

## Project Structure

```
homesphere/
├── client/                           # React Frontend
│   ├── public/
│   │   ├── favicons/
│   │   ├── photos/                   # Property images
│   │   └── screenshots/              # README screenshots
│   ├── src/
│   │    ├── App.jsx
│   │    ├── App.css
│   │    ├── main.jsx
│   │    ├── index.html
│   │    ├── config/
│   │    │   └── api.js               # Central API URL config (dev/prod)
│   │    ├── context/
│   │    │   └── FavoritesContext.jsx # Global favorites state with localStorage
│   │    ├── hooks/
│   │    │   └── useFetch.js          # Custom fetch hook
│   │    ├── components/
│   │    │   ├── Navbar/
│   │    │   ├── Heading/
│   │    │   ├── Footer/
│   │    │   ├── ContactForm/         # Multi-step modal with Yup validation
│   │    │   └── Main/
│   │    │       ├── RealEstate.jsx   # Filter logic + listings
│   │    │       └── RealEstateCard/
│   │    │           ├── RealEstateDetails/
│   │    │           └── RealEstatePhoto/
│   │    │               ├── RealEstateCategory/
│   │    │               ├── RealEstateStatus/
│   │    │               └── IconItem/
│   │    └── pages/
│   │        ├── EstateDetails/       # Single entry detail page
│   │        └── Favorites/           # Saved properties page
│   └── package.json
└── server/                           # Node.js / Express Backend
    ├── db.js                         # PostgreSQL connection pool
    ├── server.js                     # Express server & routes
    ├── schema.sql                    # Database table definition
    ├── seed.sql                      # Initial data (entries)
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

## Available Scripts

### Client

| Command           | Description               |
| ----------------- | ------------------------- |
| `npm run dev`     | Start frontend dev server |
| `npm run build`   | Build for production      |
| `npm run preview` | Preview production build  |
| `npm run lint`    | Run ESLint                |

### Server

| Command       | Description                |
| ------------- | -------------------------- |
| `npm run dev` | Start backend with nodemon |
| `npm start`   | Start backend (production) |

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

### Next Steps

- [ ] Advanced search - Price, rooms, size, combined filters
- [ ] SEO improvements
- [ ] Admin account/dashboard
- [ ] Authentication with Supabase Auth
- [ ] Unit tests with Vitest + React Testing Library
- [ ] Map integration
- [ ] Mortgage calculator

---
