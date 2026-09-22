# Feedants — Competition Details Full-Stack Module

A production-grade, full-stack React Native Expo mobile application and Express/MongoDB REST backend implementing the **Competition Details Module** for Feedants. Built with a premium dark + gold design theme (Stitch Obsidian & Gold system), complete backend-driven business logic, atomic registration concurrency protection, and JWT authentication.

---

## 📌 Overview
- **Mobile Application**: Cross-platform React Native mobile client powered by Expo (SDK 52) and TypeScript.
- **Primary Module**: Core Competition Details experience — dynamic competition discovery, key metrics, countdown timers, judges, dynamic tabs, previous winners, tiered rewards, ratings/reviews, and multi-step performance submissions.
- **Backend API**: Node.js + Express.js REST service deployed on Render (`https://feedants-jv9a.onrender.com/api`).
- **Database**: MongoDB Atlas cloud database with Mongoose ORM models, custom indexes, and atomic `$expr`/`$inc` capacity controls.
- **Authentication**: Stateless JWT token authentication with bcrypt password hashing and 401 token expiration interceptors.

---

## ✨ Features

### 1. Authentication & Security
- User registration (`POST /api/auth/register`) with name, email, and password.
- User login (`POST /api/auth/login`) with JWT token issuance and password verification.
- Profile verification (`GET /api/auth/me`) and secure session persistence via `expo-secure-store`.
- Automatic 401 Unauthorized token expiration interception and logout redirection.

### 2. Core Competition Details (Backend-Driven)
- **Dynamic Competition Metadata**: Title, cover image, category tag, description, prize pool, entry fee, spots counter, registration & submission start/end dates, result announcement date, and lifecycle state.
- **Live Countdown Timers**: Real-time ticker counting down to registration deadline, submission end, or result announcement based on competition state.
- **Dynamic Judge Card**: Judge avatar, name, profession, experience, and video links.
- **Functional Interactive Tabs**: **About Competition**, **Judging Parameters**, and **Rules & Eligibility**.
- **Tiered Rewards**: Position breakdown (1st, 2nd, 3rd, etc.) with prize amounts and incentives notices.
- **Previous Winners Carousel**: Carousel displaying previous edition winners with avatars, positions, and prize amounts.

### 3. State Engine & Lifecycle Management
Supports 8 exact backend-calculated competition states:
- `UPCOMING`, `REGISTRATION_OPEN`, `REGISTRATION_CLOSED`, `SUBMISSION_OPEN`, `SUBMISSION_CLOSED`, `JUDGING`, `RESULTS_PUBLISHED`, `COMPLETED`.
- CTA dynamically updates to reflect state: *"Register Now"*, *"Upload Submission"*, *"Submission Under Review"*, *"Registration Closed"*, *"Competition Full"*, or *"View Results"*.

### 4. Interactive Registration Confirmation Modal
- Polished bottom sheet displaying entry fee, remaining spots, terms summary, and production payment disclaimer.
- Atomically processes registration without allowing capacity over-subscription.

### 5. Participant Rating & Review System
- Displays average star rating badge (e.g. ★ 4.8) and total review count.
- Review cards with reviewer name, avatar, star rating (1-5), timestamp, and comment.
- "Write a Review" modal with interactive star selector and comment text input.
- Enforces single review per user per competition via compound unique database index (`HTTP 409 DUPLICATE_REVIEW`).

### 6. Guided 3-Step Performance Submission Flow
- Native gallery/video picker integration via `expo-image-picker`.
- 3-step guided wizard (*Select Media → Submission Details → Review & Confirm*).
- Server validates registration status (`HTTP 403 NOT_REGISTERED`), deadline, and duplicate submissions.
- Sets submission status to `'UNDER_REVIEW'` and updates user participation state.

### 7. My Competitions & User Dashboard
- Real user participation list fetched from `GET /api/me/competitions`.
- Filters contests by status (*All*, *Registered*, *Under Review*, *Completed*).

---

## 🛠️ Tech Stack

### Frontend (Mobile App)
- **Framework**: React Native with Expo (SDK 52)
- **Language**: TypeScript
- **Navigation**: React Navigation (Native Stack & Bottom Tabs)
- **Storage**: `expo-secure-store` & `@react-native-async-storage/async-storage`
- **Media Picker**: `expo-image-picker`
- **UI Components**: `expo-linear-gradient`, `react-native-safe-area-context`

### Backend (REST API)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas with Mongoose ORM
- **Security & Headers**: `helmet`, `cors`
- **Rate Limiting**: Custom sliding window rate limiter
- **Authentication**: `jsonwebtoken` (JWT) & `bcryptjs`

---

## 🏗️ Architecture

