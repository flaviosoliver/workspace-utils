import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('next-auth.session-token')?.value;

  if (!token || !verifyJwt(token)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const response = NextResponse.next();

  response.headers.set('Referrer-Policy', 'no-referrer');

  return response;
}

export const config = {
  matcher: ['/api/user/preferences', '/api/tasks', '/api/tasks/:path*'],
};
