"use client";
import React, { useMemo, useState } from 'react';
import { Alert, Button, Card, Input, Tag } from 'antd';
import { mockFaceEvents } from '@/lib/mockEventData';

export default function FacePage(){
  const [keyword, setKeyword] = useState('');

  const list = useMemo(() => {
    const text = keyword.trim().toLowerCase();
    if (!text) return mockFaceEvents;
    return mockFaceEvents.filter((it) =>
      [it.id, it.name, it.location, it.time].join(' ').toLowerCase().includes(text)
    );
  }, [keyword]);

  return (
    <div className='space-y-5'>
      <div className='ui-surface p-5'>
        <h1 className='ui-title text-xl font-semibold text-slate-800'>人脸事件</h1>
        <p className='mt-1 text-sm text-slate-500'>查看人脸事件说明、检索入口信息与抓拍示例记录。</p>
      </div>

      <div className='ui-surface p-5 space-y-4'>
        <Alert
          type='info'
          showIcon
          message='人脸记录查看入口信息'
          description='可通过关键字检索人员名称、抓拍时间与位置。后续可接入实时比对与白名单管理。'
        />
        <div className='flex gap-2'>
          <Input
            allowClear
            placeholder='搜索姓名 / 位置 / 时间'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button>高级检索（预留）</Button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {list.map((item) => (
          <Card key={item.id} className='ui-surface border-slate-200 shadow-[0_8px_24px_rgba(15,23,42,0.06)]'>
            <img src={item.image} className='w-full rounded-lg mb-3' />
            <div className='text-sm font-semibold text-slate-800'>{item.name}</div>
            <div className='text-xs text-slate-500 mt-1'>{item.time}</div>
            <div className='text-xs text-slate-500 mt-1'>{item.location}</div>
            <div className='mt-3'>
              <Tag color={item.confidence >= 90 ? 'green' : 'gold'}>置信度 {item.confidence}%</Tag>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}