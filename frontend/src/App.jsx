import { useUser, useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import HomePage from './pages/HomePage.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProblemsPage from './pages/ProblemsPage.jsx';
import { Toaster } from "react-hot-toast"
import DashboardPage from './pages/DashboardPage.jsx'
import ProblemPage from './pages/ProblemPage.jsx'
import SessionPage from './pages/SessionPage.jsx'
import { setClerkGetToken } from './lib/axios';

function App() {
  const { isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();

  // Wire up Clerk auth token to axios
  useEffect(() => {
    setClerkGetToken(getToken);
  }, [getToken]);

  if (!isLoaded) return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );

  return (
    <>
      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />
        <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
        <Route path="/problem/:id" element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
        <Route path="/session/:id" element={isSignedIn ? <SessionPage /> : <Navigate to={"/"} />} />
      </Routes>

      <Toaster position="top-right" />
    </>

  )
}

export default App
