import { useUser } from '@clerk/clerk-react';
import HomePage from './pages/HomePage.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import Problemspage from './pages/Problemspage.jsx';
import { Toaster } from "react-hot-toast"
import dashboardPage from './pages/dashboardPage.jsx'

function App() {
  const { isSignedIn,isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <>
      <Routes>
        <Route path="/" element={!isSignedIn?<HomePage />:<Navigate to={"/dashboard"}/>}/>
        <Route path="/dashboard" element={isSignedIn?<dashboardPage />:<Navigate to={"/"}/>}/>
        <Route path="/problems" element={isSignedIn ? <Problemspage /> : <Navigate to={"/"} />} />
      </Routes>

      <Toaster position="top-right" />
    </>

  )
}

export default App
