"use client";
import React from 'react';
import Panel from './Panel';

export default function ChartGrid({ useMock = false }: { useMock?: boolean }){
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Panel defaultMetric="event.countByDay" useMock={useMock} />
      <Panel defaultMetric="event.countByLabel" useMock={useMock} />
      <Panel defaultMetric="task.total" useMock={useMock} />
    </div>
  )
}