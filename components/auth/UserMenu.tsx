"use client";
import React from 'react';
import { Dropdown } from 'antd';

interface Props { user: { name: string; role: string } | null }

export default function UserMenu({ user }: Props) {
  const items = [
    { key: 'info', label: user ? user.name : '未登录' },
    { key: 'logout', label: '退出登录' }
  ];

  const onClick = async (info: any) => {
    if (info.key === 'logout') {
      await fetch('/api/auth/logout', { method: 'POST' });
      location.reload();
    }
  };

  const letter = (user?.name || 'U').charAt(0).toUpperCase();
  return (
    <Dropdown menu={{ items, onClick }} trigger={['click']}>
      <div className='cursor-pointer px-2 py-1 rounded bg-gray-100 flex items-center gap-2'>
        <div className='w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm'>{letter}</div>
        <span>{user ? user.name : '未登录'}</span>
      </div>
    </Dropdown>
  );
}
