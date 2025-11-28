'use client';
import { 
    Card, 
    CardContent, 
    CardHeader,
    CardTitle,  } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect, useActionState } from 'react';
import { login, signInWithGoogle, signInWithFacebook, 
    signInWithGithub, signInWithApple, signInWithTwitter, 
    signInWithLinkedIn, signInWithDiscord, signInWithSpotify, 
    signInWithTwitch, signInWithSlack, signInWithAzure, 
    signInWithBitbucket } from "@/lib/auth-functions";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'
import ProvidersButtons  from '@/components/ProvidersButtons'



const LoginForm = () => {

    const router = useRouter();
    const [ state, formAction, isPending ] = useActionState(login, null);

    
    useEffect(() => {
        if (state?.success){
            toast.success("Login successful!", {
                description: "Redirecting to Home...",
              });
              // This will redirect the user to the home page after successful authentication.
              router.push("/home");
        } else if (state?.error) {
            toast.error("Login failed", {
              description: state.error,
            });
          }
        }, [state, router]);


  return (
    <>
    {/* the Card Start from here */}
        <Card className='w-full max-w-md transition-all duration-300 shadow-lg'>
            <CardHeader >
                {/* This is a title of the form */}
                <CardTitle className='text-2xl font-bold text-center justify-center'>Login</CardTitle>
            </CardHeader>
            <CardContent>
                {/* The start of the form */}
                <form action={formAction}>
                    <div className="grid gap-4">
                        
                        {/* This is the div for the Email */}
                        <div className='grid gap-2'>
                            <Label htmlFor='email'>Email</Label>
                            <Input 
                            type='email' 
                            id='email' 
                            name='email'
                            placeholder='example@example.com'
                            disabled={isPending}
                            required />
                        </div>
                        {/* This is the div for the Password */}
                        <div className='grid gap-2'>
                            <div className='flex items-center justify-between'>
                                <Label htmlFor='password'>Password</Label>
                                <Link href='/forgot-password' className='text-sm ml-auto underline text-muted-foreground'>
                                    Forgot your password? 
                                </Link>
                            </div>
                            <Input 
                            type='password' 
                            id='password' 
                            name='password'
                            placeholder='********'
                            disabled={isPending}
                            required />
                        </div>

                        {/* This is the submit button (Login) */}
                        <Button type="submit" className='w-full cursor-pointer' disabled={isPending}>
                            {isPending ? "Logging in..." : "Login"}
                        </Button>


                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Or continue with
                            </span>
                            </div>
                        </div>

                        {/* This is the alternative login method. (You can also move the buttons here—everything will work as expected. Dev note: The components are already imported.)*/}
                        <ProvidersButtons />

                        {/* This is the <div> for the alternate login type. It displays 4 buttons per column—you can change the number "4" to whatever you prefer. */}
                        <div className='grid grid-cols-4 gap-2'>
                        
                        </div>

                        {/* This is the text for the signup */}
                        <p className='text-sm text-center text-muted-foreground transition-all duration-300'>Don't have an account? <Link href='/signup' className='underline'>Sign up</Link></p>
                    </div>
                </form>
            </CardContent>
        </Card>
        {/* This is the text to go back home */}
        <Link href="/" className="flex  mt-4 items-center justify-center text-sm text-muted-foreground transition-all duration-300">  ← Back to Home</Link>
    </>
  )
}

export default LoginForm