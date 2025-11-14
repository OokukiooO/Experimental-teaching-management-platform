/*
 * @Author: Jan
 * @Date: 2024-05-09 21:23:46
 * @LastEditTime: 2024-06-06 18:28:38
 * @FilePath: /EasyAIWeb/app/(dashboard)/dashboard/page.tsx
 * @Description: 
 * 
 */
import React from 'react';
import { Col, Row } from 'antd';
import NumCard from '../../../components/numcard';
import ChartGrid from '@/components/dashboard/ChartGrid';
import dbConnect from '@/lib/dbconn';
import Event from '@/models/event';
import Task from '@/models/task';
import Camera from '@/models/camera';
import { ensureDemoSeed } from '@/lib/seed';
import { ensureAlgoSeed } from '@/lib/seed';

export default async function App() {
    let todayCount = '0', taskCount = '0', deviceCount = '0';
        try {
            if (process.env.MONGODB_URI) {
                await ensureDemoSeed();
                await ensureAlgoSeed();
                await dbConnect();
                const start = new Date(); start.setHours(0,0,0,0);
                const end = new Date(); end.setHours(23,59,59,999);
                const [ev, tk, cam] = await Promise.all([
                    Event.countDocuments({ reportDate: { $gte: start, $lte: end } }),
                    Task.countDocuments({}),
                    Camera.countDocuments({}),
                ]);
                todayCount = String(ev); taskCount = String(tk); deviceCount = String(cam);
            } else { throw new Error('no-db'); }
        } catch {
            // fallback mock
            todayCount = '12'; taskCount = '3'; deviceCount = '2';
        }

    return (
        <>
            <Row gutter={20}>
                <Col span={8}><NumCard name="当天事件数量" value={todayCount} color="#ea580c" icon='ExceptionOutlined' /></Col>
                <Col span={8}><NumCard name="任务数量" value={taskCount} color="#0891b2" icon='ProductOutlined' /></Col>
                <Col span={8}><NumCard name="设备数量" value={deviceCount} color="#059669" icon='VideoCameraOutlined' /></Col>
            </Row>
            <div className='h-8'></div>
            <ChartGrid />
        </>
    );
}