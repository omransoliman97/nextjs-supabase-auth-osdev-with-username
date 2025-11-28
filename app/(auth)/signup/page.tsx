import React from 'react'
import SignupForm from '@/components/SignupForm'
import { ThemeToggle } from '@/components/ThemeToggle'
import { checkAndRedirectIfLoggedIn } from '@/lib/auth-utils'

export default async function SignupPage() {

  // This function make sure the user not logged in, if logged in will redirect to home
  await checkAndRedirectIfLoggedIn();

  return (
    <>
    {/* This is the main page of Signup */}

    {/* This is the Toggle Theme */}
    <ThemeToggle />

    {/* This is the div for the SignupForm */}
    <div className='flex min-h-screen flex-col items-center justify-center p-4'>
        <SignupForm />
    </div>
    </>
  );
}