```text
┌─────────────────────────────────────────────────────────┐
│              Expo Mobile App (React Native)             │
│        (Stitch Obsidian & Gold Visual Design System)     │
└────────────────────────────┬────────────────────────────┘
                             │
                      HTTPS / REST API
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│               Node.js + Express.js API                  │
│       (Helmet, Rate Limiter, Input Validator, JWT)      │
└────────────────────────────┬────────────────────────────┘
                             │
                     Mongoose Connection
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                  MongoDB Atlas Database                 │
│    (Competitions, Participations, Submissions, Reviews) │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```text
Feedants/
├── backend/
│   ├── src/
│   │   ├── config/          # Environment & Database config
│   │   ├── controllers/     # Route request handlers
│   │   ├── middleware/      # Auth, Rate Limiter, Input Validator, Error Handler
│   │   ├── models/          # Mongoose Schemas (Competition, User, Participation, Submission, Review)
│   │   ├── routes/          # Express Routers
│   │   ├── scripts/         # Automated test scripts & seeders
│   │   ├── services/        # Core business logic & database queries
│   │   ├── utils/           # Lifecycle state calculators
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Server listener entrypoint
│   ├── .env.example
│   └── package.json
│
├── mobile/
│   ├── assets/              # App icons, splashes, and images
│   ├── src/
│   │   ├── components/      # Modular UI (submission wizard, competition modals, reviews)
│   │   ├── config/          # Environment URL normalizer
│   │   ├── context/         # AuthContext provider
│   │   ├── hooks/           # Countdown & timer hooks
│   │   ├── navigation/      # Root & Tab Navigators
│   │   ├── screens/         # Screen Views (CompetitionDetails, Home, Explore, Upload, MyComps, Auth, Profile)
│   │   ├── services/        # Centralized API service clients
│   │   └── utils/           # CTA helper utilities
│   ├── app.json             # Expo project configuration
│   ├── eas.json             # EAS Build configuration for APK
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🔐 Environment Variables

> [!IMPORTANT]
> `EXPO_PUBLIC_*` variables are bundled directly into the compiled mobile application binary and **must never contain backend secrets, private keys, or database credentials**.

### Backend Variables (`backend/.env`)

```env
# Server Listener Port
PORT=5000

# Environment Mode (development | staging | production)
NODE_ENV=production

# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/feedants?retryWrites=true&w=majority

# Authentication Secrets
JWT_SECRET=your_production_jwt_secret_key_change_me
JWT_EXPIRES_IN=7d

# CORS Allowed Origin
CLIENT_URL=*

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Variables (`mobile/.env`)

```env
# Production API Endpoint URL (Render Backend)
EXPO_PUBLIC_API_URL=https://feedants-jv9a.onrender.com/api

# Environment Mode
EXPO_PUBLIC_ENV=production
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo Go app on physical mobile device OR Android Emulator / iOS Simulator

### 2. Backend Setup
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Option A: Run in development mode (Uses local MongoDB / Fallback)
npm run dev

# Option B: Seed database with sample competitions
npm run seed
```

### 3. Frontend Setup
```bash
# Navigate to mobile folder
cd mobile

# Install dependencies
npm install

# Start Expo development server
npx expo start
```

---

## 🌐 Production Setup

1. **Database (MongoDB Atlas)**:
   - Create a free cluster on MongoDB Atlas.
   - Under **Security → Network Access**, add `0.0.0.0/0` (Allow access from anywhere).
   - Obtain connection string: `mongodb+srv://<user>:<password>@cluster.mongodb.net/feedants`.

2. **Backend Deployment (Render)**:
   - Root directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables: Add `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`.

3. **Frontend Production Build**:
   - Update `mobile/.env` with production backend URL (`EXPO_PUBLIC_API_URL=https://your-backend.onrender.com/api`).
   - Run EAS build: `eas build -p android --profile preview` to generate standalone APK.

---

## 📖 API Documentation

| Method | Endpoint | Auth Required | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | No | Health check, uptime, and database connectivity status |
| `POST` | `/api/auth/register` | No | Register new user account |
| `POST` | `/api/auth/login` | No | Authenticate user & issue JWT token |
| `GET` | `/api/auth/me` | **Yes** | Fetch current authenticated user profile |
| `GET` | `/api/competitions` | No | List competitions with status filters & pagination |
| `GET` | `/api/competitions/:id` | Optional | Fetch full competition details, judges, rewards, and user participation state |
| `POST` | `/api/competitions/:id/register` | **Yes** | Atomically register user for competition |
| `GET` | `/api/competitions/:id/reviews` | No | Fetch paginated reviews list & average rating stats |
| `POST` | `/api/competitions/:id/reviews` | **Yes** | Post a 1-5 star review for a competition |
| `POST` | `/api/competitions/:id/submissions` | **Yes** | Submit performance media entry for review |
| `GET` | `/api/me/competitions` | **Yes** | Fetch current user's registered contests & submission statuses |

