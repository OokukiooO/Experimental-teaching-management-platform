"use client";
import React, { useEffect, useState } from 'react';
import LoginModal from './LoginModal';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  const checkAuth = async () => {
    const res = await fetch('/api/auth/me');
    const data = await res.json();
    setAuthed(!!data.user);
    setChecked(true);
  };

  useEffect(() => { checkAuth(); }, []);

  const handleSuccess = async () => {
    await checkAuth();
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={authed ? {} : { filter: 'blur(5px)', pointerEvents: 'none', userSelect: 'none' }}>
        {children}
      </div>
      {checked && !authed && <LoginModal visible={!authed} onSuccess={handleSuccess} />}
    </div>
  );
}
