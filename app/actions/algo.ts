'use server'
import dbConnect from '@/lib/dbconn';
import AlgoNode from '@/models/algoNode';

export type AlgoInput = {
  name: string;
  host: string;
  apiBase?: string;
}

export async function listAlgoNodes(){
  if(!process.env.MONGODB_URI){
    const mock = [
      { _id:'a1', name:'GPU-Node-01', host:'10.0.0.11', apiBase:'http://10.0.0.11:8080', status:'online', version:'1.3.2', cpuUsage:32, memUsage:45, gpuName:'RTX 4060', gpuMemTotal:8192, gpuMemUsed:4096, connectedCameras:4, lastHeartbeatAt:new Date() },
      { _id:'a2', name:'Edge-Box-02', host:'10.0.0.12', apiBase:'http://10.0.0.12:8080', status:'degraded', version:'1.2.9', cpuUsage:78, memUsage:82, gpuName:'T4', gpuMemTotal:16384, gpuMemUsed:14000, connectedCameras:6 },
      { _id:'a3', name:'CPU-Only-03', host:'10.0.0.13', status:'offline', version:'1.1.0', cpuUsage:0, memUsage:0, connectedCameras:0 },
    ];
    return JSON.stringify(mock);
  }
  await dbConnect();
  const items = await AlgoNode.find().sort({ createdAt:-1 }).lean();
  return JSON.stringify(items);
}

export async function createAlgoNode(input: AlgoInput){
  if(!process.env.MONGODB_URI){
    return JSON.stringify({ ok:true, id:'mock-algo' });
  }
  await dbConnect();
  const saved = await new (AlgoNode as any)({ ...input, status:'offline' }).save();
  return JSON.stringify({ ok:true, id: String(saved._id) });
}
