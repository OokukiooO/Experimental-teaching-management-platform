import dbConnect from '@/lib/dbconn';
import Camera from '@/models/camera';

export async function POST(req: Request){
  const body = await req.json();
  if(!process.env.MONGODB_URI){
    return Response.json({ ok:true, id:'mock-camera' });
  }
  await dbConnect();
  const saved = await new (Camera as any)(body).save();
  return Response.json({ ok:true, id: String(saved._id) });
}
