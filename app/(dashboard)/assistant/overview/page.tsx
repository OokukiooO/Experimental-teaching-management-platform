"use client";
import React, { useMemo, useState } from 'react';
import { Alert, Progress, Tag } from 'antd';

type RoomRow = {
  room: string;
  manager: string;
  freeHours: number;
  totalHours: number;
  slots: string[];
};

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

const weeklyData: Record<string, RoomRow[]> = {
  周一: [
    { room: '实验室 A101', manager: '王老师', freeHours: 6, totalHours: 12, slots: ['08:00-10:00', '14:00-16:00', '19:00-21:00'] },
    { room: '实验室 B203', manager: '陈老师', freeHours: 4, totalHours: 12, slots: ['10:00-12:00', '16:00-18:00'] },
    { room: '实验室 C305', manager: '李老师', freeHours: 7, totalHours: 12, slots: ['08:00-11:00', '15:00-17:00', '18:00-20:00'] },
  ],
  周二: [
    { room: '实验室 A101', manager: '王老师', freeHours: 5, totalHours: 12, slots: ['09:00-11:00', '13:00-15:00', '19:00-20:00'] },
    { room: '实验室 B203', manager: '陈老师', freeHours: 8, totalHours: 12, slots: ['08:00-10:00', '12:00-15:00', '17:00-20:00'] },
    { room: '实验室 C305', manager: '李老师', freeHours: 3, totalHours: 12, slots: ['10:00-11:00', '16:00-18:00'] },
  ],
  周三: [
    { room: '实验室 A101', manager: '王老师', freeHours: 4, totalHours: 12, slots: ['08:00-09:00', '13:00-15:00', '20:00-21:00'] },
    { room: '实验室 B203', manager: '陈老师', freeHours: 6, totalHours: 12, slots: ['09:00-11:00', '14:00-16:00', '18:00-20:00'] },
    { room: '实验室 C305', manager: '李老师', freeHours: 5, totalHours: 12, slots: ['08:00-10:00', '15:00-18:00'] },
  ],
  周四: [
    { room: '实验室 A101', manager: '王老师', freeHours: 9, totalHours: 12, slots: ['08:00-12:00', '14:00-16:00', '18:00-21:00'] },
    { room: '实验室 B203', manager: '陈老师', freeHours: 2, totalHours: 12, slots: ['12:00-13:00', '19:00-20:00'] },
    { room: '实验室 C305', manager: '李老师', freeHours: 6, totalHours: 12, slots: ['09:00-11:00', '13:00-16:00', '19:00-20:00'] },
  ],
  周五: [
    { room: '实验室 A101', manager: '王老师', freeHours: 3, totalHours: 12, slots: ['10:00-11:00', '16:00-18:00'] },
    { room: '实验室 B203', manager: '陈老师', freeHours: 7, totalHours: 12, slots: ['08:00-10:00', '12:00-14:00', '17:00-20:00'] },
    { room: '实验室 C305', manager: '李老师', freeHours: 6, totalHours: 12, slots: ['09:00-12:00', '15:00-18:00'] },
  ],
  周六: [
    { room: '实验室 A101', manager: '王老师', freeHours: 8, totalHours: 12, slots: ['08:00-10:00', '12:00-15:00', '18:00-21:00'] },
    { room: '实验室 B203', manager: '陈老师', freeHours: 9, totalHours: 12, slots: ['09:00-12:00', '14:00-16:00', '18:00-22:00'] },
    { room: '实验室 C305', manager: '李老师', freeHours: 7, totalHours: 12, slots: ['08:00-11:00', '13:00-15:00', '19:00-21:00'] },
  ],
  周日: [
    { room: '实验室 A101', manager: '王老师', freeHours: 10, totalHours: 12, slots: ['08:00-12:00', '14:00-18:00', '19:00-21:00'] },
    { room: '实验室 B203', manager: '陈老师', freeHours: 8, totalHours: 12, slots: ['08:00-11:00', '13:00-16:00', '18:00-20:00'] },
    { room: '实验室 C305', manager: '李老师', freeHours: 9, totalHours: 12, slots: ['09:00-12:00', '14:00-17:00', '19:00-22:00'] },
  ]
};

const conflicts = [
  { id: 1, level: '高', text: '实验室 A101 在周三 14:00-16:00 出现课程与维护计划冲突。' },
  { id: 2, level: '中', text: '实验室 B203 在周五 10:00-12:00 连续两门课程间隔不足 10 分钟。' },
  { id: 3, level: '低', text: '实验室 C305 在周四 19:00 后使用率偏低，可安排补充实验。' },
];

export default function Overview() {
  const [activeDay, setActiveDay] = useState('周一');
  const rows = useMemo(() => weeklyData[activeDay] || [], [activeDay]);

  return (
    <div className="space-y-5">
      <div className="ui-surface p-6 space-y-3">
        <h2 className="ui-title text-xl font-semibold text-slate-800">实验室排期概览</h2>
        <p className="text-slate-600 leading-7">本页面用于查看未来一周实验室空闲时段、排期冲突提醒与使用负载，辅助快速完成排课信息查看。</p>
      </div>

      <div className="ui-surface p-5">
        <div className="mb-4 text-sm font-semibold text-slate-700">未来一周空闲时段</div>
        <div className="flex flex-wrap gap-2">
          {weekDays.map(day => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-4 py-2 rounded-lg text-sm transition-all border ${activeDay===day ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'}`}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {rows.map(row => {
            const percent = Math.round((row.freeHours / row.totalHours) * 100);
            return (
              <div key={row.room} className="rounded-xl border border-slate-200 p-4 bg-gradient-to-b from-white to-slate-50/50 hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-all">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-800">{row.room}</div>
                  <Tag color={percent >= 60 ? 'green' : percent >= 35 ? 'gold' : 'red'}>{percent >= 60 ? '空闲充足' : percent >= 35 ? '空闲一般' : '空闲紧张'}</Tag>
                </div>
                <div className="mt-1 text-xs text-slate-500">负责人：{row.manager}</div>
                <div className="mt-4">
                  <Progress percent={percent} size="small" strokeColor={percent >= 60 ? '#16a34a' : percent >= 35 ? '#f59e0b' : '#ef4444'} />
                </div>
                <div className="mt-3 text-xs text-slate-500">可用时段</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {row.slots.map(slot => <Tag key={slot}>{slot}</Tag>)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="ui-surface p-5">
        <div className="mb-4 text-sm font-semibold text-slate-700">冲突提醒</div>
        <div className="space-y-3">
          {conflicts.map(item => (
            <Alert
              key={item.id}
              type={item.level === '高' ? 'error' : item.level === '中' ? 'warning' : 'info'}
              showIcon
              message={`${item.level}优先级冲突`}
              description={item.text}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
