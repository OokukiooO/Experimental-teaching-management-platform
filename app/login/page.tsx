"use client";
import React, { useEffect, Suspense } from 'react';
import LoginModal from '@/components/auth/LoginModal';
import { useSearchParams, useRouter } from 'next/navigation';

function LoginInner() {
  const [visible, setVisible] = React.useState(true);
  const params = useSearchParams();
  const router = useRouter();
  const next = params.get('next') || '/dashboard';

  const onSuccess = () => {
    setVisible(false);
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

export default function LoginPage(){
  return (
    <Suspense fallback={<div />}> 
      <LoginInner />
    </Suspense>
  );
}
