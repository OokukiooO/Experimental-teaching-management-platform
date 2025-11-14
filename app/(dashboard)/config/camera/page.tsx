import React from 'react';
import { listCameras } from '@/app/actions/camera';
import CameraList from './cameralist';
import CameraDetail from './cameradetail';
import CameraModal from './cameramodal';

export default async function CameraPage(){
  const initial = JSON.parse(await listCameras());
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">摄像头管理</h1>
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
