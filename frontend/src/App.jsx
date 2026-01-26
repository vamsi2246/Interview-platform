import { useState } from 'react'
import {SignedIn, SignedOut, SignInButton, SignOutButton, UserButton} from '@clerk/clerk-react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Welocome to our App</h1>
    
      <SignedIn>
        <SignInButton />
      </SignedIn>

      <SignedOut>
        <SignInButton/>
      </SignedOut>

      <UserButton/>
    </>
  )
}

export default App
