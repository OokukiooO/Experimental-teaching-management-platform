"use client";
import React, { useEffect } from 'react';
import LoginModal from '@/components/auth/LoginModal';
import { useSearchParams, useRouter } from 'next/navigation';

export default function LoginPage() {
  const [visible, setVisible] = React.useState(true);
  const params = useSearchParams();
  const router = useRouter();
  const next = params.get('next') || '/dashboard';

  const onSuccess = () => {
    setVisible(false);
    // 使用硬跳转，确保 Set-Cookie 立即生效并触发中间件放行
    if (typeof window !== 'undefined') {
      window.location.replace(next);
    } else {
      router.replace(next);
    }
  };

  useEffect(()=>{ setVisible(true); }, [next]);

  return (
    <div className='h-screen flex items-center justify-center'>
      <LoginModal visible={visible} onSuccess={onSuccess} />
    </div>
  );
}
