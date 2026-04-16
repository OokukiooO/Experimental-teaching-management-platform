export interface QfChatReq { messages: { role:'user'|'assistant'|'system', content:string }[] }

export async function qfChat(req: QfChatReq){
  const API_KEY = process.env.QIANFAN_API_KEY;
  const APP_ID = process.env.QIANFAN_APP_ID;
  const BASE = process.env.QIANFAN_BASE_URL || 'https://qianfan.baidubce.com';
  const MODEL = process.env.QIANFAN_MODEL || 'ernie-speed-8k';
  if(!API_KEY){
    return { reply: '当前未配置大模型服务密钥（QIANFAN_API_KEY）。这是本地演示回复：可先完成排课条件填写，我可以协助你生成候选排课方案。' };
  }

  const url = `${BASE}/v2/chat/completions`;
  const headers: Record<string,string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  };
  if (APP_ID) headers['appid'] = APP_ID;

  const fallbackModels = Array.from(new Set([
    MODEL,
    'ernie-speed-8k',
    'ernie-speed-128k',
    'ernie-lite-8k',
    'ernie-4.0-8k-latest',
  ])).filter(Boolean);

  const isModelAccessError = (msg: string) => {
    const text = (msg || '').toLowerCase();
    return text.includes('model does not exist')
      || text.includes('do not have access')
      || text.includes('invalid model')
      || text.includes('model not found');
  };

  let lastErr = '';

  for (const model of fallbackModels) {
    const body = JSON.stringify({ model, messages: req.messages });
    const res = await fetch(url, { method:'POST', headers, body });
    let data:any = {};
    try{ data = await res.json(); }catch{ /* ignore */ }

    if(res.ok){
      const reply = data?.choices?.[0]?.message?.content || data?.result || '';
      if (reply) return { reply };
      return { reply: '模型已响应，但未返回有效文本内容。' };
    }

    const apiError = data?.error;
    const msg = typeof apiError === 'string'
      ? apiError
      : (apiError?.message || data?.message || `HTTP ${res.status}`);
    lastErr = msg;

    if (!isModelAccessError(msg)) {
      throw new Error(msg);
    }
  }

  return {
    reply: `当前账号对已配置模型无访问权限，或模型名称不可用。建议在 .env.local 中设置可用的 QIANFAN_MODEL 后重试。系统提示：${lastErr}`
  };
}
