'use client'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { logout } from '@/lib/auth-functions'
import { toast } from 'sonner';
import { dataForHomePage, infoUser } from '@/lib/auth-utils-client'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useCheckAndRedirectIfLoggedIn } from '@/hooks/useAuthRedirectClient'


export default function HomePage() {

  useCheckAndRedirectIfLoggedIn();

  const [pending, setPending ] = useState(true);
  const [user, setUser ] = useState<infoUser | null>(null);

  useEffect(() => {
    async function fetchData(){
      try{
        const userData = await dataForHomePage();
        setUser(userData);
      }
      catch (error){
      }
      setPending(false);
    }

    fetchData();
  }, []);

  // Show loading indicator while fetching user profile data
  if (pending){
      return <div className='flex flex-col items-center justify-center min-h-screen'>Loading...</div>;
    }

  if (!user){
    // Display fallback UI with refresh button when user data is null.
      return ( 
        <>
      <div className='flex flex-col items-center justify-center min-h-screen gap-2'>
        <h1>No user data available</h1>

        <Button className='flex flex-col items-center justify-center cursor-pointer'
                onClick={() => window.location.reload()}>
          Refrech
        </Button>
      </div>
      </>
      );
  }
    

  return (
    <>
    <ThemeToggle />
    <div className='flex flex-col items-center justify-center min-h-screen transition-all duration-300 text--black dark:text-white p-24 dark:bg-testbackground'>
        <h1 className='text-4xl font-bold mb-4'>
          Welcome 
          <span className='text-purple-600'>{' '} {user?.first_name ? user?.first_name.charAt(0).toUpperCase() + user?.first_name.slice(1).toLowerCase() :  'Error Fetching the t'} {' '}</span> 
          <span className='text-green-600 uppercase'>{user?.last_name.toUpperCase() || 'Error Fetching the Table'}{' '}</span>
          to the Home Page!</h1>
          <p className='text-lg'>Full Name : {user?.full_name}</p>
          <p className='text-lg'>First Name : {user?.first_name} </p>
          <p className='text-lg'>Last Name : {user?.last_name} </p>
          <p className='text-lg'>Username : {user?.username} </p>
          <p className='text-lg'>Email : {user?.email} </p>
        <p className='text-lg'>You are successfully logged in.</p>
        <Button className='mt-6' onClick={() => logout()}>
            Logout
        </Button>
    </div>
    </>
  )
}

