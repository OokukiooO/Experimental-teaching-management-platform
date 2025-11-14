import { NextResponse } from 'next/server';
import { generateCaptcha } from '@/lib/auth';

export async function GET() {
  const { id, data } = generateCaptcha();
  return NextResponse.json({ id, svg: data });
}