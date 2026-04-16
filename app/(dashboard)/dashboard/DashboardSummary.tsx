"use client";
import React, { useMemo, useRef, useState } from 'react';
import { Col, Row, message } from 'antd';
import NumCard from '@/components/numcard';
import ChartGrid from '@/components/dashboard/ChartGrid';

interface Props {
  realCounts: {
    todayCount: string;
    taskCount: string;
    deviceCount: string;
  };
}

export default function DashboardSummary({ realCounts }: Props) {
  const [showMock, setShowMock] = useState(false);
  const [clickStreak, setClickStreak] = useState(0);
  const lastClickAtRef = useRef<number>(0);

  const mockCounts = useMemo(
    () => ({
      todayCount: '47',
      taskCount: '16',
      deviceCount: '28',
    }),
    []
  );

  const data = showMock ? mockCounts : realCounts;

  const handleEventCardClick = () => {
    const now = Date.now();
    const inContinuousWindow = now - lastClickAtRef.current <= 1200;
    const nextStreak = inContinuousWindow ? clickStreak + 1 : 1;
    lastClickAtRef.current = now;

    if (nextStreak >= 3) {
      const nextMode = !showMock;
      setShowMock(nextMode);
      setClickStreak(0);
      message.success(nextMode ? '已切换为伪数据展示' : '已切换为真实数据库数据');
      return;
    }
    setClickStreak(nextStreak);
  };

  return (
    <div className='space-y-5'>
      <div className='ui-surface p-5'>
        <h1 className='ui-title text-xl font-semibold text-slate-800'>仪表盘</h1>
        <p className='mt-1 text-sm text-slate-500'>查看当天事件、任务与设备的核心指标，并跟踪趋势变化。</p>
      </div>

      <Row gutter={20}>
        <Col span={8}>
          <div className='cursor-pointer' onClick={handleEventCardClick}>
            <NumCard name="当天事件数量" value={data.todayCount} color="#ea580c" icon='ExceptionOutlined' />
          </div>
        </Col>
        <Col span={8}><NumCard name="任务数量" value={data.taskCount} color="#0891b2" icon='ProductOutlined' /></Col>
        <Col span={8}><NumCard name="设备数量" value={data.deviceCount} color="#059669" icon='VideoCameraOutlined' /></Col>
      </Row>

      <div className='h-2'></div>
      <ChartGrid useMock={showMock} />
    </div>
  );
}
