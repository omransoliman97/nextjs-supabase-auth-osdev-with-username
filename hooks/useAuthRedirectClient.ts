import { useRouter } from "next/navigation";
import { createClient } from '@/utils/supabase/client';
import { useEffect } from "react";


// Prevent access to certain pages 'Client-Side'.
export function useCheckAndRedirectIfLoggedIn(){
    const router = useRouter();

    useEffect(() => { 
        async function checkAccess(){

            // Check if user is already logged in (Client-side)
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user){
              router.push('/');
            }
        }

        checkAccess();
    },[router]);
  }