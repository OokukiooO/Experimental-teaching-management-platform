"use client";
import React from 'react';

interface Props {
  title?: string;
  detail?: string;
  suggestion?: string;
}

export default function ErrorMessage({ title='发生错误', detail, suggestion }: Props){
  return (
    <div className="mx-auto max-w-xl p-6 border border-red-200 bg-red-50 rounded-md shadow-sm">
      <h2 className="text-red-600 font-semibold mb-2">{title}</h2>
      {detail && <p className="text-sm text-red-700 whitespace-pre-wrap mb-2">{detail}</p>}
      {suggestion && <p className="text-xs text-red-500">{suggestion}</p>}
    </div>
  )
}