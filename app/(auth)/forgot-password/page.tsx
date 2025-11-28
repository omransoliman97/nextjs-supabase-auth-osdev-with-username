import { ThemeToggle } from '@/components/ThemeToggle'
import RequestResetForm from '@/components/RequestResetForm'
import { checkAndRedirectIfLoggedIn } from '@/lib/auth-utils'

export default async function ForgotPasswordPage() {

  // This function make sure the user not logged in, if logged in will redirect to home
   await checkAndRedirectIfLoggedIn();


  return (
    <>
    {/* This is the main page of Forgot Password */}

    {/* This is the Toggle Theme */}
    <ThemeToggle />

    {/* This is the div for the Request Reset Form */}
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <RequestResetForm />

    </div>
    </>
  );
}