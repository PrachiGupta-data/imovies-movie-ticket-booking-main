# 🎬 IMovies — Full-Stack MERN Movie Ticket Booking Platform

**IMovies** is a full-featured, modern movie ticket booking web application built on the MERN stack (MongoDB, Express.js, React.js, Node.js) with Vite, Bootstrap 5, and JWT authentication.

---

## 🌟 Key Features

1. **Movie Catalog & Premiere Showcase**:
   - Hero spotlight for trending releases with backdrop imagery.
   - Filter movies by Genre (Action, Sci-Fi, Adventure, Drama, Animation, etc.) and search by title.
   - Comprehensive movie details including duration, language, IMDb-style rating, synopsis, director, cast, and trailer link.

2. **Theatres, Screen Formats & Showtimes**:
   - Multi-day showtime scheduling (Today, Tomorrow, and upcoming dates).
   - Grouped screenings by cineplex (e.g. *PVR ICON: Gold Class*, *INOX Megaplex*, *Cinepolis IMAX 3D*).
   - Screen format indicators (IMAX 3D, 2D, 3D, 4DX).

3. **Interactive Visual Seat Booking Engine**:
   - Realistic cinema seating layout with curved screen projection indicator.
   - Tiered seating structure:
     - **VIP Tier** (Rows A-B)
     - **Premium Tier** (Rows C-E)
     - **Regular Tier** (Rows F-H)
   - Real-time seat status indicators: Available, Selected (Neon glow), and Booked/Sold Out (dimmed).
   - Double-booking prevention with collision validation.

4. **Digital Cinema E-Ticket & Checkout**:
   - Live price calculator itemizing ticket tiers, convenience fee, and GST.
   - Instant ticket generation with booking reference code, hall & seat details, and scannable QR placeholder.
   - Direct Print / Save ticket option (`window.print()`).

5. **User & Admin Management**:
   - Secure user authentication with password hashing (`bcryptjs`) and JWT tokens.
   - **My Bookings** dashboard allowing users to view tickets and cancel reservations with instant seat release.
   - **Admin Control Panel**: Add new movies, schedule showtimes across theatres, and view platform-wide bookings and ticketing revenue.

---

## 🔑 Quick-Testing Accounts

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@imovies.com` | `admin123` |
| **Demo Customer** | `demo@imovies.com` | `demo123` |

*(The Sign-In page also includes 1-click autofill buttons for these credentials!)*

---

## 🚀 How to Run Locally

### 1. Start the Backend Server (Port 5000)
Open a terminal in the project directory:
```bash
cd backend
npm run dev
```
> The API will listen on `http://localhost:5000` with hot-reloading via `nodemon`.

### 2. Start the Frontend Application (Port 5173)
In a second terminal:
```bash
cd frontend
npm run dev
```
> Open your browser and navigate to **`http://localhost:5173`**.

---

## 🌐 Database Configuration (MongoDB Atlas)

The backend is pre-configured with MongoDB Atlas in [`backend/.env`](backend/.env):
```env
PORT=5000
MONGODB_URI=mongodb+srv://prektare25_db_user:...@cluster0.pdbsbem.mongodb.net/imovies?retryWrites=true&w=majority
JWT_SECRET=mySuperSecretKey123
```

### Whitelisting your IP in MongoDB Atlas:
To allow your machine to connect directly to the Atlas cluster:
1. Log into your [MongoDB Atlas Console](https://cloud.mongodb.com/).
2. Navigate to **Network Access** under Security.
3. Click **Add IP Address** -> select **Allow Access from Anywhere** (`0.0.0.0/0`) or add your current public IP.
4. Click **Confirm**.

> **Note**: Even if your Atlas IP is not yet whitelisted, the backend includes an automated in-memory cinema database engine with 6 blockbusters, 18 showtimes, and seed accounts, allowing you to test every feature without interruption!
