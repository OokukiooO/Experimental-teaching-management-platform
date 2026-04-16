"use client";
import React from 'react';

interface Props {
  title?: string;
  detail?: string;
  suggestion?: string;
}

export default function ErrorMessage({ title='发生错误', detail, suggestion }: Props){
  return (
    <div className="mx-auto max-w-xl p-6 border border-red-200 bg-gradient-to-b from-red-50 to-white rounded-2xl shadow-[0_10px_25px_rgba(239,68,68,0.12)]">
      <h2 className="text-red-600 font-semibold mb-2 tracking-wide">{title}</h2>
      {detail && <p className="text-sm text-red-700 whitespace-pre-wrap mb-2 leading-6">{detail}</p>}
      {suggestion && <p className="text-xs text-red-500">{suggestion}</p>}
    </div>
  )
}