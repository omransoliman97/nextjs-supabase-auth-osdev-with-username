import { ThemeToggle } from '@/components/ThemeToggle'
import UpdatePasswordForm from '@/components/UpdatePasswordForm'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation';


export default async function UpdatePasswordPage() {


  const supabase = await createClient();

  // The callback gives the user access to this page .
  const { data: { user } } = await supabase.auth.getUser();

  if ( !user ){
    // If the user not has the access will redirect to "/error" page with a parameter "message".
    redirect('/error?message=Invalid verification');
  }


  return (
    <>
    {/* This is the main page of Update Password */}

    {/* This is the Toggle Theme */}
    <ThemeToggle />

    {/* This is the div for the Update Password Form */}
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <UpdatePasswordForm />

    </div>
    </>
  );
}