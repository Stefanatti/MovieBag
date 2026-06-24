# 🎬 MovieBag

A full-stack web application for discovering, tracking, and rating movies & TV shows. Built with React and Node.js, powered by The Movie Database (TMDB) API.

🔗 **Live Demo:** [https://moviebag-1bhe.onrender.com](https://moviebag-1bhe.onrender.com)

> ⏳ _Free-tier hosting — initial load may take a few seconds to spin up._

---

## ✨ Features

- **Search & Discover** — Search for any movie or TV show using TMDB's extensive database
- **Personal Library** — Add movies and TV shows to your personal collection
- **Watchlist** — Bookmark titles you want to watch later
- **Star Ratings** — Rate every title in your library (1–5 stars)
- **Trailers** — Watch YouTube trailers directly in the app
- **Authentication** — Secure signup/login with JWT & HttpOnly cookies
- **Password Reset** — Email-based password recovery via Nodemailer
- **Multiple Themes** — Switch between Orange, Purple, and Blue color themes
- **Responsive Design** — Optimized for desktop, tablet, and mobile
- **Lazy Loading** — Code-split pages for fast initial load

---

## 🛠️ Tech Stack

### Frontend

| Technology                    | Purpose                    |
| ----------------------------- | -------------------------- |
| React 18                      | UI framework               |
| Redux Toolkit + Redux Persist | State management           |
| React Router v6               | Client-side routing        |
| Material UI (MUI) v5          | Component library & icons  |
| Axios                         | HTTP client                |
| React Hook Form + Yup         | Form handling & validation |
| SCSS / CSS Variables          | Styling & theming          |
| React Toastify                | Toast notifications        |
| React Slick                   | Carousel/slider            |
| React YouTube                 | Embedded trailers          |

### Backend

| Technology         | Purpose                       |
| ------------------ | ----------------------------- |
| Node.js + Express  | REST API server               |
| MongoDB + Mongoose | Database & ODM                |
| JWT (jsonwebtoken) | Authentication tokens         |
| bcrypt             | Password hashing              |
| Nodemailer         | Password reset emails         |
| node-cache         | Server-side caching           |
| cookie-parser      | HttpOnly cookie management    |
| CORS               | Cross-origin resource sharing |

### Deployment

| Service       | Role                                      |
| ------------- | ----------------------------------------- |
| Render        | Cloud hosting (backend + static frontend) |
| MongoDB Atlas | Cloud database                            |

---

## 📁 Project Structure

```
MovieBag/
├── Client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── api/            # Axios instance
│   │   ├── Components/     # Reusable UI components
│   │   ├── Features/       # Redux slices
│   │   ├── Hooks/          # Custom hooks
│   │   ├── Pages/          # Route pages
│   │   │   ├── Auth/       # Login, Signup, Reset Password
│   │   │   ├── MoviesPages/
│   │   │   └── TvShowsPages/
│   │   ├── Styles/         # SCSS stylesheets
│   │   ├── Validations/    # Yup schemas
│   │   ├── Variables/      # CSS custom properties (themes)
│   │   └── MovieApp.js     # Root app component
│   └── package.json
│
├── Server/                 # Express backend
│   ├── controllers/        # Route handlers
│   ├── middleware/          # Auth middleware
│   ├── modules/            # Mongoose models
│   ├── routers/            # Express routes
│   ├── server.js           # Entry point
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB (local or Atlas)
- TMDB API key → [get one here](https://www.themoviedb.org/settings/api)

### Installation

```bash
# Clone the repository
git clone https://github.com/Stefanatti/Movie-App.git
cd Movie-App

# Install server dependencies
cd Server
npm install

# Install client dependencies
cd ../Client
npm install
```

### Environment Variables

**Server (`Server/.env`):**

```env
API_KEY=your_tmdb_api_key
API_URL=https://api.themoviedb.org/3/
APP_URL=http://localhost:3636
CLIENT_URL=http://localhost:3000
MONGO_URI=your_mongodb_connection_string
TOKEN_KEY=your_jwt_secret
TOKEN_EXPIRES_IN=1d
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_google_app_password
NODE_ENV=development
```

**Client (`Client/.env`):**

```env
REACT_APP_URL=http://localhost:3636
```

### Run Locally

```bash
# Terminal 1 — Start the server
cd Server
npm run dev

# Terminal 2 — Start the client
cd Client
npm start
```

The client runs on `http://localhost:3000` and the server on `http://localhost:3636`.

---

## 📡 API Endpoints

| Method | Endpoint                      | Description                   |
| ------ | ----------------------------- | ----------------------------- |
| POST   | `/user/signup`                | Register a new user           |
| POST   | `/user/login`                 | Login & receive auth cookie   |
| GET    | `/user/verify`                | Verify session                |
| POST   | `/user/logout`                | Logout & clear cookie         |
| POST   | `/user/forgot_password`       | Send password reset email     |
| POST   | `/user/reset_password/:token` | Reset password                |
| GET    | `/api/search/:query`          | Search movies/shows           |
| GET    | `/api/id/:id`                 | Get movie details             |
| GET    | `/api/tv/id/:id`              | Get TV show details           |
| GET    | `/movie/:userId`              | Get user's movie library      |
| POST   | `/movie/`                     | Add movie to library          |
| DELETE | `/movie/:id`                  | Remove movie                  |
| PUT    | `/movie/rate/:id`             | Rate a movie                  |
| GET    | `/tvShow/:userId`             | Get user's TV show library    |
| POST   | `/tvShow/`                    | Add TV show to library        |
| DELETE | `/tvShow/:id`                 | Remove TV show                |
| PUT    | `/tvShow/rate/:id`            | Rate a TV show                |
| GET    | `/watchlist/movie/:userId`    | Get movie watchlist           |
| POST   | `/watchlist/movie/`           | Add to movie watchlist        |
| DELETE | `/watchlist/movie/:id`        | Remove from movie watchlist   |
| GET    | `/watchlist/tvShow/:userId`   | Get TV show watchlist         |
| POST   | `/watchlist/tvShow/`          | Add to TV show watchlist      |
| DELETE | `/watchlist/tvShow/:id`       | Remove from TV show watchlist |

---

## 📸 Screenshots

![Screenshot 1](https://github.com/Stefanatti/MovieBag/assets/101453394/006e1858-aff3-4507-b768-a45bc1e7eb4b)
![Screenshot 2](https://github.com/Stefanatti/MovieBag/assets/101453394/24558eaa-8a4d-409b-a144-720e30a76e06)
![Screenshot 3](https://github.com/Stefanatti/MovieBag/assets/101453394/358092b5-9186-43f9-bae3-5533c04eb710)

---

## 👤 Author

**Stefanos Kotsios**  
[GitHub](https://github.com/Stefanatti)

---

## 📄 License

This project is licensed under the ISC License.
