import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow access to login page and admin dashboard
  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Check for auth cookie
  const authCookie = request.cookies.get('tier1-auth');
  const expectedHash = process.env.PASSWORD_HASH;

  if (!authCookie || authCookie.value !== expectedHash) {
    // Redirect to login page
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except login, admin, api, and static files
     */
    '/((?!api|admin|login|_next|favicon.ico|sitemap.xml|robots.txt).*)',
    '/',
  ],
};
