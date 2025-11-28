'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState, useActionState } from "react";
import { checkAvailabilityUsername, signup } from '@/lib/auth-functions';
import { toast } from 'sonner';


const SignupForm = () => {

    // Checking username status.
    const [isUsernameChecking, setIsUsernamChecking] = useState(false);
    // To show the username if its available or not.
    const [usernameMessage, setUsernameMessage] = useState<boolean | null>(null);
    const [ state, formAction, isPending ] = useActionState(signup, null);
    // To save the username.
    const [ chosenUsername, setChosenUsername ] = useState<string>('');


    useEffect(() => {
        if ( isUsernameChecking){

            toast.error('Please wait while we check username availability');

        } else if ( state?.error ){

            toast.error("Error", {
                description: state.error
              });

        }else if (state?.success) {
            toast.success("Welcome.", {
                description: "Check your email for a confirmation link to activate your account."
              });
        }
    }, [state]);


    useEffect(() => {
        if ( chosenUsername.length >= 5 ){
            const Timer = setTimeout( async() => {
                setIsUsernamChecking(true);
                // The function to check the username if its available or not (return true or false).
                await handleUsernameAvailability(chosenUsername);
                setIsUsernamChecking(false);
            },500); // The timer to wait 0.5-second before checking.
            return () => clearTimeout(Timer);

        }
        
    }, [chosenUsername]);


    function handleChosenUsername(e: React.ChangeEvent<HTMLInputElement>){
        // To save the username from the html input.
        // Also it will be in lowerCase.
        setChosenUsername(e.target.value.toLowerCase());
    }

    async function handleUsernameAvailability(username: string) {
        // The function to check the username in the database.
        const result = await checkAvailabilityUsername(username);
        if (result){
            setUsernameMessage(true);
        }else {
            setUsernameMessage(false);
        }
        
    }
   

  return (
    <>
    {/* the Card Start From Here */}
    <Card className='w-full max-w-md shadow-lg transition-all duration-300'>
        <CardHeader>
            {/* This is a Title of the form */}
            <CardTitle className='text-2xl font-bold text-center justify-center'>
                Sign UP
            </CardTitle>
        </CardHeader>
        <CardContent>
            {/* The start of the form */}
            <form action={formAction}>
                <div className='grid gap-4'>

                    {/* This is the div for the First & Last name to be on the same line */}
                        <div className='grid grid-cols-2 gap-4'>


                            {/* This is the div for the First Name */}
                            <div className='grid gap-2'>
                            <Label htmlFor='first_name'>
                            First Name 
                            </Label>
                            <Input 
                            id='first_name'
                            name='first_name'
                            placeholder='Omran'
                            disabled={isPending}
                            defaultValue={state?.input?.first_name}
                            required
                            />
                            </div>

                            {/* This is the div for the Last Name */}
                            <div className='grid gap-2'>
                            <Label htmlFor='last_name'>
                            Last Name
                            </Label>
                            <Input 
                            id='last_name'
                            name='last_name'
                            placeholder='SOLIMAN'
                            disabled={isPending}
                            defaultValue={state?.input?.last_name}
                            required
                            />
                           </div>

                        
                        </div>


                        {/* This is the div for the Username */}
                    <div className='grid gap-2'>
                        <Label htmlFor='username'>
                            Username
                        </Label>
                        <Input
                        id="username"
                        name="username"
                        value={chosenUsername}
                        placeholder='Username'
                        disabled={isPending}
                        onChange={handleChosenUsername}
                        required
                        onKeyDown={(e) => {
                            if (e.key === ' '){
                                e.preventDefault();
                            }
                        }}
                        />
                        {isUsernameChecking && (<span className='text-sm text-gray-500'>Checking username...</span>)
                        ||
                        !isUsernameChecking && usernameMessage !== null && chosenUsername.length >= 5 &&(
                            usernameMessage ? 
                            (<p className='text-sm text-green-500'>Username is available!</p>)
                            :
                            (<p className='text-sm text-red-500'>Username is already taken</p>
                            )
                            )}
                    </div>

                    {/* This is the div for the Email */}
                    <div className='grid gap-2'>
                        <Label htmlFor='email'>
                            Email
                        </Label>
                        <Input
                        id="email"
                        name="email"
                        type='email'
                        placeholder='example@email.com'
                        disabled={isPending}
                        defaultValue={state?.input?.email}
                        required
                        />
                    </div>

                    {/* This is the div for the Password */}
                    <div className='grid gap-2'>
                        <Label htmlFor='password'>
                            Password
                        </Label>
                        <Input
                        id="password"
                        name='password'
                        type='password'
                        placeholder='****'
                        disabled={isPending}
                        required
                        />
                    </div>

                    {/* This is the submit button (Signup) */}
                    <Button 
                            type="submit" 
                            className='w-full cursor-pointer '
                            disabled={isPending}
                        >
                             {isPending ? "Creating an account..." : "Create an account"}
                        </Button>
                </div>
                


            </form>
        </CardContent>


        {/* This is the div for login */}
        <div className='text-sm text-center justify-center text-muted-foreground transition-all duration-300'>
            Already have an account? {" "}
            <Link href="/login" className='underline cursor-pointer'>
            Login
            </Link>
        </div>
    </Card>

    {/* This is the text to go back home */}
<Link href="/" className="flex w-full  mt-4 items-center justify-center text-sm text-muted-foreground transition-all duration-300 cursor-pointer">  ← Back to Home</Link>
    </>
  )
}

export default SignupForm