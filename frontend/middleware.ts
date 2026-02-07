import { NextRequest, NextResponse } from 'next/server';

// List of protected routes that require authentication
const protectedRoutes = ['/tasks'];

/**
 * Check if a JWT token is expired (server-side version)
 */
function isTokenExpired(token: string): boolean {
  try {
    // JWT structure: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return true; // Invalid token format
    }

    // Decode payload (base64url)
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));

    if (!payload.exp) {
      return true; // No expiration time
    }

    // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error validating token:', error);
    return true; // If we can't parse it, consider it invalid
  }
}

export function middleware(request: NextRequest) {
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Check for authentication token
    const token = request.cookies.get('auth_token')?.value ||
                  request.headers.get('authorization')?.replace('Bearer ', '');

    // If no token or token is expired, redirect to sign-in
    if (!token || isTokenExpired(token)) {
      // Store the attempted URL for redirect after login
      const requestedUrl = request.url;
      const encodedUrl = encodeURIComponent(requestedUrl);

      // Clear the invalid cookie
      const response = NextResponse.redirect(
        new URL(`/auth/signin?callbackUrl=${encodedUrl}`, request.url)
      );
      response.cookies.delete('auth_token');

      return response;
    }
  }

  // For auth pages, redirect to tasks if already authenticated with VALID token
  if (request.nextUrl.pathname.startsWith('/auth')) {
    // Skip logout page - let it clear auth data
    if (request.nextUrl.pathname === '/auth/logout') {
      return NextResponse.next();
    }

    const token = request.cookies.get('auth_token')?.value ||
                  request.headers.get('authorization')?.replace('Bearer ', '');

    // Only redirect if token exists AND is valid
    if (token && !isTokenExpired(token) &&
        (request.nextUrl.pathname === '/auth/signin' ||
         request.nextUrl.pathname === '/auth/register')) {
      return NextResponse.redirect(new URL('/tasks', request.url));
    }

    // If token exists but is expired, clear it
    if (token && isTokenExpired(token)) {
      const response = NextResponse.next();
      response.cookies.delete('auth_token');
      return response;
    }
  }

  return NextResponse.next();
}

// Apply middleware to specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};