---

## ⚖️ Business Rules & Integrity Controls

1. **Capacity Protection**: Registrations use atomic MongoDB `$expr` and `$inc` operators. Remaining spots can never drop below 0 or exceed `maxParticipants`.
2. **Registration Eligibility**: Registrations are rejected if the registration window is closed (`HTTP 400 REGISTRATION_CLOSED`) or if the competition is full (`HTTP 400 COMPETITION_FULL`).
3. **Duplicate Protection**:
   - Compound unique index `{ userId: 1, competitionId: 1 }` on `Participation` prevents duplicate user registrations (`HTTP 409 ALREADY_REGISTERED`).
   - Compound unique index on `Submission` prevents duplicate media uploads per competition (`HTTP 409 ALREADY_SUBMITTED`).
   - Compound unique index on `Review` prevents duplicate user reviews (`HTTP 409 DUPLICATE_REVIEW`).
4. **Submission Integrity**: Submissions require prior competition registration (`HTTP 403 NOT_REGISTERED`) and must be uploaded within active submission dates.
5. **Review Validation**: Ratings must be integers between 1 and 5; comments must be non-empty strings (5-500 characters).

---

## 🎯 Technical Decisions

- **REST API vs GraphQL**: REST APIs provide simple, predictable endpoint contracts with clear HTTP status codes (200, 201, 400, 401, 403, 409, 429) suitable for mobile consumption.
- **Backend as Source of Truth**: Business rules, countdown deadlines, remaining spots, and user eligibility are calculated on the server to prevent client-side tampering.
- **Atomic Operations over Transactions**: Using MongoDB `$expr` with `$inc` guarantees atomic capacity management on free-tier standalone MongoDB clusters without requiring replica sets.
- **Stateless JWT Authentication**: Enables scalable horizontal scaling on serverless/cloud platforms like Render without server-side session stores.

---

## 🛡️ Scalability & Production Considerations

- **MongoDB Indexing**: Indexes applied to `status`, `category`, `registrationStart`/`registrationEnd`, `userId`, and `competitionId`.
- **API Pagination**: Pagination (`page`, `limit`) implemented on competition listings and review lists to prevent large payload memory overhead.
- **Rate Limiting**: In-memory sliding window rate limiters guard login, signup, submission, and review endpoints against brute-force attacks.
- **Input Validation & Sanitization**: Server-side ObjectId, regex email, password, and string trimming validation.

### Future Production Improvements
- **Payment Gateway Integration**: Hook Razorpay / Stripe SDKs directly into `RegistrationModal`.
- **Cloud Media Storage**: Upload performance videos directly to AWS S3 / Cloudinary via presigned URLs.
- **Push Notifications**: Integrate Expo Push Notifications for deadline reminders and result announcements.
- **CI/CD Pipeline**: GitHub Actions for automated linting, test execution, and deployment.

---

## ⚠️ Assumptions & Trade-Offs

- **Payment Gateway**: Real payment SDK integration was excluded per assignment scope; the `RegistrationModal` performs actual backend registration while displaying a production payment hook disclaimer.
- **Local Media Storage**: Media files selected via `expo-image-picker` use local uri / blob representations with production cloud storage architectural guidelines documented in `submissionService.js`.

---

## 🧪 Testing & Verification

Comprehensive QA audit performed across:
- **`testAuthApi.js`**: 13/13 Passed (Auth, password security, token validation, multi-user isolation).
- **`testStep9DetailsAndReviews.js`**: 15/15 Passed (Dynamic competition payload, tabs, reviews, rating stats).
- **`testSubmissionFlow.js`**: 13/13 Passed (3-step wizard, registration checks, duplicate submission rejection).
- **`testConcurrencyRegistration.js`**: 100% Passed (20 simultaneous registration requests under capacity limit).
- **TypeScript**: `npx tsc --noEmit` clean with 0 errors.

---

## 📱 Demo / Test Account

- **Email**: `rohan.sharma@example.com`
- **Password**: `Password123!`

---

## ✅ Submission Checklist

- [x] GitHub Repository created & updated
- [x] Full-Stack source code committed
- [x] Professional `README.md` at repository root
- [x] Environment template files (`.env.example` in `backend/` and `mobile/`)
- [x] Backend deployed on Render (`https://feedants-jv9a.onrender.com/api`)
- [x] MongoDB Atlas cloud database connected
- [x] EAS Build configuration (`eas.json`) ready for APK generation
- [x] Zero hardcoded secrets in source code
