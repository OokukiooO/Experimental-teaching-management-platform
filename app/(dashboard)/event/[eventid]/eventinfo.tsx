/*
 * @Author: Jan
 * @Date: 2024-05-15 11:38:43
 * @LastEditTime: 2024-05-29 14:32:08
 * @FilePath: /EasyAIWeb/app/(dashboard)/event/[eventid]/eventinfo.tsx
 * @Description: 
 * 
 */
import React from 'react';
import { Badge, Descriptions, Button, DescriptionsProps } from 'antd';

const items: DescriptionsProps['items'] = [
    {
        label: '事件处理状态',
        children: <Badge status="processing" text="运行中" />,
        span: 1,
    },
    {
        label: '启动时间',
        children: '2024-05-15 10:10:49',
        span: 2,
    },
    {
        label: '任务名称',
        children: '柜台行为检测1号模型(侧面)',
    },
    {
        label: '摄像头名称',
        children: '右1摄像头',
    },
    {
        label: '摄像头位置',
        children: '柜台1',
    },

    {
        span: 2,
        label: '检测信息',
        children: ''
    },
    {
        span: 1,
        label: '操作',
        children: <Button type="primary">查看配置</Button>,
    }
];

const Eventinfo: React.FC = () => <Descriptions title="事件信息" bordered items={items} />;

export default Eventinfo;