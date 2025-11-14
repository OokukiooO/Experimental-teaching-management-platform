'use server'
import dbConnect from '@/lib/dbconn';
import Camera from '@/models/camera';

export type CameraInput = {
  name: string;
  vendor?: string;
  ip?: string;
  locationName?: string;
  streamUri: string;
  onvifUri?: string;
  note?: string;
}

export async function listCameras(){
  if(!process.env.MONGODB_URI){
    const mock = [
      { _id: 'c1', name:'柜台1-海康', vendor:'Hikvision', ip:'192.168.1.10', locationName:'柜台1', streamUri:'rtsp://user:pwd@192.168.1.10/Streaming/Channels/101', status:'online', lastOnlineAt:new Date(), note:'' },
      { _id: 'c2', name:'金库门-大华', vendor:'Dahua', ip:'192.168.1.11', locationName:'金库门口', streamUri:'rtsp://user:pwd@192.168.1.11/cam/realmonitor?channel=1&subtype=0', status:'offline', note:'网络波动' },
      { _id: 'c3', name:'过道2-宇视', vendor:'Uniview', ip:'192.168.1.12', locationName:'过道2', streamUri:'rtsp://user:pwd@192.168.1.12/Streaming/Channels/101', status:'unknown' },
    ];
    return JSON.stringify(mock);
  }
  await dbConnect();
  const items = await Camera.find().sort({ createdAt: -1 }).lean();
  return JSON.stringify(items);
}

export async function createCamera(input: CameraInput){
  if(!process.env.MONGODB_URI){
    return JSON.stringify({ ok:true, id:'mock-camera' });
  }
  await dbConnect();
  const saved = await new (Camera as any)(input).save();
  return JSON.stringify({ ok:true, id: String(saved._id) });
}
