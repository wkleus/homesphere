# HomeSphere – Real Estate App

![React](https://img.shields.io/badge/React-19.0+-61DAFB?logo=react&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.0+-CA4245?logo=reactrouter&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.0+-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![Render](https://img.shields.io/badge/API-Render.com-46E3B7?logo=render&logoColor=white)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)
![Status](https://img.shields.io/badge/Status-In_Progress-yellow)

🔗 [Live Demo](https://homesphere-web.vercel.app)

A fullstack real estate web application for browsing and discovering residential properties across Europe — from city apartments to alpine chalets. The React frontend fetches data from a custom Node.js/Express REST API, deployed separately on Render.com.

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
</div>

---

## Features

- **18 property listings** fetched from a custom REST API
- **Filter by category** (Apartment, Chalet, Residence, Studio, Townhouse)
- **Filter by deal type** (Rent / Buy)
- **Loading & error states** for all API calls
- **Detail page** per property with full info and stats
- **Custom `useFetch` hook** for reusable data fetching
- **Client-side routing** via React Router
- **Responsive layout** for mobile and desktop
- **Separate deployments** – Frontend on Vercel, API on Render.com

---

## Tech Stack

|              | Tool                  | Version     |
| ------------ | --------------------- | ----------- |
| **Frontend** | React                 | 19          |
|              | React Router DOM      | 7           |
|              | Phosphor Icons        | 1.4         |
|              | Vite                  | 8           |
|              | CSS Custom Properties | —           |
| **Backend**  | Node.js               | —           |
|              | Express               | 4           |
|              | CORS                  | 2           |
| **Hosting**  | Vercel                | Frontend    |
|              | Render.com            | Backend API |

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
│   │    │   └── api.js               # Central API URL config
│   │    ├── hooks/
│   │    │   └── useFetch.js          # Custom fetch hook
│   │    ├── components/
│   │    │   ├── Navbar/
│   │    │   ├── Heading/
│   │    │   ├── Footer/
│   │    │   └── Main/
│   │    │       ├── RealEstate.jsx   # Filter logic + listings
│   │    │       └── RealEstateCard/
│   │    │           ├── RealEstateDetails/
│   │    │           └── RealEstatePhoto/
│   │    │               ├── RealEstateCategory/
│   │    │               ├── RealEstateStatus/
│   │    │               └── IconItem/
│   │    └── pages/
│   │         └── EstateDetails/      # Single entry detail page
│   └── package.json
└── server/                           # Node.js / Express Backend
    ├── content/
    │   └── entries.js                # Property data
    ├── server.js                     # Express server & routes
    └── package.json
```

---

## API

The backend is a custom Node.js/Express REST API deployed on [Render.com](https://render.com):

```
GET https://homesphere-kifc.onrender.com/api/entries
GET https://homesphere-kifc.onrender.com/api/entries/:id
```

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/wkleus/homesphere.git
cd homesphere
```

### 2. Start the backend

```bash
cd server
npm install
npm run dev
```

API runs at `http://localhost:3000`

### 3. Start the frontend

```bash
cd client
npm install
npm run dev
```

App runs at `http://localhost:5000`

Or check out the 🔗 **[Live Demo](https://homesphere-web.vercel.app)**

---

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
- [x] REST API with property entries
- [x] Category & deal‑type filters
- [x] Property detail page
- [x] Custom useFetch hook
- [x] Responsive layout

### Next Steps (Short‑Term)

- [ ] PostgreSQL integration - Move property data from static files to a real database
- [ ] Contact agent form - Add form on detail page + backend email handling
- [ ] Advanced search - Price, rooms, size, combined filters

### Long‑Term

- [ ] Favorites system
- [ ] SEO improvements
- [ ] User accounts
- [ ] Admin dashboard
- [ ] Map integration
- [ ] Mortgage calculator
