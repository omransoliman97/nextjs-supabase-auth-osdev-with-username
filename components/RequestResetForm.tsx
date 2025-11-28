'use client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useEffect, useActionState, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { sendResetEmail } from '@/lib/auth-functions'
import { toast } from 'sonner';

export default function RequestResetForm() {


  const [ state, formAction, isPending ] = useActionState(sendResetEmail, null);

  useEffect(() => {
    if(state?.success){
      toast.success("If an account exists with this email, you will receive a password reset link shortly.");
    } else if (state?.error){
      toast.error("Error", {
        description: state.error
      });
    }

  }, [state]);

  return (
    <>
    <Card className='w-full max-w-md transition-all duration-300 shadow-lg'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold text-center justify-center'>
          Reset your password
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <div className='grid gap-4'>
            {/* This is the div for the Email */}
            <div className='grid gap-2'>
              <Label htmlFor="email">
              Enter your email : 
              </Label>
              <Input
              id="email"
              name="email"
              type="email"
              placeholder='example@email.com'
              disabled={isPending}
              required>
              </Input>

            </div>
            {/* This is the button for submit ( reset password) */}
            <Button type='submit' className='w-full cursor-pointer' disabled={isPending}>
              {isPending ? "Sending reset link..." : "Reset Password"}
            </Button>
            <p className='text-sm text-center mt-4 underline text-muted-foreground'><Link href="/login"> ← Back to Login</Link></p>


          </div>

        </form>
      </CardContent>

    </Card>
    {/* This is the text to go back home */}
    <Link href="/" className="flex w-full  mt-4 items-center justify-center text-sm text-muted-foreground transition-all duration-300">  ← Back to Home</Link>
    </>
  );
}