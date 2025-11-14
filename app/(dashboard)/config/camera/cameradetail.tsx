"use client";
import React, { useEffect, useState } from 'react';
import { Descriptions, Button, Space, message } from 'antd';

export default function CameraDetail(){
  const [cam, setCam] = useState<any>();

  useEffect(()=>{
    function onSelect(e:any){ setCam(e.detail) }
    window.addEventListener('camera:select', onSelect as any);
    return ()=> window.removeEventListener('camera:select', onSelect as any)
  },[])

  if(!cam){
    return <div className="bg-white rounded-lg border border-zinc-100 p-6 text-zinc-500">选择左侧摄像头查看详情</div>
  }

  return (
    <div className="bg-white rounded-lg border border-zinc-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">{cam.name}</h2>
        <Space>
          <Button size="small" onClick={()=>{ navigator.clipboard.writeText(cam.streamUri); message.success('已复制流地址'); }}>复制流地址</Button>
          <Button size="small" type="primary" onClick={async ()=>{
            const res = await fetch('/api/camera/probe', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id: cam._id, streamUri: cam.streamUri })});
            const json = await res.json();
            if(json.ok && json.reachable){ message.success('连接正常') } else if(json.unverifiable) { message.warning('无法验证（缺少 ffprobe），已收到响应') } else { message.error('连接失败: '+ (json.error||json.reason||'未知原因')) }
          }}>测试连接</Button>
        </Space>
      </div>
      <Descriptions bordered size="small" column={1}
        items={[
          { label:'厂商', children: cam.vendor||'—' },
          { label:'IP', children: cam.ip||'—' },
          { label:'位置', children: cam.locationName||'—' },
          { label:'RTSP/URI', children: cam.streamUri },
          { label:'ONVIF', children: cam.onvifUri||'—' },
          { label:'备注', children: cam.note||'—' },
        ]}
      />
    </div>
  )
}
