import { useUser } from '@clerk/clerk-react';
import HomePage from './pages/HomePage.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProblemsPage from './pages/ProblemsPage.jsx';
import { Toaster } from "react-hot-toast"
import DashboardPage from './pages/DashboardPage.jsx'

function App() {
  const { isSignedIn, isLoaded } = useUser();

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
      </Routes>

      <Toaster position="top-right" />
    </>

  )
}

export default App
