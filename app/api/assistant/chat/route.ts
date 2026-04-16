import { NextRequest, NextResponse } from 'next/server';
import { qfChat } from '@/lib/qianfan';

export async function POST(req: NextRequest){
  try{
    const body = await req.json();
    const messages = Array.isArray(body?.messages)? body.messages: [];
    const result = await qfChat({ messages });
    return NextResponse.json({ reply: result.reply });
  }catch(e:any){
    const raw = e?.message ?? e?.error ?? e;
    const errorText = typeof raw === 'string' ? raw : JSON.stringify(raw);
    return NextResponse.json({ error: errorText || '调用失败' }, { status: 500 });
  }
}
