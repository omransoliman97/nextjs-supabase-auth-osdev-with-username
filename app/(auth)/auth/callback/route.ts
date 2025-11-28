import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'


// This checks if the path is good. It must start with one "/".
// It also must not start with two "//".
const isValidRedirect = (path: string) => {
  return path.startsWith('/') && !path.startsWith('//')
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  // here where you should change the "/home" according to your project.
  const nextParam = searchParams.get('next') ?? '/home'
  const next = isValidRedirect(nextParam) ? nextParam : '/home'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error ){
      // Return the user to an "/error" page with a parameter "message" ( you should change it unless if the same ).
      return NextResponse.redirect(`${origin}/error?message=Invalid verification`)
    }
    if ( data.user) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}