/*
 * @Author: Jan
 * @Date: 2024-05-11 10:06:09
 * @LastEditTime: 2024-06-04 22:39:26
 * @FilePath: /EasyAIWeb/components/menu.tsx
 * @Description: 
 * 
 */
'use client';
import React, { Children } from 'react';
import { VideoCameraOutlined, ExceptionOutlined, AreaChartOutlined, SettingOutlined, RobotOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { usePathname } from 'next/navigation';
// import _ from 'lodash';

const { Header, Content, Sider } = Layout;

const menuItem: MenuProps['items'] = [
    {
        key: '/dashboard',
        icon: (<AreaChartOutlined />),
        label: (
            <a href="/dashboard">仪表盘</a>
        )
    },
    {
        key: '/assistant',
        icon: (<RobotOutlined />),
        label: '智能助手',
        children: [
            { key: '/assistant/overview', label: (<a href="/assistant/overview">实验室排期概览</a>) },
            { key: '/assistant/schedule', label: (<a href="/assistant/schedule">智能排课</a>) },
            { key: '/assistant/records', label: (<a href="/assistant/records">排课记录</a>) },
            { key: '/assistant/llm', label: (<a href="/assistant/llm">大模型概览</a>) },
        ]
    },
    {
        key: '/live-menu',
        icon: (<VideoCameraOutlined />),
        label: '在线预览',
        children: [
            { key: '/live', label: (<a href="/live">在线预览（正在部署）</a>) },
            { key: '/live/demo', label: (<a href="/live/demo">在线预览 Demo</a>) },
        ]
    },
    {
        key: '/event',
        icon: (<ExceptionOutlined />),
        label: '事件管理',
        children: [
            {
                key: '/event/list',
                label: (
                    <a href="/event/list">事件清单</a>
                )
            },
            {
                key: '/event/face',
                label: (
                    <a href="/event/face">人脸事件</a>
                )
            },
        ]
    },
    {
        key: '/config',
        icon: (<SettingOutlined />),
        label: (
            '系统配置'
        ),
        children: [
            {
                key: '/config/task',
                label: (
                    <a href="/config/task">任务管理</a>
                )
            },
            {
                key: '/config/algo',
                label: (
                    <a href="/config/algo">算法管理</a>
                )
            },
            {
                key: '/config/camera',
                label: (
                    <a href="/config/camera">摄像头管理</a>
                )
            },
        ]
    }
]

const App: React.FC = () => {
    // const activeItemId = menuItem?.find(itm => _.includes(usePathname(), itm!.key))?.key;
    // console.log(activeItemId);

    return (
        <Menu
            mode="inline"
            defaultSelectedKeys={[usePathname()]}
            defaultOpenKeys={[]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItem}
        />
    );
};

export default App;