export type StreamType = 'hls'|'mp4'|'mjpeg'|'image'|'rtsp'|'unknown';

export function normalizeUrl(url: string){
  if(!url) return url;
  return url.trim();
}

export function detectStreamType(url: string): StreamType{
  if(!url) return 'unknown';
  const u = url.toLowerCase();
  if(u.startsWith('rtsp://')) return 'rtsp';
  if(u.endsWith('.m3u8')) return 'hls';
  if(u.endsWith('.mp4')) return 'mp4';
  if(u.includes('/mjpeg') || u.includes('mjpg') || u.includes('mjpeg')) return 'mjpeg';
  if(u.match(/\.(png|jpg|jpeg|gif|webp)(\?.*)?$/)) return 'image';
  return 'unknown';
}
