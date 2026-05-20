<div align="center">

# 🎯 Interview Platform

### A Full-Stack, Real-Time Collaborative Interview Preparation SaaS

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://interview-platform-liart.vercel.app)
[![GitHub Stars](https://img.shields.io/github/stars/vamsi2246/Interview-platform?style=for-the-badge&logo=github)](https://github.com/vamsi2246/Interview-platform)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

*Real-time collaborative coding rooms · AI-powered mock interviews · Live video & chat · Remote code execution*

</div>

---

## 📌 Overview

**Interview Platform** is a production-grade, full-stack SaaS application built to simulate real technical interview environments. It combines real-time collaborative code editing, live video/audio sessions, AI-generated interview questions, and instant code execution — all in a single, seamlessly integrated product.

This project demonstrates end-to-end software engineering: from a cleanly layered Node.js backend and a component-driven React frontend, to third-party SDK orchestration, background event processing, and Vercel edge deployment.

---

## 🚀 Live Features

| Feature | Description |
|---|---|
| 🎥 **Live Coding Rooms** | Real-time collaborative sessions with video, audio & chat powered by Stream SDK |
| 🤖 **AI Mock Interviews** | AI-generated questions via Groq (Llama 3.1) with per-answer scoring & feedback |
| 🖊️ **Monaco Playground** | Standalone code editor with multi-language execution and localStorage persistence |
| ⚡ **Remote Code Execution** | Judge0 CE integration supporting JavaScript, Python, Java, and C++ |
| 📊 **Analytics Dashboard** | Active sessions, recent history, and AI interview history in one view |
| 🔐 **Clerk Authentication** | Social login, JWT-based API auth, and event-driven user sync via Inngest |
| 🌗 **Theme Switching** | Full dark/light mode with DaisyUI theming |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│   React 19 + Vite │ TailwindCSS + DaisyUI │ TanStack Query  │
│   Clerk SDK │ Stream Video SDK │ Monaco Editor               │
└─────────────────────┬───────────────────────────────────────┘
                      │  HTTPS + Bearer JWT
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS API SERVER                        │
│                                                             │
│  ┌──────────┐   ┌────────────┐   ┌─────────────────────┐  │
│  │  Routes  │──▶│ Controllers│──▶│      Services        │  │
│  └──────────┘   └────────────┘   └──────┬──────────────┘  │
│                                          │                   │
│              ┌───────────────────────────┼────────────┐     │
│              ▼                           ▼            ▼     │
│        ┌──────────┐             ┌─────────────┐  ┌───────┐ │
│        │  MongoDB │             │  Stream SDK  │  │ Groq  │ │
│        │  Atlas   │             │ Video + Chat │  │  AI   │ │
│        └──────────┘             └─────────────┘  └───────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Inngest (Background Jobs) — Clerk Webhook Handler   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │  Judge0 CE (External)  │
         │  Remote Code Execution │
         └────────────────────────┘
```

---

## 🗂️ Project Structure

```
Interview-platform/
├── vercel.json                  # Vercel deployment + SPA rewrite config
├── package.json                 # Root build orchestrator
│
├── frontend/                    # React + Vite SPA
│   ├── src/
│   │   ├── api/                 # Typed API client modules
│   │   ├── components/          # Reusable UI components (13 total)
│   │   ├── data/                # Problem bank & language configs
│   │   ├── hooks/               # TanStack Query custom hooks
│   │   ├── lib/
│   │   │   └── axios.js         # Axios instance with Clerk JWT interceptor
│   │   └── pages/               # Route-level page components (9 pages)
│   └── vite.config.js
│
└── backend/                     # Node.js + Express API
    └── src/
        ├── config/
        │   ├── db.js            # Mongoose connection
        │   ├── env.js           # Centralised env validation
        │   ├── stream.js        # Stream SDK clients (video + chat)
        │   └── inngest.js       # Background job definitions
        ├── models/              # Mongoose schemas
        │   ├── User.js
        │   ├── Session.js
        │   └── MockInterview.js
        ├── routes/              # Express routers
        ├── controllers/         # Request handlers (thin layer)
        ├── services/            # Business logic (fat layer)
        │   ├── AIService.js     # Groq/LLM integration
        │   ├── CodeService.js   # Judge0 execution
        │   ├── SessionService.js
        │   ├── InterviewService.js
        │   ├── ChatService.js
        │   └── UserService.js
        ├── middlewares/
        │   ├── protectRoute.js  # Clerk JWT auth guard
        │   └── errorHandler.js  # Global error middleware
        └── utils/
            └── CustomError.js   # Typed error class
```

---

## 🔌 REST API Reference

### Session Endpoints — `/api/session`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/token` | ✅ | Generate Stream video token |
| `POST` | `/create` | ✅ | Create session + Stream call + chat channel |
| `GET` | `/active` | ✅ | Fetch all live sessions (limit 20) |
| `GET` | `/my-recent` | ✅ | Fetch user's completed session history |
| `GET` | `/:id` | ✅ | Get session with populated host/participant |
| `POST` | `/:id/join` | ✅ | Join session (validates capacity + status) |
| `POST` | `/:id/end` | ✅ | End session + hard-delete Stream resources |
| `DELETE` | `/:id` | ✅ | Delete session (host only) |

### Mock Interview Endpoints — `/api/mock-interview`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | ✅ | Create interview + generate AI questions |
| `GET` | `/` | ✅ | List user's interviews (lightweight — no answers) |
| `GET` | `/:id` | ✅ | Full interview detail (ownership enforced) |
| `POST` | `/:id/answer` | ✅ | Save / update answer for a question |
| `POST` | `/:id/feedback` | ✅ | Trigger AI feedback generation + scoring |

### Other Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/code/run-code` | ❌ | Execute code via Judge0 CE |
| `GET` | `/api/chat/token` | ✅ | Stream Chat user token |
| `POST` | `/api/inngest` | — | Inngest webhook handler (Clerk events) |

---

## 🧠 AI Mock Interview — Flow

```
User fills role/techStack/experience
          │
          ▼
POST /api/mock-interview
  └─ InterviewService.createInterview()
       └─ AIService.generateQuestions()   ← Groq llama-3.1-8b-instant
            Returns 5 ordered questions
          │
          ▼
Interview stored (status: "pending")
Navigate → /mock-interview/:id/setup
  └─ Webcam preview + mic permission check
          │
          ▼
Navigate → /mock-interview/:id
  └─ Questions presented one at a time
  └─ POST /:id/answer per question (upsert)
          │
          ▼
POST /:id/feedback
  └─ InterviewService.generateAndSaveFeedback()
       └─ Sequential per-answer Groq calls (rate-limit safe)
       └─ overallScore = avg(ratings) rounded to 1 decimal
          │
          ▼
Navigate → /mock-interview/:id/result
  └─ Score card + per-question feedback display
```

---

## ⚡ Real-Time Communication Architecture

```
User A creates session
  │
  ├─ MongoDB: Session document created (status: active, callId: "session_<ts>_<rand>")
  ├─ Stream Video: Call created with problem metadata as custom data
  └─ Stream Chat: Messaging channel created, host added as member
           │
User B joins session
  │
  ├─ MongoDB: participant field populated
  └─ Stream Chat: User B added to channel members
           │
Both Users in /session/:id
  │
  ├─ Stream Video SDK: WebRTC peer connection (camera + mic)
  ├─ Stream Chat SDK: Real-time message channel
  └─ Monaco Editor: Shared code (via Stream custom events or session state)
           │
Host ends session
  │
  ├─ Stream Video: call.delete({ hard: true })
  ├─ Stream Chat: channel.delete()
  └─ MongoDB: status → "completed"
```

---

## 🗄️ Database Schema

### User
```js
{ clerkId: String (unique), name: String, email: String (unique), profileImage: String }
```

### Session
```js
{
  problem: String,
  difficulty: enum["easy", "medium", "hard"],
  host: ObjectId → User,
  participant: ObjectId → User (nullable),
  status: enum["active", "completed"],
  callId: String            // Stream video call identifier
}
```

### MockInterview
```js
{
  userId: ObjectId → User,
  role: String, techStack: String, experience: Number,
  questions: [{ text, order }],
  answers:   [{ questionId, text, recordedAt }],
  feedback:  [{ questionId, correctAnswer, rating(1-10), feedback }],
  overallScore: Number,
  status: enum["pending", "in-progress", "completed"]
}
```

---

## 🔒 Security Architecture

- **Clerk JWT Middleware** — Every protected route validates the Bearer token server-side via `@clerk/express` before any business logic executes.
- **Ownership Enforcement** — `getInterviewById` and `endSession` explicitly compare `userId` against the resource owner before allowing mutations.
- **Session Capacity Guard** — `joinSession` rejects if `session.participant` is already set (HTTP 409) or if the host attempts to join their own session.
- **Atomic Rollback** — `createSession` deletes the MongoDB document if Stream resource creation fails, preventing orphaned records.
- **Idempotent Feedback** — `generateFeedback` short-circuits if status is already `completed`, preventing duplicate LLM charges.
- **CORS Allowlist** — Origin validated against an explicit allowlist + Vercel subdomain pattern.
- **Environment Isolation** — All secrets loaded through a validated `ENV` config object; no raw `process.env` access in business logic.

---

## 🧱 Backend Engineering Principles

### Layered Architecture (MVC + Service)
```
HTTP Request → Router → Controller → Service → Model/External SDK → Response
```
Controllers are kept intentionally thin — they only extract request data and delegate to services. All business logic, validation, and side effects live in service functions.

### Custom Error Handling
A `CustomError` class carries a `statusCode` alongside the message. The global `errorHandler` middleware formats all errors into a consistent `{ success: false, error: "..." }` envelope, preventing stack traces from leaking to clients.

### Background Event Processing (Inngest)
User lifecycle events from Clerk (`user.created`, `user.deleted`) are processed asynchronously through Inngest, which:
- Creates the MongoDB `User` document
- Upserts the user into Stream (video + chat)
- Handles retries and failure visibility without blocking the auth flow

---

## 🖥️ Frontend Architecture

### Data Fetching — TanStack Query
All server state is managed through TanStack Query v5 with dedicated custom hooks (`useSessions`, `useMockInterview`). This provides:
- Automatic caching & background refetching
- Optimistic invalidation after mutations
- Loading/error state abstraction

### Auth-Aware Axios Instance
A singleton Axios instance stores a reference to Clerk's `getToken` function, injecting a fresh JWT into every outbound request via a `request` interceptor.

### Route Protection
React Router routes are wrapped in conditional `Navigate` redirects based on `isSignedIn` from Clerk's `useUser` hook — no session cookies required.

### Monaco Playground — State Persistence
The Playground page persists language, code, filename, and stdin to `localStorage` under a namespaced key (`playground_code_state`), so user work survives page refreshes without any backend calls.

---

## 🚢 Deployment Architecture

```
GitHub (main branch)
       │ push
       ▼
Vercel CI/CD Pipeline
  └─ Build Command: npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend
  └─ Output Dir: frontend/dist
  └─ SPA Rewrite: /* → /index.html  (handles React Router client-side routing)
       │
       ▼
Vercel Edge Network (CDN)
  └─ Static assets served globally
  └─ API requests proxied to Render/backend server
```

**Backend** is deployed as a persistent Node.js server (Render/Railway) connected to MongoDB Atlas. The frontend is a fully static Vite bundle served from Vercel's CDN.

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB Atlas cluster (or local MongoDB)
- Accounts: [Clerk](https://clerk.dev), [Stream](https://getstream.io), [Groq](https://console.groq.com), [Inngest](https://inngest.com)

### 1. Clone the Repository
```bash
git clone https://github.com/vamsi2246/Interview-platform.git
cd Interview-platform
```

### 2. Configure Backend Environment
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5001
DB_URL=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/<dbname>
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
STREAM_API_KEY=...
STREAM_API_SECRET=...
GROQ_API_KEY=gsk_...
INNGEST_EVENT_KEY=...
INNGEST_SIGNIN_KEY=...
CLIENT_URL=http://localhost:5173
```

### 3. Configure Frontend Environment
```bash
cd frontend
```

Create `frontend/.env`:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:5001
```

### 4. Start Development Servers
```bash
# Terminal 1 — Backend
cd backend && npm install && npm run dev

# Terminal 2 — Frontend
cd frontend && npm install && npm run dev
```

Frontend → http://localhost:5173  
Backend API → http://localhost:5001

---

## 🌍 Production Deployment (Vercel)

### Environment Variables (Vercel Dashboard)
Set all frontend variables in **Vercel → Project → Settings → Environment Variables**:

| Variable | Value |
|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Your Clerk publishable key |
| `VITE_API_URL` | Your backend server URL |

Backend environment variables must be configured on your backend host (Render/Railway).

### Deploy
```bash
# Push to main — Vercel auto-deploys
git push origin main
```

---

## 🔭 Future Roadmap

- [ ] **WebSocket Code Sync** — Real-time collaborative code editing using operational transforms or CRDTs (Yjs/Socket.io)
- [ ] **Voice Answer Recording** — Browser MediaRecorder API for verbal answer capture + Whisper transcription
- [ ] **Leaderboard** — Session completion stats and AI interview score rankings
- [ ] **Problem Bank Expansion** — Admin panel for adding DSA problems with test cases
- [ ] **Subscription Tiers** — Stripe integration for premium AI interview credits
- [ ] **Interview Replay** — Session recording and timestamped code diff replay

---

## 🏆 Engineering Highlights

This project demonstrates the following production engineering practices:

- ✅ **Layered service architecture** — strict separation of routing, business logic, and data access
- ✅ **Atomic operations with rollback** — Stream resource creation failures revert MongoDB state
- ✅ **Event-driven user sync** — Inngest background jobs decouple Clerk webhooks from API latency
- ✅ **Idempotent AI calls** — Feedback generation is safely re-entrant; won't duplicate LLM requests
- ✅ **Rate-limit-safe sequential processing** — Interview feedback fires one Groq request at a time
- ✅ **Typed error pipeline** — `CustomError` → `errorHandler` middleware enforces consistent error shape
- ✅ **Auth interceptor pattern** — Clerk JWT injected at the transport layer, not in every API call
- ✅ **Optimistic cache invalidation** — TanStack Query queries invalidated post-mutation for instant UI refresh
- ✅ **Production deployment automation** — Single `git push` triggers full build + CDN deployment

---

## 🧑‍💻 Author

**Kummara Vamsi**  
Full-Stack Developer · [@vamsi2246](https://github.com/vamsi2246)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ for learning, collaboration, and interview excellence.</sub>
</div>
