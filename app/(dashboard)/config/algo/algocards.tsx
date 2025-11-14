"use client";
import React, { useMemo, useState } from 'react';
import { Card, Segmented, Progress, Badge, Button, Space, message } from 'antd';

export default function AlgoCards({ initial }: { initial:any[] }){
  const [filter, setFilter] = useState<'all'|'online'|'degraded'|'offline'>('all');
  const [nodes, setNodes] = useState<any[]>(initial);
  const data = useMemo(()=> nodes.filter(n=> filter==='all' ? true : n.status===filter), [nodes, filter]);

  const heartbeat = async (node:any)=>{
    try{
      const res = await fetch('/api/algo/heartbeat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id: node._id, host: node.host, apiBase: node.apiBase }) });
      const json = await res.json();
      if(json.ok){
        message.success('心跳成功');
        setNodes(prev=> prev.map(n=> n._id===node._id ? { ...n, status: json.status||'online', lastHeartbeatAt: json.lastHeartbeatAt } : n));
      } else {
        message.error('心跳失败');
      }
    } catch(e:any){
      message.error('心跳异常: '+ (e?.message||'unknown'))
    }
  }

  return (
    <div className="space-y-3">
      <Segmented size="small" value={filter} onChange={(v:any)=>setFilter(v)} options={[{label:'全部', value:'all'},{label:'在线', value:'online'},{label:'降级', value:'degraded'},{label:'离线', value:'offline'}]} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((n:any)=>{
          const color = n.status==='online'?'#16a34a':n.status==='degraded'?'#f59e0b':'#ef4444';
          const gpuPct = n.gpuMemTotal? Math.round(100*(n.gpuMemUsed||0)/(n.gpuMemTotal||1)) : 0;
          return (
            <Card key={n._id} className="border-zinc-100">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{n.name}</div>
                <Badge color={color} text={n.status||'unknown'} />
              </div>
              <div className="text-xs text-zinc-500 mb-3">{n.host} · {n.apiBase||'—'} · v{n.version||'—'}</div>
              <div className="space-y-2">
                <div>CPU 使用率 <Progress percent={n.cpuUsage||0} size="small" /></div>
                <div>内存 使用率 <Progress percent={n.memUsage||0} size="small" /></div>
                <div>GPU {n.gpuName||'—'} <Progress percent={gpuPct} size="small" /></div>
                <div className="text-xs text-zinc-500">关联摄像头: {n.connectedCameras||0}</div>
                <div className="text-xs text-zinc-400">上次心跳: {n.lastHeartbeatAt ? new Date(n.lastHeartbeatAt).toLocaleString() : '—'}</div>
                <div className="pt-1">
                  <Space size="small">
                    <Button size="small" onClick={()=>heartbeat(n)}>心跳</Button>
                  </Space>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
