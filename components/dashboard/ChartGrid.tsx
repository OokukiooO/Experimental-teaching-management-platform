"use client";
import React from 'react';
import Panel from './Panel';

export default function ChartGrid(){
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Panel defaultMetric="event.countByDay" />
      <Panel defaultMetric="event.countByLabel" />
      <Panel defaultMetric="task.total" />
    </div>
  )
}