"use client";
import React, { useMemo, useState } from 'react';
import { Button, Tag } from 'antd';
import HlsPlayer from './HlsPlayer';
import Taskloc from './taskloc';
import Taskinfo from './taskinfo';
import { detectStreamType, normalizeUrl } from '@/lib/streamHelper';

type StreamMode = 'auto' | 'hls' | 'mp4' | 'mjpeg' | 'image' | 'rtsp';

export default function LiveTaskBoard({ taskInfo }: { taskInfo: any }) {
  const demoUrls = {
    hls: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    mp4: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    mjpeg: 'https://placehold.co/1280x720/png?text=MJPEG+Demo+Stream',
    image: '/event-snapshot.svg',
    rtsp: 'rtsp://demo-camera/live/stream',
  };

  const defaultUrl = normalizeUrl(taskInfo?.detectStreamUrl || demoUrls.hls);
  const [mode, setMode] = useState<StreamMode>('auto');
  const [url, setUrl] = useState(defaultUrl);

  const finalType = useMemo(() => {
    if (mode === 'auto') return detectStreamType(url);
    return mode;
  }, [mode, url]);

  const selectMode = (nextMode: StreamMode) => {
    setMode(nextMode);
    if (nextMode === 'auto') {
      setUrl(defaultUrl);
      return;
    }
    setUrl(demoUrls[nextMode]);
  };

  return (
    <div className='space-y-5'>
      <div className='ui-surface p-5'>
        <h1 className='ui-title text-xl font-semibold text-slate-800'>在线浏览（任务）</h1>
        <p className='mt-1 text-sm text-slate-500'>按任务查看主预览区流内容，支持 HLS / MP4 / MJPEG / 图片演示与异常类型提示。</p>
      </div>

      <div className='grid grid-cols-12 gap-5 mb-1'>
        <div className='col-span-12 lg:col-span-9 ui-surface p-3 space-y-3'>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-xs text-slate-500'>流类型</span>
            {(['auto', 'hls', 'mp4', 'mjpeg', 'image', 'rtsp'] as StreamMode[]).map(it => (
              <button
                key={it}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${mode===it ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'}`}
                onClick={() => selectMode(it)}
              >
                {it.toUpperCase()}
              </button>
            ))}
            <Tag color='blue'>当前识别类型：{String(finalType).toUpperCase()}</Tag>
            <Button size='small' onClick={() => { setMode('auto'); setUrl(defaultUrl); }}>恢复任务默认流</Button>
          </div>

          {finalType==='hls' && url && <HlsPlayer src={url} />}
          {finalType==='mp4' && url && <video className='w-full aspect-video bg-black rounded-lg' src={url} controls autoPlay playsInline />}
          {finalType==='mjpeg' && url && <img className='w-full rounded-lg' src={url} />}
          {finalType==='image' && url && <img className='max-w-full rounded-lg' src={url} />}
          {(finalType==='rtsp' || finalType==='unknown') && (
            <div className='p-6 bg-white border border-zinc-100 rounded-lg text-zinc-600'>
              当前流地址类型为 {finalType==='rtsp'?'RTSP':'未知'}，浏览器无法直接播放。请将流转换为 HLS(.m3u8) 或 WebRTC，或前往 <a className='text-blue-600 underline' href='/live/demo'>在线预览 Demo</a> 进行调试。
            </div>
          )}
        </div>

        <div className='col-span-12 lg:col-span-3 ui-surface p-3'>
          <Taskloc></Taskloc>
        </div>
      </div>

      <div className='ui-surface p-3'>
        <Taskinfo taskInfo={taskInfo}></Taskinfo>
      </div>
    </div>
  );
}
