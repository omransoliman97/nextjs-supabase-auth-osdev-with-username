import { NextResponse, type NextRequest } from "next/server"
import { updateSession } from "@/utils/supabase/middleware"

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);



  // Public routes
  const publicUrls = [ 
    '/forgot-password', 
    '/login', 
    '/signup', 
    '/', 
    '/auth/callback',
    '/auth/confirm',  
    '/auth/confirmed', 
    '/auth/auth-code-error',
    '/error',  
    '/update-password'  
  ];
  const path = request.nextUrl.pathname;


  if ( publicUrls.includes(path)){
    return response;
  }


  return response;

  //return await updateSession(request)
}



export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}