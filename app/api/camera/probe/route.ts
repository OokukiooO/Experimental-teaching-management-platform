import dbConnect from '@/lib/dbconn';
import Camera from '@/models/camera';
import { NextRequest } from 'next/server';
import { execFile } from 'child_process';

function isRtsp(uri: string){ return /^rtsp:\/\//i.test(uri) }

const probeWithHttpHead = async (url: string, timeoutMs=3000) => {
  const controller = new AbortController();
  const id = setTimeout(()=> controller.abort(), timeoutMs);
  try{
    const res = await fetch(url, { method:'HEAD', signal: controller.signal });
    return { reachable: res.ok, status: res.status }
  } catch(e:any){
    return { reachable:false, error: e?.message }
  } finally { clearTimeout(id); }
}

function probeWithFfprobe(uri: string, ffprobePath: string): Promise<{reachable:boolean, raw?:string, error?:string}>{
  return new Promise((resolve)=>{
    execFile(ffprobePath, ['-v','error','-select_streams','v:0','-show_entries','stream=codec_type','-of','default=nokey=1:noprint_wrappers=1', uri], { timeout: 5000 }, (err, stdout, stderr)=>{
      if(err){ return resolve({ reachable:false, error: stderr?.toString()||err.message }) }
      resolve({ reachable: !!stdout?.toString(), raw: stdout?.toString() })
    })
  })
}

export async function POST(req: NextRequest){
  const body = await req.json();
  const { id, streamUri } = body || {};
  let uri = streamUri as string;

  if(!uri && id){
    if(process.env.MONGODB_URI){
      await dbConnect();
  const cam = await Camera.findById(id).lean() as { streamUri?: string } | null;
  uri = cam?.streamUri || '';
    } else {
      return Response.json({ ok:true, reachable:true, mock:true, reason:'No DB configured; mock OK' })
    }
  }

  if(!uri){ return Response.json({ ok:false, reachable:false, error:'Missing streamUri' }, { status: 400 }) }

  // HTTP(S) 流用 HEAD 试探，RTSP 优先用 ffprobe；均不可用时返回不可验证
  if(/^https?:\/\//i.test(uri)){
    const r = await probeWithHttpHead(uri);
    return Response.json({ ok:true, type:'http', ...r })
  }

  if(isRtsp(uri)){
    if(process.env.ENABLE_FFPROBE === '1' && process.env.FFPROBE_PATH){
      const r = await probeWithFfprobe(uri, process.env.FFPROBE_PATH);
      return Response.json({ ok:true, type:'rtsp', ...r })
    }
    return Response.json({ ok:true, type:'rtsp', reachable:false, unverifiable:true, reason:'ffprobe disabled' })
  }

  return Response.json({ ok:true, type:'unknown', reachable:false })
}
