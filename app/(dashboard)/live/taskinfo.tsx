/*
 * @Author: Jan
 * @Date: 2024-05-15 11:38:43
 * @LastEditTime: 2024-06-16 14:06:44
 * @FilePath: /EasyAIWeb/app/(dashboard)/live/taskinfo.tsx
 * @Description: 
 * 
 */
"use client";
import React from 'react';
import { Badge, Descriptions, Button, DescriptionsProps, message } from 'antd';
import { task } from '@/models/task';

export default function Taskinfo({taskInfo}: {taskInfo: task & { cameraName?: string }}) {
    const items: DescriptionsProps['items'] = [
        {
            label: '运行状态',
            children: <Badge status="processing" text="运行中" />,
            span: 1,
        },
        {
            label: '创建时间',
            // @ts-ignore
            children: new Date(taskInfo.createDate).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            span: 2,
        },
        {
            label: '任务名称',
            children: taskInfo?.taskName || '未命名任务',
        },
        {
            label: '摄像头名称',
            children: taskInfo?.cameraName || taskInfo?.taskName || '未配置',
        },
        {
            label: '摄像头位置',
            children: taskInfo?.locationName || '未配置',
        },

        {
            span: 2,
            label: '配置信息',
            children: taskInfo?.desc || '行为识别任务默认配置'
        },
        {
            span: 1,
            label: '操作',
            children: <Button type="primary" onClick={() => message.info('已打开任务配置查看（演示）。')}>查看配置</Button>,
        }
    ];



    return <Descriptions title={<span className='text-slate-800 font-semibold'>任务信息</span>} bordered items={items} className='rounded-xl overflow-hidden' />
}
