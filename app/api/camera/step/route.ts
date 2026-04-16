import { NextRequest, NextResponse } from 'next/server';

const FLASK_BASE = 'http://127.0.0.1:9000';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function proxyToFlask(req: NextRequest, path: string) {
  const query = req.nextUrl.searchParams.toString();
  const targetUrl = `${FLASK_BASE}${path}${query ? `?${query}` : ''}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      cache: 'no-store',
    });

    const raw = await response.text();
    const contentType = response.headers.get('content-type') || 'application/json; charset=utf-8';

    return new NextResponse(raw, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch {
    return NextResponse.json(
      {
        status: 'error',
        message: '算法引擎连接失败，请检查后端服务',
      },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  return proxyToFlask(req, '/camera/step');
}
