import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconn';
import User from '@/models/user';
import { comparePassword, getUserFromRequest, hashPassword } from '@/lib/auth';

export async function PUT(req: Request) {
  const authUser = await getUserFromRequest();
  if (!authUser) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { oldPassword, newPassword } = body || {};

  if (!oldPassword || !newPassword) {
    return NextResponse.json({ error: '缺少参数' }, { status: 400 });
  }
  if (String(newPassword).length < 6) {
    return NextResponse.json({ error: '新密码长度至少 6 位' }, { status: 400 });
  }

  await dbConnect();
  const user: any = await User.findById(authUser.id);
  if (!user) return NextResponse.json({ error: '用户不存在' }, { status: 404 });

  const hash = user.passwordHash || user.pwd;
  if (!hash) return NextResponse.json({ error: '当前账号未设置密码' }, { status: 400 });

  const ok = await comparePassword(String(oldPassword), String(hash));
  if (!ok) return NextResponse.json({ error: '原密码错误' }, { status: 400 });

  user.passwordHash = await hashPassword(String(newPassword));
  user.pwd = undefined;
  await user.save();

  return NextResponse.json({ ok: true });
}
