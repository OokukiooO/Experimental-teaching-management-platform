/*
 * @Author: Jan
 * @Date: 2024-05-15 10:25:56
 * @LastEditTime: 2024-06-11 17:11:35
 * @FilePath: /EasyAIWeb/app/(dashboard)/live/page.tsx
 * @Description: 
 * 
 */
// 'use client'
import React from 'react';
import Taskloc from './taskloc'
import Taskinfo from './taskinfo';
import { getTaskById } from '@/app/actions/task'
import { task } from '@/models/task'
import HlsPlayer from './HlsPlayer';
import { detectStreamType, normalizeUrl } from '@/lib/streamHelper';

export default async function LivePage({ searchParams: { taskid } }: { searchParams: { taskid: string } }) {
    // taskid=665d7b2ab411240f159b82b2
    let taskInfo: task = JSON.parse(await getTaskById(taskid));
    const url = normalizeUrl(taskInfo?.detectStreamUrl || '');
    const t = detectStreamType(url);

    return (
        <>
            <div className='grid grid-cols-12 gap-5 mb-5'>
                <div className='col-span-9'>
                    {t==='hls' && <HlsPlayer src={url} />}
                    {t==='mp4' && <video className='w-full aspect-video bg-black' src={url} controls autoPlay playsInline />}
                    {t==='mjpeg' && <img className='w-full' src={url} />}
                    {t==='image' && <img className='max-w-full' src={url} />}
                    {(t==='rtsp' || t==='unknown') && (
                        <div className='p-6 bg-white border border-zinc-100 rounded-lg text-zinc-600'>
                            当前流地址类型为 {t==='rtsp'?'RTSP':'未知'}，浏览器无法直接播放。请将流转换为 HLS(.m3u8) 或 WebRTC，或前往 <a className='text-blue-600 underline' href='/live/demo'>在线浏览示例</a> 进行调试。</div>
                    )}

                    {/* <video className='aspect-video' autoPlay controls={false} loop>
                            <source src={taskInfo.detectStreamUrl} type="video/mp4" />
                        </video> */}
                </div>
                <div className='col-span-3'>
                    <Taskloc></Taskloc>
                </div>
            </div>
            <Taskinfo taskInfo={taskInfo}></Taskinfo>
        </>
    )
}