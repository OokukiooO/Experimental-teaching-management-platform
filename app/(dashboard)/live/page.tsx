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
import { getTaskById } from '@/app/actions/task'
import { task } from '@/models/task'
import LiveTaskBoard from './LiveTaskBoard';

export default async function LivePage({ searchParams: { taskid } }: { searchParams: { taskid: string } }) {
    const mockTask: any = {
        taskName: '实验区行为识别任务（演示）',
        locationName: '实验楼 A 区',
        createDate: new Date().toISOString(),
        desc: '算法：行为识别 v2.3；推流协议：HLS/MP4；告警阈值：0.72',
        streamUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        detectStreamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        cameraName: 'A区北门摄像头-01',
    };

    let taskInfo: any = mockTask;
    try {
        if (taskid) {
            const raw = await getTaskById(taskid);
            const parsed = JSON.parse(raw || 'null');
            taskInfo = parsed || mockTask;
        }
    } catch {
        taskInfo = mockTask;
    }

    return <LiveTaskBoard taskInfo={taskInfo} />;
}