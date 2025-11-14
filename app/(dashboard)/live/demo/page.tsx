"use client";
import React, { useMemo, useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input, Select, Form, Button, Alert } from 'antd';
import HlsPlayer from '../HlsPlayer';
import { detectStreamType, normalizeUrl } from '@/lib/streamHelper';

function LiveDemoInner(){
  const sp = useSearchParams();
  const [url, setUrl] = useState(sp.get('url') || '');
  const [type, setType] = useState<string>(sp.get('type') || 'auto');
  const t = useMemo(()=> type==='auto' ? detectStreamType(url) : type as any, [url, type]);

  useEffect(()=>{ setUrl(u=> normalizeUrl(u)); }, []);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-zinc-100 rounded-lg p-4">
        <Form layout="vertical">
          <Form.Item label="流地址(URL)"><Input value={url} onChange={e=> setUrl(e.target.value)} placeholder="支持 .m3u8 / .mp4 / MJPEG / 图片；RTSP 需转码" /></Form.Item>
          <div className="flex gap-3 items-center">
            <div className="text-sm text-zinc-500">类型</div>
            <Select size="small" value={type} onChange={setType} style={{ width: 160 }} options={[{label:'自动', value:'auto'},{label:'HLS (.m3u8)', value:'hls'},{label:'MP4', value:'mp4'},{label:'MJPEG', value:'mjpeg'},{label:'图片', value:'image'}]} />
            <Button size="small" onClick={()=>{ const u = new URL(location.href); u.searchParams.set('url', url); u.searchParams.set('type', type); history.replaceState({}, '', u) }}>更新链接</Button>
          </div>
        </Form>
      </div>

      {t==='rtsp' && (
        <Alert type="warning" showIcon message="浏览器不支持 RTSP" description="请将 RTSP 转为 HLS(.m3u8) 或 WebRTC；也可在摄像头详情中使用“测试连接”确认可达性。" />
      )}

      <div className="bg-white border border-zinc-100 rounded-lg p-3">
        {t==='hls' && url && <HlsPlayer src={url} />}
        {t==='mp4' && url && <video className="w-full aspect-video bg-black" src={url} controls autoPlay playsInline />}
        {t==='mjpeg' && url && <img className="w-full" src={url} />}
        {t==='image' && url && <img className="max-w-full" src={url} />}
        {(!url || t==='unknown') && <div className="p-6 text-zinc-500">请输入或在地址栏 ?url=...&type=... 预览</div>}
      </div>
    </div>
  )
}

export default function LiveDemo(){
  return (
    <Suspense fallback={<div/>}>
      <LiveDemoInner />
    </Suspense>
  );
}
