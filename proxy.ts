import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    '/',
    '/hotel-details/:id',
    '/api/uploadthing',
    '/sign-in',
    '/sign-up',
    '/book-stay',
    '/search',
]);

export default clerkMiddleware(async (auth, request) => {
    // Add security headers
    const response = NextResponse.next();
    
    // Security headers for production
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set(
        'Permissions-Policy',
        'geolocation=(), microphone=(), camera=()'
    );

    // Protect non-public routes
    if (!isPublicRoute(request)) {
        await auth.protect();
    }

    return response;
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};