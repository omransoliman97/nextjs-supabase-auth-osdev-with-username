import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // If user is logged in, redirect to home page
    redirect('/home');
  }

  return (
   <>
    <ThemeToggle />
    <div className="flex min-h-screen flex-col items-center justify-center p-24 text--black dark:text-white transition-all duration-300">
      <h1 className="text-4xl font-bold mb-8">Welcome to Next.js <span className="text-green-500">SUPABASE</span> Auth from <span className="text-purple-500">OSDEV</span></h1>
      <p className="mb-8 text-center max-w-2xl">
        This is a preconfigured Next.js project with Supabase authentication setup by OSDEV with username. You can use this as a starting point for your own projects.
      </p>
      <div className="flex space-x-6">
          
          <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition dark:bg-purple-500 dark:hover:bg-purple-600">
            <Link href="/signup"><b>Signup</b></Link>
          </button>
          <button className="px-6 py-3 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition dark:bg-gray-200 dark:text-black dark:hover:bg-gray-400">
            <Link href="/login"><b>Login</b></Link>
          </button>
          </div>
      
    </div>
    </>
  );
}
