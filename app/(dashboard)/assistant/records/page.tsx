"use client";
import React, { useMemo, useState } from 'react';
import { Alert, Input, Table, Tag, message } from 'antd';

export default function Records() {
  const [keyword, setKeyword] = useState('');

  const data = useMemo(() => ([
    { key: 1, course: '机器视觉实验', teacher: '张老师', room: 'A101', date: '2026-03-03', creator: 'admin', status: '已归档' },
    { key: 2, course: '嵌入式系统综合实验', teacher: '李老师', room: 'B203', date: '2026-03-04', creator: 'admin', status: '已归档' },
    { key: 3, course: '深度学习实验', teacher: '王老师', room: 'C305', date: '2026-03-05', creator: 'admin', status: '待归档' },
    { key: 4, course: '数据结构实验', teacher: '赵老师', room: 'A101', date: '2026-03-06', creator: 'admin', status: '已归档' },
    { key: 5, course: '网络安全实验', teacher: '陈老师', room: 'B203', date: '2026-03-07', creator: 'admin', status: '待归档' },
  ]), []);

  const filtered = useMemo(() => {
    const text = keyword.trim().toLowerCase();
    if (!text) return data;
    return data.filter(item =>
      [item.course, item.teacher, item.room, item.date, item.creator, item.status]
        .join(' ')
        .toLowerCase()
        .includes(text)
    );
  }, [data, keyword]);

  const columns = [
    { title: '课程', dataIndex: 'course' },
    { title: '教师', dataIndex: 'teacher' },
    { title: '实验室', dataIndex: 'room' },
    { title: '日期', dataIndex: 'date' },
    { title: '创建人', dataIndex: 'creator' },
    {
      title: '归档状态',
      dataIndex: 'status',
      render: (value: string) => <Tag color={value === '已归档' ? 'green' : 'gold'}>{value}</Tag>
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (_: unknown, record: any) => (
        <button
          className='text-blue-600 hover:text-blue-700 transition-colors'
          onClick={() => message.info(`查看记录：${record.course}（${record.date}）`)}
        >
          查看
        </button>
      )
    },
  ];

  return (
    <div className="space-y-5">
      <div className="ui-surface p-6 space-y-3">
        <h2 className="ui-title text-xl font-semibold text-slate-800">排课记录</h2>
        <p className="text-slate-600 leading-7">本页面用于查看历史排课记录，支持按关键字查询课程、教师、实验室与日期信息。</p>
      </div>

      <div className="ui-surface p-5 space-y-4">
        <div className='text-sm font-semibold text-slate-700'>记录查询与归档说明</div>
        <Alert
          type='info'
          showIcon
          message='查询与归档说明'
          description='可通过关键字查询历史记录。已归档记录用于留存与复核，待归档记录用于近期排课回看与校验。'
        />
        <Input
          placeholder='请输入课程 / 教师 / 实验室 / 日期关键字'
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          allowClear
        />
      </div>

      <div className='ui-surface p-3'>
        <div className='mb-3 text-sm font-semibold text-slate-700'>记录信息查看</div>
        <Table
          size='small'
          rowKey='key'
          columns={columns}
          dataSource={filtered}
          pagination={{ pageSize: 5 }}
          locale={{ emptyText: '暂无排课记录' }}
        />
      </div>
    </div>
  );
}
