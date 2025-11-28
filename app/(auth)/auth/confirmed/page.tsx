'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/ThemeToggle';

export default function ConfirmedPage(){

  // The 5 for 5 seconds.
  const [ countdown, setCountdown ] = useState(5);
  const router = useRouter();

  // This is the counter, "1000" means each 1 second.
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => { return prev - 1;  });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if ( countdown <=1 ){
      router.push('/login');
    }
  }, [countdown, router]);

    


    
  return (
    <>
    <ThemeToggle />
    <div className='flex flex-col w-full min-h-screen items-center justify-center'>
        <h1 className='text-2xl font-bold'> Email Confirmed! 🎉</h1>
        <p> Your email has been successfully verified. You can now sign in to your account. </p>
        <p> Redirecting in {countdown} seconds..</p>


    </div>
    </>
  )
}
