/*
 * @Author: Jan
 * @Date: 2024-05-15 11:38:43
 * @LastEditTime: 2024-06-16 14:06:44
 * @FilePath: /EasyAIWeb/app/(dashboard)/live/taskinfo.tsx
 * @Description: 
 * 
 */
import React from 'react';
import { Badge, Descriptions, Button, DescriptionsProps } from 'antd';
import { task } from '@/models/task';

export default function Taskinfo({taskInfo}: {taskInfo: task}) {
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
            children: taskInfo.taskName,
        },
        {
            label: '摄像头名称',
            children: taskInfo.taskName,
        },
        {
            label: '摄像头位置',
            children: '柜台',
        },

        {
            span: 2,
            label: '配置信息',
            children: ''
        },
        {
            span: 1,
            label: '操作',
            children: <Button type="primary">查看配置</Button>,
        }
    ];



    return <Descriptions title="任务信息" bordered items={items} />
}
