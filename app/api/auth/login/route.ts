import { NextResponse } from 'next/server';
import { verifyCaptcha, authenticateCredentials, signToken, ensureDefaultAdmin } from '@/lib/auth';
import dbConnect from '@/lib/dbconn';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { username, password, captchaId, captcha } = body;
  if (!username || !password || !captchaId || !captcha) {
    return NextResponse.json({ error: '缺少参数', missing: {
      username: !username,
      password: !password,
      captchaId: !captchaId,
      captcha: !captcha,
    } }, { status: 400 });
  }
  const okCaptcha = verifyCaptcha(captchaId, captcha);
  if (!okCaptcha) {
    return NextResponse.json({ error: '验证码错误或过期' }, { status: 400 });
  }
  // 无数据库时，提供内置 admin 账号
  if (!process.env.MONGODB_URI) {
    if (username === 'admin' && password === 'syjxb_GDUT') {
      const token = signToken({ id: 'dev-admin', name: 'admin', role: 'admin' });
      const res = NextResponse.json({ user: { id: 'dev-admin', name: 'admin', role: 'admin' } });
      res.cookies.set('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 15 * 24 * 3600, path: '/' });
      return res;
    }
    return NextResponse.json({ error: '用户名或密码错误（开发模式）' }, { status: 401 });
  }

  // 显式建立数据库连接，避免 Mongoose buffering 超时
  try {
    await dbConnect();
  } catch (e:any) {
    return NextResponse.json({ error: '数据库连接失败', detail: e.message || String(e) }, { status: 500 });
  }

  await ensureDefaultAdmin();
  const user = await authenticateCredentials(username, password);
  if (!user) {
    return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });
  }
  const token = signToken(user);
  const res = NextResponse.json({ user });
  // 15 天 HttpOnly Cookie
  res.cookies.set('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 15 * 24 * 3600,
    path: '/',
  });
  return res;
}