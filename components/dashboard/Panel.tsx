"use client";
import React, { useEffect, useState } from 'react';
import { Select, Spin } from 'antd';
import dynamic from 'next/dynamic';

// 动态导入图表组件，关闭 SSR，防止服务端执行时访问 document
const LinePlot = dynamic(() => import('@ant-design/plots').then(m => m.Line), { ssr: false });

import { getMetricsPayload } from '@/app/actions/metrics';

interface PanelProps { defaultMetric: string; days?: number; useMock?: boolean }

const metricOptions = [
  { value: 'event.countByDay', label: '事件数量(按日)' },
  { value: 'event.countByLabel', label: '事件按标签' },
  { value: 'task.total', label: '任务总数' }
]

export default function Panel({ defaultMetric, days = 7, useMock = false }: PanelProps){
  const [metric, setMetric] = useState(defaultMetric);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  function getMockData(curMetric: string, curDays: number){
    if(curMetric === 'event.countByDay'){
      const arr = Array.from({ length: curDays }).map((_, idx)=>({
        name: `D-${curDays-idx}`,
        value: [22, 27, 25, 31, 34, 29, 36, 33, 40, 38][idx % 10]
      }));
      return arr;
    }
    if(curMetric === 'event.countByLabel'){
      return [
        { name: '未佩戴护目镜', value: 15 },
        { name: '人员聚集', value: 11 },
        { name: '离岗', value: 8 },
        { name: '区域闯入', value: 6 },
      ];
    }
    return [
      { name: 'tasks', value: 16 },
      { name: 'running', value: 12 },
      { name: 'paused', value: 3 },
      { name: 'failed', value: 1 },
    ];
  }

  async function load(){
    if(useMock){
      setData(getMockData(metric, days));
      setLoading(false);
      return;
    }
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

  useEffect(()=>{ load(); }, [metric, days, useMock]);

  const config = {
    data: data.map(d=>({ day: d.name, value: d.value })),
    xField: 'day',
    yField: 'value',
    smooth: true
  } as any;

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-[0_10px_25px_rgba(15,23,42,0.06)] flex flex-col gap-4 transition-all hover:shadow-[0_14px_35px_rgba(37,99,235,0.12)]">
      <div className="flex items-center gap-2">
        <Select size="small" value={metric} options={metricOptions} onChange={setMetric} className="w-44" />
        <span className="text-xs text-zinc-500">过去 {days} 天</span>
      </div>
      <div className="flex-1 min-h-[180px] rounded-xl border border-slate-100 p-2 bg-gradient-to-b from-white to-slate-50/60">
        {loading ? <div className="flex justify-center items-center h-full"><Spin /></div> : <LinePlot {...config} />}
      </div>
    </div>
  )
}
