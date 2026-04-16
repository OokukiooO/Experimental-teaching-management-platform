import React from 'react';
import { listAlgoNodes } from '@/app/actions/algo';
import AlgoCards from './algocards';
import AlgoModal from './algomodal';

export default async function AlgoPage(){
  const initial = JSON.parse(await listAlgoNodes());
  return (
    <div className="space-y-5">
      <div className="ui-surface p-5 flex items-center justify-between">
        <div>
          <h1 className="ui-title text-xl font-semibold text-slate-800">算法管理</h1>
          <p className='mt-1 text-sm text-slate-500'>查看算法节点状态与资源占用，并执行心跳探测。</p>
        </div>
        <AlgoModal />
      </div>
      <div className='ui-surface p-4'>
        <AlgoCards initial={initial} />
      </div>
    </div>
  )
}
