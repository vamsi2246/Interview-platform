import { useState } from 'react'
import {SignedIn, SignedOut, SignInButton, SignOutButton, UserButton} from '@clerk/clerk-react'
import HomePage from './pages/HomePage.jsx';
import { Routes, Route } from 'react-router';
import AboutPage from './pages/AboutPage.jsx';  

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <h1 className='text-red-500'>Welocome to our App</h1>
      <button className='btn btn-secondary'>Click</button>
      {/* <SignedIn>
        <SignInButton />
      </SignedIn>

      <SignedOut>
        <SignInButton/>
      </SignedOut>

      <UserButton/> */}

      <Routes>
        <Route path="/" element={<h1 className='text-red-500'>Welcome to our App</h1>} />
        <Route path="/about" element={<h1>About Page</h1>} />
      </Routes>
    </Routes>
  )
}

export default App
