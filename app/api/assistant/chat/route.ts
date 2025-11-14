import { NextRequest, NextResponse } from 'next/server';
import { qfChat } from '@/lib/qianfan';

export async function POST(req: NextRequest){
  try{
    const body = await req.json();
    const messages = Array.isArray(body?.messages)? body.messages: [];
    const result = await qfChat({ messages });
    return NextResponse.json({ reply: result.reply });
  }catch(e:any){
    return NextResponse.json({ error: e.message || '调用失败' }, { status: 500 });
  }
}
