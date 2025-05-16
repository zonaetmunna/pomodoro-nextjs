import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { verifyJWT } from './lib/utils';

// Define paths that do not require authentication
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/api/auth/login',
  '/api/auth/register',
];

// Check if the path is public
const isPublic = (path: string) => {
  return publicPaths.find(x =>
    path.startsWith(x)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Check for token in cookie
  const token = request.cookies.get('token')?.value;

  // Redirect to login if no token
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = `redirectTo=${pathname}`;
    return NextResponse.redirect(url);
  }

  try {
    // Verify token
    await verifyJWT(token);
    return NextResponse.next();
  } catch (error) {
    // Token is invalid
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = `redirectTo=${pathname}`;
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    // Skip static files
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\.png$|.*\\.svg$).*)',
  ],
}; 