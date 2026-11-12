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
- **Community Reviews** — Read public movie/TV reviews; publish, edit, or delete your own, with spoiler hiding
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

## Community Reviews

Movie and TV-show details pages display a shared reviews section above similar
titles. Everyone can read public reviews; private reviews are visible only to
their author. An authenticated account is required to write a review. Each account
can save one review per title (public or private) and can edit, delete, or change
visibility only for its own reviews. Reviews accept 1-2,000 characters after
trimming whitespace.

- Reviews are ordered newest first, five per page.
- Authors can mark spoilers; readers must explicitly reveal the text.
- The editor has a **Private review (only you can see it)** choice. Public is the
  default, and the form explicitly shows who can read the review before saving.
- Title pages keep the author's own review visible above the public list,
  including private reviews. Private reviews never appear in public listings or
  their counts, even when the author is logged in.
- The same inline editor and delete confirmation are available on title pages
  and My Reviews. **Publish review** and **Make private** actions change
  visibility without changing the text or spoiler setting.
- Reviews are independent of library membership. Removing a title from a library
  does not remove its review.
- Existing personal star ratings and TMDB scores are unchanged.
- Only the author's ID and username are exposed, not private account fields.
- Movies and TV shows use separate identities even when their TMDB IDs match.

### My Reviews

Signed-in users can open **My Reviews** (`/myreviews`) from the desktop navbar,
mobile/tablet drawer, or account menu. This protected page shows only the current
account's reviews across movies and TV shows, newest first, five per page.
Each card includes the title, media type, poster, review date and text, and a
**Public** or **Private** label. Users can edit text, spoilers and visibility,
publish a private review, make a public review private, or delete a review
directly on the card without leaving the page. A title link remains available.
Spoiler reviews retain their reveal/hide controls. Failed saves retain the draft
and its visibility choice; failed visibility changes keep the previous status.

Title names and posters are fetched through the existing cached TMDB details
endpoints, so older reviews work without a metadata backfill. Missing posters
have a placeholder; if title details fail, the review remains visible with a
warning and retry action. History loading failures also provide a retry action.

Reviews use a new MongoDB `reviews` collection, with a unique index on
`author + tmdbId + mediaType`, an index for title-based chronological listing,
and an `author + createdAt + _id` index for personal history.
No existing library data needs migration. With Mongoose's default automatic
index creation enabled, indexes are created when the model connects; deployments
that disable `autoIndex` must provision these indexes before accepting reviews.
Existing reviews without an `isPrivate` field remain public; no review backfill
is needed. New reviews default to `isPrivate: false`. All review API responses
use `Cache-Control: no-store` so browser/shared caches do not retain review
responses after visibility changes. Making a review private prevents future
public API reads; it cannot retract copies someone has already read or saved.

Likes, replies, review ratings, reporting/moderation tools, and posting rate limits
are not included in this first version. Plan moderation and abuse controls before
a wider public rollout.

### Review tests

Backend tests use Node's built-in test runner (Node 18.8+; Node 22 recommended):

```powershell
cd Server
npm test
```

They exercise the real Express routes, JWT middleware and Mongoose validation
with mocked database operations; they do not connect to or change a database.
Client interaction tests use the existing React test tooling:

```powershell
cd Client
node .\node_modules\react-scripts\bin\react-scripts.js test --watchAll=false --runInBand ReviewSection.test.js MyReviews.test.js Navbar.test.js
```

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
| GET    | `/reviews/:mediaType/:tmdbId?page=1` | List public reviews, five per page |
| GET    | `/reviews/mine?page=1`       | List the authenticated user's reviews across movies and TV, five per page |
| GET    | `/reviews/mine/:mediaType/:tmdbId` | Get the authenticated user's review |
| POST   | `/reviews/:mediaType/:tmdbId` | Create a public or private review (authentication required) |
| PATCH  | `/reviews/:reviewId`         | Edit an owned review or change its visibility |
| DELETE | `/reviews/:reviewId`         | Delete an owned review |

Review `mediaType` is `movie` or `tv`; `tmdbId` is a positive integer represented
as a string. POST accepts
`{ "text": "...", "containsSpoilers": false, "isPrivate": false }`; both boolean
flags are optional and default to `false`. PATCH accepts any non-empty subset of
these fields. For example, `{ "isPrivate": true }` makes an owned review private,
and `{ "isPrivate": false }` publishes it without altering its content. Flags
must be actual booleans. Author and title identity cannot be supplied or changed
in the body.
Both listing endpoints return `{ reviews, page, total, totalPages }`. Personal
history includes public and private reviews and derives ownership from the
session, not a caller-supplied user ID. Public title listings and their counts
exclude private reviews.
The per-title `mine/:mediaType/:tmdbId` endpoint returns `{ review }`, with
`null` when the user has not reviewed the title.
Creation returns HTTP 201 and `{ message, review }`; edits return
`{ message, review }`; deletion returns `{ message }`. Duplicate reviews return
409, invalid input 400, unauthenticated writes 401, and missing/non-owned reviews
404.

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
