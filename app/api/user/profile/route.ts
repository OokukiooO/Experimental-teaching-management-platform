import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconn';
import User from '@/models/user';
import { getUserFromRequest, signToken } from '@/lib/auth';

export async function GET() {
  const authUser = await getUserFromRequest();
  if (!authUser) return NextResponse.json({ error: '未登录' }, { status: 401 });

  await dbConnect();
  const user = await User.findById(authUser.id).lean();
  if (!user) return NextResponse.json({ error: '用户不存在' }, { status: 404 });

  return NextResponse.json({
    profile: {
      id: String((user as any)._id),
      name: (user as any).name || '',
      email: (user as any).email || '',
      role: (user as any).role || 'admin',
      streamGatewayUrl: (user as any).streamGatewayUrl || '',
      databaseConfig: {
        uri: (user as any).databaseConfig?.uri || '',
        dbName: (user as any).databaseConfig?.dbName || '',
        user: (user as any).databaseConfig?.user || '',
        password: (user as any).databaseConfig?.password || '',
      }
    }
  });
}

export async function PUT(req: Request) {
  const authUser = await getUserFromRequest();
  if (!authUser) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const {
    name,
    email,
    streamGatewayUrl,
    databaseConfig,
  } = body || {};

  await dbConnect();

  const updatePayload: any = {};

  if (typeof name === 'string' && name.trim()) {
    const nextName = name.trim();
    const exists = await User.findOne({ name: nextName, _id: { $ne: authUser.id } });
    if (exists) {
      return NextResponse.json({ error: '用户名已存在' }, { status: 400 });
    }
    updatePayload.name = nextName;
  }

  if (typeof email === 'string') {
    updatePayload.email = email.trim();
  }

  if (typeof streamGatewayUrl === 'string') {
    updatePayload.streamGatewayUrl = streamGatewayUrl.trim();
  }

  if (databaseConfig && typeof databaseConfig === 'object') {
    updatePayload.databaseConfig = {
      uri: typeof databaseConfig.uri === 'string' ? databaseConfig.uri.trim() : '',
      dbName: typeof databaseConfig.dbName === 'string' ? databaseConfig.dbName.trim() : '',
      user: typeof databaseConfig.user === 'string' ? databaseConfig.user.trim() : '',
      password: typeof databaseConfig.password === 'string' ? databaseConfig.password.trim() : '',
    };
  }

  const updated = await User.findByIdAndUpdate(authUser.id, updatePayload, { new: true }).lean();
  if (!updated) return NextResponse.json({ error: '更新失败' }, { status: 400 });

  const userPayload = {
    id: String((updated as any)._id),
    name: (updated as any).name,
    role: (updated as any).role || 'admin',
  };

  const token = signToken(userPayload);
  const res = NextResponse.json({ ok: true, profile: updated });
  res.cookies.set('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 15 * 24 * 3600,
    path: '/',
  });
  return res;
}
