import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import User from '@/models/user';

// In-memory captcha store (id -> text), clears after verification or TTL
const captchaStore: Map<string, { text: string; expires: number }> = new Map();
const CAPTCHA_TTL_MS = 5 * 60 * 1000;

const JWT_SECRET = process.env.JWT_SECRET || 'dev-insecure-secret';
const JWT_EXPIRE_SECONDS = 15 * 24 * 3600; // 15 days

export interface AuthUserPayload {
  id: string;
  name: string;
  role: string;
}

export function signToken(user: AuthUserPayload) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRE_SECONDS });
}

export function verifyToken(token: string): AuthUserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUserPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(plain: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

export async function comparePassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

// 简易 SVG 验证码生成（避免外部依赖）
export function generateCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let text = '';
  for (let i = 0; i < 5; i++) text += chars[Math.floor(Math.random() * chars.length)];
  const id = Math.random().toString(36).slice(2, 12);
  captchaStore.set(id, { text: text.toLowerCase(), expires: Date.now() + CAPTCHA_TTL_MS });
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='40'>
    <rect width='120' height='40' fill='#f5f5f5'/>
    ${Array.from({length: 6}).map(()=>`<line x1='${Math.random()*120}' y1='${Math.random()*40}' x2='${Math.random()*120}' y2='${Math.random()*40}' stroke='#${Math.floor(Math.random()*999)}' stroke-width='1'/>`).join('')}
    <text x='10' y='28' font-size='24' font-family='monospace' fill='#333'>${text}</text>
  </svg>`;
  return { id, data: svg };
}

export function verifyCaptcha(id: string, input: string) {
  const item = captchaStore.get(id);
  if (!item) return false;
  captchaStore.delete(id); // one-time use
  if (Date.now() > item.expires) return false;
  return item.text === input.toLowerCase();
}

export async function getUserFromRequest(req?: NextRequest): Promise<AuthUserPayload | null> {
  try {
    const token = req ? req.cookies.get('token')?.value : cookies().get('token')?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

// Ensure default admin user exists
export async function ensureDefaultAdmin() {
  await import('@/lib/dbconn');
  const existing = await User.findOne({ name: 'admin' });
  if (existing) return existing;
  const passwordHash = await hashPassword('syjxb_GDUT');
  const user = await User.create({ name: 'admin', passwordHash, role: 'admin' });
  return user;
}

// Periodic cleanup of captcha store
setInterval(() => {
  const now = Date.now();
  for (const [id, v] of captchaStore.entries()) {
    if (v.expires < now) captchaStore.delete(id);
  }
}, 60 * 1000);

export async function authenticateCredentials(name: string, password: string) {
  await import('@/lib/dbconn');
  const user = await User.findOne({ name });
  if (!user) return null;
  // prefer passwordHash; fallback to legacy pwd
  const hash = (user as any).passwordHash || (user as any).pwd;
  if (!hash) return null;
  const ok = await comparePassword(password, hash);
  if (!ok) return null;
  return { id: user._id.toString(), name: user.name, role: user.role } as AuthUserPayload;
}
