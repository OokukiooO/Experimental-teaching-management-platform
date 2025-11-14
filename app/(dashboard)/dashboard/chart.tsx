/*
 * @Author: Jan
 * @Date: 2024-05-14 17:19:06
 * @LastEditTime: 2024-06-06 23:19:08
 * @FilePath: /EasyAIWeb/app/(dashboard)/dashboard/chart.tsx
 * @Description: 
 * 
 */
'use client'
import dynamic from 'next/dynamic';
const Line = dynamic(() => import('@ant-design/plots').then(({ Line }) => Line), { ssr: false });
const Column = dynamic(() => import('@ant-design/plots').then(({ Column }) => Column), { ssr: false });
// import { Line, Column } from '@ant-design/charts';
import React from 'react';

const LineChart = () => {
    const data = [
        { year: '05-01', value: 3 },
        { year: '05-02', value: 4 },
        { year: '05-03', value: 3 },
        { year: '05-04', value: 5 },
        { year: '05-05', value: 6 },
        { year: '05-06', value: 3 },
        { year: '05-07', value: 2 },
    ];
    const config = {
        data,
        xField: 'year',
        yField: 'value',
        point: {
            shapeField: 'square',
            sizeField: 4,
        },
        interaction: {
            tooltip: {
                marker: false,
            },
        },
        style: {
            lineWidth: 2,
        },
        title:"检测事件总数"
    };
    return <Line {...config} />;
};

const ColumnChart = () => {
    const config = {
        title:"检测事件数量",
        data: {
            value: [{
                "letter": "玩手机",
                "frequency": 0.08167
            },
            {
                "letter": "金库出入不规范",
                "frequency": 0.01492
            },
            {
                "letter": "杂物占用",
                "frequency": 0.02782
            }, {
                "letter": "其他警告",
                "frequency": 0.02782
            }],
        },
        xField: 'letter',
        yField: 'frequency',
        label: {
            text: (d: any) => `${(d.frequency * 100).toFixed(1)}%`,
            textBaseline: 'bottom',
        },
        axis: {
            y: {
                labelFormatter: '.0%',
            },
        },
    };
    return <Column {...config
    } />;
};

export { LineChart, ColumnChart }
