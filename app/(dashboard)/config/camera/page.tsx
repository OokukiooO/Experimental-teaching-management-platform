import React from 'react';
import { listCameras } from '@/app/actions/camera';
import CameraList from './cameralist';
import CameraDetail from './cameradetail';
import CameraModal from './cameramodal';

export default async function CameraPage(){
  const initial = JSON.parse(await listCameras());
  return (
    <div className="space-y-5">
      <div className="ui-surface p-5 flex items-center justify-between">
        <div>
          <h1 className="ui-title text-xl font-semibold text-slate-800">摄像头管理</h1>
          <p className='mt-1 text-sm text-slate-500'>维护摄像头设备、流地址与连通状态。</p>
        </div>
        <CameraModal />
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-5">
          <CameraList initial={initial} />
        </div>
        <div className="col-span-12 md:col-span-7">
          <CameraDetail />
        </div>
      </div>
    </div>
  )
}
