export interface QfChatReq { messages: { role:'user'|'assistant'|'system', content:string }[] }

export async function qfChat(req: QfChatReq){
  const API_KEY = process.env.QIANFAN_API_KEY;
  const APP_ID = process.env.QIANFAN_APP_ID;
  const BASE = process.env.QIANFAN_BASE_URL || 'https://qianfan.baidubce.com';
  const MODEL = process.env.QIANFAN_MODEL || 'ernie-speed-8k';
  if(!API_KEY) throw new Error('缺少 QIANFAN_API_KEY');

  // 文档为通用说明，具体路径以实际产品 API 为准；这里采用统一 chat api 路径示例
  const url = `${BASE}/v2/chat/completions`;
  const headers: Record<string,string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  };
  if (APP_ID) headers['appid'] = APP_ID;

  const body = JSON.stringify({ model: MODEL, messages: req.messages });
  const res = await fetch(url, { method:'POST', headers, body });
  let data:any = {};
  try{ data = await res.json(); }catch{ /* ignore */ }
  if(!res.ok){ throw new Error(data?.error || data?.message || `HTTP ${res.status}`); }
  // 兼容不同返回结构：取第一个候选或 content 字段
  const reply = data?.choices?.[0]?.message?.content || data?.result || '';
  return { reply };
}
