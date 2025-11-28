'use client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useState, useEffect, useActionState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner';
import { useRouter } from 'next/navigation'
import { updateNewPassword } from '@/lib/auth-functions'

export default function UpdatePasswordForm() {

  const router = useRouter();
    const [ state, formAction, isPending ] = useActionState(updateNewPassword, null);

    useEffect(() => {
        if (state?.success){
            toast.success("Password updated!", {
                description: "Redirecting to Home...",
              });
              // Will redirect the user to the home page after successful paswword update.
              router.push("/home");
        } else if (state?.error) {
            toast.error("Failed", {
              description: state.error,
            });
          }
        }, [state, router]);


  return (
    <Card className='w-full max-w-md transition-all duration-300 shadow-lg'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold text-center'>
          Set New Password
        </CardTitle>
        <CardDescription className='text-center'>
          Enter your new password below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <div className="grid gap-4">

            {/* New Password Input */}
            <div className='grid gap-2'>
              <Label htmlFor='password'>New Password</Label>
              <Input 
                type='password' 
                id='password' 
                name='password'
                placeholder='Enter new password'
                disabled={isPending}
                // Minimum password length is 8 characters.
                minLength={8} 
                required 
              />
            </div>

            {/* This is the div for the Confirm Password */}
            <div className='grid gap-2'>
              <Label htmlFor='confirm_password'>Confirm Password</Label>
              <Input 
                type='password' 
                id='confirm_password' 
                name='confirm_password'
                placeholder='Confirm new password'
                disabled={isPending}
                // Minimum password length is 8 characters.
                minLength={8}
                required 
              />
            </div>

            <Button type="submit" className='w-full' disabled={isPending}>
              {isPending ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}