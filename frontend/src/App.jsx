import { useUser } from '@clerk/clerk-react';
import HomePage from './pages/HomePage.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import Problemspage from './pages/Problemspage.jsx';
import { Toaster } from "react-hot-toast"

function App() {
  const { isSignedIn } = useUser();
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/problems" element={isSignedIn ? <Problemspage /> : <Navigate to={"/"} />} />
      </Routes>

      <Toaster position="top-right" />
    </>

  )
}

export default App
