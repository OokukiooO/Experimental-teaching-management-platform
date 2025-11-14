import dbConnect from '@/lib/dbconn';
import AlgoNode from '@/models/algoNode';

export async function POST(req: Request){
  const body = await req.json();
  if(!process.env.MONGODB_URI){
    return Response.json({ ok:true, id:'mock-algo' });
  }
  await dbConnect();
  const saved = await new (AlgoNode as any)({ ...body, status:'offline' }).save();
  return Response.json({ ok:true, id: String(saved._id) });
}
