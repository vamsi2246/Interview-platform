import { SignedIn, SignedOut, SignInButton, SignOutButton } from '@clerk/clerk-react'
import React from 'react'
import { Toaster  } from 'react-hot-toast'

const HomePage = () => {
                                                 
  return (
    <>
      
      <button className='btn btn-secondary' onClick={()=>toast.success("This is a success toast")}>Click Me</button>
      
      <SignedOut>
        <SignInButton>
            <button>Login</button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <SignOutButton/>
      </SignedIn>

      <UserButton/>
      
    </ > 
    
  )
}

export default HomePage