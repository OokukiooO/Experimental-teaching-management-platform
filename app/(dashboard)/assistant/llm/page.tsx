"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Tag, message, Spin } from 'antd';

export default function LLMPage(){
  const [items, setItems] = useState<{role:'user'|'assistant', content:string}[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{ listRef.current?.scrollTo(0, listRef.current.scrollHeight); }, [items]);

  const guideQuestions = [
    '下周三下午两个小时的空教室有哪些？',
    '请给出机器视觉实验课的排课建议。',
    '帮我检查本周是否存在实验室排课冲突。',
    '如何提高实验室设备利用率？',
  ];

  const send = async ()=>{
    if(!text.trim() || sending) return;
    const userMsg = { role:'user' as const, content: text };
    setItems(prev=> [...prev, userMsg]);
    setText('');
    setSending(true);
    try{
      const res = await fetch('/api/assistant/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ messages: [...items, userMsg] }) });
      const data = await res.json();
      if(!res.ok){
        const raw = data?.error;
        const text = typeof raw === 'string' ? raw : (raw?.message || '请求失败');
        throw new Error(text);
      }
      setItems(prev=> [...prev, { role:'assistant', content: data.reply || '' }]);
    }catch(e:any){
      const text = typeof e?.message === 'string' ? e.message : '请求失败';
      message.error(text);
    } finally {
      setSending(false);
    }
  };

  const sendGuideQuestion = (question: string) => {
    setText(question);
  };

  return (
    <div className="space-y-4">
      <div className="ui-surface p-5">
        <h2 className='ui-title text-xl font-semibold text-slate-800'>大模型概览 / 对话助手</h2>
        <p className='mt-1 text-sm text-slate-500'>支持自然语言提问、多轮连续对话与教学场景问答辅助。</p>
      </div>

      <div className="ui-surface flex flex-col h-[68vh] overflow-hidden">
      <div className='px-5 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between'>
        <div className='text-lg font-semibold text-slate-800'>对话消息列表</div>
        <Button size='small' onClick={() => setItems([])} disabled={items.length===0 || sending}>清空对话</Button>
      </div>
      <div ref={listRef} className="flex-1 overflow-auto p-5 space-y-3">
        {items.map((it,idx)=>(
          <div key={idx} className={it.role==='user'?'text-right':''}>
            <div className={`inline-block max-w-[88%] px-4 py-2 rounded-xl shadow-sm whitespace-pre-wrap ${it.role==='user'?'bg-gradient-to-r from-blue-600 to-cyan-500 text-white':'bg-slate-100 text-slate-700'}`}>{it.content}</div>
          </div>
        ))}

        {sending && (
          <div className='flex items-center gap-2 text-slate-500 text-sm'>
            <Spin size='small' />
            模型正在生成回复...
          </div>
        )}

        {items.length===0 && (
          <div className="space-y-3">
            <div className="text-slate-500">默认引导问题：</div>
            <div className='flex flex-wrap gap-2'>
              {guideQuestions.map(q => (
                <Tag
                  key={q}
                  className='cursor-pointer hover:border-blue-400 hover:text-blue-600 transition-colors px-3 py-1 rounded-full'
                  onClick={() => sendGuideQuestion(q)}
                >
                  {q}
                </Tag>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-slate-200 flex gap-2 bg-white">
        <Input.TextArea
          value={text}
          onChange={e=> setText(e.target.value)}
          autoSize={{minRows:1,maxRows:4}}
          placeholder="输入你的问题..."
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        <Button type="primary" onClick={send} loading={sending}>发送</Button>
      </div>
      </div>
    </div>
  );
}
