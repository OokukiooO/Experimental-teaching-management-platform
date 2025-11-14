import { NextResponse } from 'next/server';
import { generateCaptcha } from '@/lib/auth';

// 强制动态与禁用静态缓存
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const { id, data } = generateCaptcha();
  return NextResponse.json(
    { id, svg: data },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'CDN-Cache-Control': 'no-store',
        'Vercel-CDN-Cache-Control': 'no-store',
      },
    }
  );
}