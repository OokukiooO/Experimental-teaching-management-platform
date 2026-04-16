/*
 * @Author: Jan
 * @Date: 2024-05-15 10:25:56
 * @LastEditTime: 2024-06-04 21:58:24
 * @FilePath: /EasyAIWeb/app/(dashboard)/event/list/page.tsx
 * @Description: 
 * 
 */
'use client'
import React from 'react';
import Eventtable from './eventtable'

export default function EventPage() {

    return (
        <div className='space-y-4'>
            <div className='ui-surface p-5'>
                <h1 className='ui-title text-xl font-semibold text-slate-800'>事件清单</h1>
                <p className='mt-1 text-sm text-slate-500'>支持状态筛选、时间排序、分页浏览、事件详情查看、标记处理与删除操作。</p>
            </div>
            <div className='ui-surface p-3'>
                <Eventtable></Eventtable>
            </div>
        </div>
    )
}