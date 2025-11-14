import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 需要保护的路径前缀
const PROTECTED_PREFIX = [
  '/(dashboard)/dashboard',
  '/(dashboard)/event',
  '/(dashboard)/live',
  '/(dashboard)/config',
  '/(dashboard)/assistant',
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // 中间件只由 matcher 触发，这里冗余检查一次路径前缀
  const isProtected = PROTECTED_PREFIX.some((p) => pathname.startsWith(p.replace('/(dashboard)', '')) || pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get('token')?.value;
  if (token) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = '/login';
  url.searchParams.set('next', pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/event/:path*',
    '/live/:path*',
    '/config/:path*',
  '/assistant/:path*',
  ],
};