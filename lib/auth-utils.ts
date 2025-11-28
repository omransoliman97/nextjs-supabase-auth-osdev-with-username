import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

// Prevent access to certain pages (Server-side).
export async function checkAndRedirectIfLoggedIn(): Promise<void> {

    // Check if user is already logged in (Server-side)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    // User is already logged in, redirect to home
    redirect('/home');
  }
    
}
