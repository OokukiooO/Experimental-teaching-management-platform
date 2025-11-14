import dbConnect from '@/lib/dbconn';
import AlgoNode from '@/models/algoNode';

export async function POST(req: Request){
  const body = await req.json();
  const { id, host, apiBase } = body || {};
  const now = new Date();

  if(!process.env.MONGODB_URI){
    // mock：随机状态
    const states = ['online','degraded','offline'] as const;
    const status = states[Math.floor(Math.random()*states.length)];
    return Response.json({ ok:true, id: id||'mock', status, lastHeartbeatAt: now, mock:true })
  }

  await dbConnect();
  if(!id){
    return Response.json({ ok:false, error:'missing id' }, { status:400 })
  }
  const node = await AlgoNode.findById(id);
  if(!node){
    return Response.json({ ok:false, error:'node not found' }, { status:404 })
  }
  node.lastHeartbeatAt = now;
  node.status = 'online';
  await node.save();
  return Response.json({ ok:true, id, status: node.status, lastHeartbeatAt: now })
}
