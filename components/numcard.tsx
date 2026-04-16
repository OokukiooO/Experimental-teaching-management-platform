/*
 * @Author: Jan
 * @Date: 2024-05-10 14:41:50
 * @LastEditTime: 2024-05-14 17:17:14
 * @FilePath: /EasyAIWeb/components/numcard.tsx
 * @Description: The card component used for numerical indicators display
 */
'use client'
import React from 'react';
import { Card } from 'antd';
import * as Icons from '@ant-design/icons';

export default function NumCard({ name, value, color, icon }: { name: string, value: string, color: string, icon: keyof typeof Icons }) {
    const cardStyle = {
        color,
        borderRadius: 16,
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fbff 100%)',
        border: '1px solid #dbe7ff',
        boxShadow: '0 10px 28px rgba(37, 99, 235, 0.1)'
    }

    const IconComponent = Icons[icon]

    return (
        <Card className='relative h-36 overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg' style={cardStyle}>
            {/* @ts-ignore */}
            <div className="absolute -left-2 bottom-2 opacity-20"><IconComponent style={{ fontSize: '7rem' }} /></div>
            <div className='absolute top-5 right-7 font-bold text-5xl leading-none'>{value}</div>
            <div className='absolute top-2/3 right-7 text-base font-semibold tracking-wide'>{name}</div>
        </Card>
    );
}