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
        color
    }

    const IconComponent = Icons[icon]

    return (
        <Card className='relative h-36 overflow-hidden' style={cardStyle}>
            {/* @ts-ignore */}
            <div className="absolute left-4 bottom-4 opacity-70"><IconComponent style={{ fontSize: '6rem' }} /></div>
            <div className='absolute top-6 right-8 font-bold text-6xl'>{value}</div>
            <div className='absolute top-2/3 right-8 text-lg font-bold'>{name}</div>
        </Card>
    );
}