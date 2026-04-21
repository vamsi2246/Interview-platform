# Full Stack Interview Platform

A comprehensive, real-time interview platform designed to streamline the technical interview process. It provides a collaborative environment where interviewers and candidates can interact in real-time, featuring video and audio communication alongside a live coding editor. The platform is built around a layered, object-oriented backend architecture that cleanly separates concerns across controllers, services, and data models.

Live Application: https://interview-platform-sud3-git-main-vamsis-projects-362513cb.vercel.app

## Features

- **Live Coding Editor**: VSCode-like coding experience using Monaco Editor with real-time collaborative sync.
- **Remote Code Execution**: Securely run code in multiple languages (Python, Java, C++, JavaScript) via the Judge0 API, isolated from the host environment.
- **Video & Audio Calls**: High-quality integrated video conferencing powered by Stream SDK.
- **In-Call Chat**: Real-time text-based communication within the interview room using Stream Chat.
- **Authentication**: Secure, token-based user authentication and session management powered by Clerk.
- **Dashboard & Analytics**: Live interview statistics and historical session data surfaced through a clean React UI.
- **Modern UI**: Built with React, Tailwind CSS, and DaisyUI for a clean, responsive, and accessible interface.
- **Database**: Flexible schema and persistent storage using MongoDB and Mongoose with well-defined model classes.

## Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS & DaisyUI
- Monaco Editor (Code Editor)
- Stream Video React SDK & Stream Chat React
- Clerk (Authentication)
- React Router (Routing)
- React Query (Data Fetching)
- Zustand / Context API (State Management)

### Backend
- Node.js & Express.js (TypeScript)
- MongoDB & Mongoose (Database & ORM)
- Clerk Express (Authentication Middleware)
- Stream SDK (Video & Chat backend tokens/management)
- Inngest (Background jobs/webhooks processing)
- Judge0 API (Sandboxed code execution)

## Architecture & Design Principles

The backend follows a strict layered architecture with a clear separation of concerns, making the codebase maintainable, testable, and easy to extend.

### Folder Structure (Backend)
```
backend/src/
  config/        - Environment configuration and database connection setup
  controllers/   - Request handlers; receive HTTP input and delegate to services
  services/      - Core business logic; orchestrate data access and external APIs
  models/        - Mongoose model definitions with typed schemas
  routes/        - Express route declarations mapping endpoints to controllers
  middlewares/   - Cross-cutting concerns: authentication guard, global error handler
  interfaces/    - TypeScript interfaces defining contracts between layers
  utils/         - Shared utility helpers and formatting functions
  lib/           - Third-party client initialisation (Stream, Inngest)
```

### Key Engineering Decisions

**Separation of Concerns** — Controllers handle only request/response translation. All business rules live in the service layer, which remains completely independent of HTTP concerns.

**TypeScript throughout** — Every module is written in TypeScript with explicit interfaces for request and response shapes, enforcing type safety across the controller-service-model boundary.

**Model-driven Data Layer** — Mongoose schemas are defined as typed classes with static helper methods, encapsulating all database access logic within the model layer rather than scattering raw queries through the codebase.

**Centralised Error Handling** — A single `errorHandler` middleware at the end of the middleware chain captures all thrown errors, standardises the response shape, and prevents implementation details from leaking to clients.

**Middleware composition** — Authentication (`protectRoute`) is applied as a reusable middleware, keeping route definitions clean and the auth logic in a single place.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB instance (local or Atlas)
- Clerk Account (for authentication)
- Stream Account (for video and chat features)

### Environment Variables

You will need to set up environment variables for both the frontend and backend.

#### Frontend (`frontend/.env.local` or `frontend/.env`)
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_STREAM_API_KEY=your_stream_api_key
```

#### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
```

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Interview-platform
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server:**
   Open a terminal, navigate to the `backend` directory, and run:
   ```bash
   npm run dev
   # The server will start (e.g., http://localhost:5000)
   ```

2. **Start the Frontend Server:**
   Open another terminal, navigate to the `frontend` directory, and run:
   ```bash
   npm run dev
   # The application will be available at http://localhost:5173
   ```

## Application Architecture

- **Client Layer:** React application handling the UI, Monaco Editor, and Stream WebRTC streams.
- **API Server:** Node.js/Express server (TypeScript) that handles room management, generates Stream tokens, processes webhooks via Inngest, proxies code execution requests to Judge0, and validates all requests via Clerk middleware.
- **Data Layer:** MongoDB, accessed through typed Mongoose models, stores user data, interview sessions, rooms, and metadata.

## Scripts

### Frontend (`frontend`)
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Runs ESLint for code formatting.
- `npm run preview`: Previews the production build locally.

### Backend (`backend`)
- `npm run dev`: Starts the server in development mode using ts-node / Nodemon.
- `npm run start`: Starts the compiled server using Node.

## License
ISC
