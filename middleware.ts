import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('🔒 [MIDDLEWARE] Running for path:', request.nextUrl.pathname);

  // Allow access to login page
  if (request.nextUrl.pathname === '/login') {
    console.log('✅ [MIDDLEWARE] Allowing login page');
    return NextResponse.next();
  }

  // Check for auth cookie
  const authCookie = request.cookies.get('tier1-auth');
  const expectedHash = process.env.PASSWORD_HASH;

  console.log('🍪 [MIDDLEWARE] Cookie:', authCookie ? 'EXISTS' : 'MISSING', '| Expected:', expectedHash);

  if (!authCookie || authCookie.value !== expectedHash) {
    console.log('🚫 [MIDDLEWARE] REDIRECTING TO /login');
    // Redirect to login page
    return NextResponse.redirect(new URL('/login', request.url));
  }

  console.log('✅ [MIDDLEWARE] Allowing authenticated request');
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except login, api, and static files
     */
    '/((?!api|login|_next|favicon.ico|sitemap.xml|robots.txt).*)',
    '/',
  ],
};
