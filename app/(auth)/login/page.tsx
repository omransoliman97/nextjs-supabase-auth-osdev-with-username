import { ThemeToggle } from '@/components/ThemeToggle';
import LoginForm from '@/components/LoginForm'
import { checkAndRedirectIfLoggedIn } from '@/lib/auth-utils';

export default async function LoginPage() {

  // This function make sure the user not logged in, if logged in will redirect to home
  await checkAndRedirectIfLoggedIn();

  return (
    <>
    {/* This is the main page of login */}

    {/* This is the Toggle Theme */}
    <ThemeToggle />

    {/* This is the div for the LoginForm */}
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <LoginForm />
    </div>
    </>
  );
}
