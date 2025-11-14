"use client";
import React, { useEffect, useState } from 'react';
import { Select, Spin } from 'antd';
import dynamic from 'next/dynamic';

// 动态导入图表组件，关闭 SSR，防止服务端执行时访问 document
const LinePlot = dynamic(() => import('@ant-design/plots').then(m => m.Line), { ssr: false });

import { getMetricsPayload } from '@/app/actions/metrics';

interface PanelProps { defaultMetric: string; days?: number }

const metricOptions = [
  { value: 'event.countByDay', label: '事件数量(按日)' },
  { value: 'event.countByLabel', label: '事件按标签' },
  { value: 'task.total', label: '任务总数' }
]

export default function Panel({ defaultMetric, days = 7 }: PanelProps){
  const [metric, setMetric] = useState(defaultMetric);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  async function load(){
    setLoading(true);
    try {
      const payload = await getMetricsPayload([metric], days);
      let raw = payload[metric] || [];
      // 统一转换为 { name, value } 结构
      if(metric === 'event.countByDay'){
        raw = raw.map((d: any)=>({ name: d._id, value: d.value }))
      } else if(metric === 'event.countByLabel') {
        raw = raw.map((d: any)=>({ name: d._id, value: d.value }))
      } else if(metric === 'task.total') {
        raw = raw.map((d: any)=>({ name: 'tasks', value: d.value }))
      }
      setData(raw);
    } finally { setLoading(false); }
  }

  useEffect(()=>{ load(); }, [metric, days]);

  const config = {
    data: data.map(d=>({ day: d.name, value: d.value })),
    xField: 'day',
    yField: 'value',
    smooth: true
  } as any;

  return (
    <div className="p-4 rounded-lg bg-white border border-zinc-100 shadow-sm flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Select size="small" value={metric} options={metricOptions} onChange={setMetric} className="w-44" />
        <span className="text-xs text-zinc-500">过去 {days} 天</span>
      </div>
      <div className="flex-1 min-h-[180px]">
        {loading ? <div className="flex justify-center items-center h-full"><Spin /></div> : <LinePlot {...config} />}
      </div>
    </div>
  )
}
