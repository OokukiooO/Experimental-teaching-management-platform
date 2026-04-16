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
    if (info.key === 'info') {
      location.href = '/profile';
      return;
    }
    if (info.key === 'logout') {
      await fetch('/api/auth/logout', { method: 'POST' });
      location.reload();
    }
  };

  const letter = (user?.name || 'U').charAt(0).toUpperCase();
  return (
    <Dropdown menu={{ items, onClick }} trigger={['click']}>
      <div className='cursor-pointer px-3 py-2 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all flex items-center gap-2'>
        <div className='w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center text-sm font-semibold'>{letter}</div>
        <span className='text-sm text-slate-700'>{user ? user.name : '未登录'}</span>
      </div>
    </Dropdown>
  );
}
