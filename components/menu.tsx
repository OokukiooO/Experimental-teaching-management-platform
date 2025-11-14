/*
 * @Author: Jan
 * @Date: 2024-05-11 10:06:09
 * @LastEditTime: 2024-06-04 22:39:26
 * @FilePath: /EasyAIWeb/components/menu.tsx
 * @Description: 
 * 
 */
'use client';
import React, { useMemo, useState, useEffect } from 'react';
import { VideoCameraOutlined, ExceptionOutlined, AreaChartOutlined, SettingOutlined, RobotOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { usePathname } from 'next/navigation';

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

// 根据静态菜单结构生成 子 -> 父 映射
function buildParentMap(items: MenuProps['items']){
  const map: Record<string,string> = {};
  items?.forEach(it => {
    const parentKey = (it as any).key;
    const children = (it as any).children as any[] | undefined;
    if(children){
      children.forEach(c => { map[c.key] = parentKey; });
    }
  });
  return map;
}

const App: React.FC = () => {
    const pathname = usePathname();
    const parentMap = useMemo(()=>buildParentMap(menuItem), []);
    const [openKeys, setOpenKeys] = useState<string[]>([]);

    // 初始化或路径变化时，只展开当前选中子项的父级（若存在）
    useEffect(() => {
      const parent = parentMap[pathname];
      if(parent){
        setOpenKeys([parent]);
      } else {
        // 若直接访问顶级路由或没有父级，关闭所有展开
        setOpenKeys([]);
      }
    }, [pathname, parentMap]);

    const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
      // antd 传入所有展开的 keys，只保留最后一个，实现“单一展开”
      const latest = keys[keys.length - 1];
      setOpenKeys(latest ? [latest] : []);
    };

    const onSelect: MenuProps['onSelect'] = ({ key }) => {
      const parent = parentMap[key];
      if(parent){
        setOpenKeys([parent]);
      } else {
        setOpenKeys([]);
      }
    };

    return (
        <Menu
            mode="inline"
            selectedKeys={[pathname]}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            onSelect={onSelect}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItem}
        />
    );
};

export default App;