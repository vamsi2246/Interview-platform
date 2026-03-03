# Full Stack Interview Platform

A comprehensive, real-time interview platform designed to streamline the technical interview process. It provides a collaborative environment where interviewers and candidates can interact in real-time, featuring video and audio communication alongside a live coding editor.

## Features

- **Live Coding Editor**: VSCode-like coding experience using Monaco Editor.
- **Video & Audio Calls**: High-quality integrated video conferencing powered by Stream SDK.
- **In-Call Chat**: Real-time text-based communication within the interview room using Stream Chat.
- **Authentication**: Secure user authentication and management powered by Clerk.
- **Modern UI**: Built with React, Tailwind CSS, and DaisyUI for a clean, responsive, and accessible interface.
- **Database**: Flexible schema and persistent storage using MongoDB and Mongoose.

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
- Node.js & Express.js
- MongoDB & Mongoose (Database & ORM)
- Clerk Express (Authentication Middleware)
- Stream SDK (Video & Chat backend tokens/management)
- Inngest (Background jobs/webhooks processing)

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
   cd IPproject
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
- **API Server:** Node.js/Express server that handles room management, generates Stream tokens, handles webhooks via Inngest, and validates requests via Clerk middleware.
- **Data Layer:** MongoDB stores user data, interview history, rooms, and metadata.

## Scripts

### Frontend (`frontend`)
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Runs ESLint for code formatting.
- `npm run preview`: Previews the production build locally.

### Backend (`backend`)
- `npm run dev`: Starts the server in development mode using Nodemon.
- `npm run start`: Starts the server using Node.

## License
ISC
