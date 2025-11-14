"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, List, message } from 'antd';

export default function LLMPage(){
  const [items, setItems] = useState<{role:'user'|'assistant', content:string}[]>([]);
  const [text, setText] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{ listRef.current?.scrollTo(0, listRef.current.scrollHeight); }, [items]);

  const send = async ()=>{
    if(!text.trim()) return;
    const userMsg = { role:'user' as const, content: text };
    setItems(prev=> [...prev, userMsg]);
    setText('');
    try{
      const res = await fetch('/api/assistant/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ messages: [...items, userMsg] }) });
      const data = await res.json();
      if(!res.ok){ throw new Error(data.error||'请求失败'); }
      setItems(prev=> [...prev, { role:'assistant', content: data.reply || '' }]);
    }catch(e:any){ message.error(e.message||'请求失败'); }
  };

  return (
    <div className="flex flex-col h-[70vh] bg-white border border-zinc-100 rounded">
      <div ref={listRef} className="flex-1 overflow-auto p-4 space-y-3">
        {items.map((it,idx)=>(
          <div key={idx} className={it.role==='user'?'text-right':''}>
            <div className={`inline-block px-3 py-2 rounded ${it.role==='user'?'bg-blue-600 text-white':'bg-zinc-100'}`}>{it.content}</div>
          </div>
        ))}
        {items.length===0 && <div className="text-zinc-500">试试输入：“下周三下午两个小时的空教室有哪些？”</div>}
      </div>
      <div className="p-3 border-t flex gap-2">
        <Input.TextArea value={text} onChange={e=> setText(e.target.value)} autoSize={{minRows:1,maxRows:4}} placeholder="输入你的问题..."/>
        <Button type="primary" onClick={send}>发送</Button>
      </div>
    </div>
  );
}
