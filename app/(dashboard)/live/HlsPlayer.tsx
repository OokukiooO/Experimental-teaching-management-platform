"use client";
import React, { useEffect, useRef } from 'react';
import Script from 'next/script';

declare global { interface Window { Hls:any } }

export default function HlsPlayer({ src }: { src:string }){
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(()=>{
    const video = videoRef.current;
    if(!video) return;
    const run = async ()=>{
      if(video.canPlayType('application/vnd.apple.mpegurl')){
        video.src = src; return;
      }
      if(window.Hls){
        const hls = new window.Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
      }
    };
    run();
  }, [src]);

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/hls.js@latest" strategy="afterInteractive" />
      <video ref={videoRef} className="w-full aspect-video bg-black" controls autoPlay muted playsInline />
    </>
  )
}
