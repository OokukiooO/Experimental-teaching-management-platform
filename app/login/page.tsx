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
    <div className='relative h-screen overflow-hidden bg-slate-950'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.34),transparent_38%),radial-gradient(circle_at_85%_12%,rgba(14,165,233,0.26),transparent_34%),radial-gradient(circle_at_50%_95%,rgba(29,78,216,0.24),transparent_42%)]' />
      <div className='absolute inset-0 opacity-30 bg-[linear-gradient(rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.18)_1px,transparent_1px)] bg-[size:56px_56px]' />
      <div className='absolute -top-36 -left-24 h-80 w-80 rounded-full bg-blue-500/35 blur-3xl' />
      <div className='absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-cyan-400/25 blur-3xl' />

      <div className='absolute left-10 top-10 z-10 max-w-[560px] text-slate-100'>
        <div className='inline-flex items-center rounded-full border border-blue-200/30 bg-slate-900/45 px-4 py-1 text-xs tracking-[0.18em] text-blue-100'>
          EXPERIMENTAL TEACHING MANAGEMENT PLATFORM
        </div>
        <h1 className='mt-5 text-3xl font-semibold tracking-wide text-white md:text-4xl'>
          实验教学管理平台
        </h1>
        <p className='mt-3 text-sm text-slate-200/90 md:text-base'>
          智能视频分析与教学协同系统
        </p>
      </div>

      <div className='absolute bottom-8 left-10 z-10 text-xs tracking-[0.2em] text-blue-100/80'>
        EXPERIMENTAL TEACHING · SMART OPERATIONS
      </div>

      <div className='relative z-20 flex h-full items-center justify-center px-4'>
        <LoginModal visible={visible} onSuccess={onSuccess} />
      </div>
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
