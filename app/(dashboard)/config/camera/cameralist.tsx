"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { List, Avatar, Badge, Switch, Tooltip, message } from 'antd';
import { VideoCameraOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

export default function CameraList({ initial }: { initial: any[] }){
  const [items, setItems] = useState(initial);
  const [active, setActive] = useState(items[0]?._id);
  const router = useRouter();
  const [autoProbe, setAutoProbe] = useState(false);
  const timerRef = useRef<any>();

  const probeOnce = async (cam:any)=>{
    try{
      const res = await fetch('/api/camera/probe', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id: cam._id, streamUri: cam.streamUri }) });
      const json = await res.json();
      const reachable = !!json.reachable;
      const nextStatus = reachable ? 'online' : (json.unverifiable ? 'unknown' : 'offline');
      setItems(prev => prev.map(it => it._id===cam._id ? { ...it, status: nextStatus } : it));
    } catch(e:any){ /* 静默失败 */ }
  }

  useEffect(()=>{
    if(autoProbe){
      timerRef.current = setInterval(()=>{
        // 轮询本页所有摄像头（可改为只探活当前选中）
        for(const cam of items){ probeOnce(cam) }
      }, 8000);
    } else if(timerRef.current){
      clearInterval(timerRef.current);
    }
    return ()=>{ if(timerRef.current) clearInterval(timerRef.current) }
  }, [autoProbe, items]);

  return (
    <div className="bg-white rounded-lg border border-zinc-100 p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-zinc-500">摄像头列表</div>
        <Tooltip title="每 8 秒探活列表中的所有摄像头，RTSP 在未启用 ffprobe 时会返回 unknown。">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            自动探活 <Switch size="small" checked={autoProbe} onChange={setAutoProbe} />
          </div>
        </Tooltip>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={items}
        renderItem={(item:any)=>{
          const statusColor = item.status==='online'?'#16a34a':item.status==='offline'?'#ef4444':'#f59e0b';
          return (
            <List.Item className={`${active===item._id?'bg-zinc-50':''} cursor-pointer rounded-md`} onClick={()=>{ setActive(item._id); window.dispatchEvent(new CustomEvent('camera:select',{ detail:item })) }}>
              <List.Item.Meta
                avatar={<Avatar style={{ background: '#eef2ff' }} icon={<VideoCameraOutlined style={{ color:'#6366f1' }} />} />}
                title={<div className="flex items-center gap-2"><span className="font-medium">{item.name}</span><Badge color={statusColor} text={item.status||'unknown'} /></div>}
                description={<div className="text-xs text-zinc-500">{item.vendor||'—'} · {item.ip||item.locationName||''}</div>}
              />
            </List.Item>
          )
        }}
      />
    </div>
  )
}
