import React from 'react';
import { listAlgoNodes } from '@/app/actions/algo';
import AlgoCards from './algocards';
import AlgoModal from './algomodal';

export default async function AlgoPage(){
  const initial = JSON.parse(await listAlgoNodes());
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">算法管理</h1>
        <AlgoModal />
      </div>
      <AlgoCards initial={initial} />
    </div>
  )
}
