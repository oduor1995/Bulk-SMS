import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
 
// export default NextAuth(authConfig).auth;
 
// export const config = {
//   // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
//   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// };

// const secret = process.env.JWT_SECRET;

// export async function middleware(request:any) {
//   // Get the token from cookies
//   const token = request.cookies.get('token')?.value;

//   // Define the URL to redirect to if not authenticated
//   const loginUrl = new URL('/login', request.url);

//   // If no token is present, redirect to the login page
//   if (!token) {
//     return NextResponse.redirect(loginUrl);
//   }

//   try {
//     // Verify the token
//     await jwtVerify(token, new TextEncoder().encode(secret));
//     // Token is valid, allow the request to proceed
//     return NextResponse.next();
//   } catch (error) {
//     // Token is invalid, redirect to the login page
//     return NextResponse.redirect(loginUrl);
//   }
// }

// // Apply the middleware to specific paths
// export const config = {
//   matcher: '/protected/:path*', // Adjust the matcher as needed
// };
