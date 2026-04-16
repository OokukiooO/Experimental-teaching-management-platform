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
    <div className="space-y-5">
      <div className="ui-surface p-5 transition-all hover:shadow-[0_14px_35px_rgba(37,99,235,0.12)]">
        <div className='mb-4'>
          <h2 className='ui-title text-lg font-semibold text-slate-800'>在线预览 Demo</h2>
          <p className='mt-1 text-sm text-slate-500'>输入流地址并选择类型，快速验证可播放性与渲染效果。</p>
        </div>
        <Form layout="vertical">
          <Form.Item label="流地址(URL)"><Input value={url} onChange={e=> setUrl(e.target.value)} placeholder="支持 .m3u8 / .mp4 / MJPEG / 图片；RTSP 需转码" /></Form.Item>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="text-sm text-zinc-500">类型</div>
            <Select size="small" value={type} onChange={setType} style={{ width: 160 }} options={[{label:'自动', value:'auto'},{label:'HLS (.m3u8)', value:'hls'},{label:'MP4', value:'mp4'},{label:'MJPEG', value:'mjpeg'},{label:'图片', value:'image'}]} />
            <Button size="small" type='primary' onClick={()=>{ const u = new URL(location.href); u.searchParams.set('url', url); u.searchParams.set('type', type); history.replaceState({}, '', u) }}>更新链接</Button>
          </div>
        </Form>
      </div>

      {t==='rtsp' && (
        <Alert type="warning" showIcon message="浏览器不支持 RTSP" description="请将 RTSP 转为 HLS(.m3u8) 或 WebRTC；也可在摄像头详情中使用“测试连接”确认可达性。" />
      )}

      <div className="ui-surface p-3 transition-all hover:shadow-[0_14px_35px_rgba(37,99,235,0.12)]">
        {t==='hls' && url && <HlsPlayer src={url} />}
        {t==='mp4' && url && <video className="w-full aspect-video bg-black rounded-lg" src={url} controls autoPlay playsInline />}
        {t==='mjpeg' && url && <img className="w-full rounded-lg" src={url} />}
        {t==='image' && url && <img className="max-w-full rounded-lg" src={url} />}
        {(!url || t==='unknown') && <div className="p-8 text-zinc-500 text-center">请输入或在地址栏 ?url=...&type=... 预览</div>}
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
