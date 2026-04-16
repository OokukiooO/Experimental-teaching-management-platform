import Image from "next/image";
import React from 'react';
import { Button } from 'antd';

export default function Home() {
  return (
    <main className="min-h-screen p-8 md:p-12">
      <div className='mx-auto max-w-6xl space-y-6'>
        <div className='ui-surface p-8'>
          <h1 className='ui-title text-3xl font-semibold text-slate-800'>实验教学管理平台</h1>
          <p className='mt-2 text-slate-600'>统一管理实验任务、视频预览、事件监控与智能辅助排课。</p>
          <div className='mt-5'>
            <a href='/login'><Button type="primary">进入系统</Button></a>
          </div>
        </div>

      <div className="grid gap-4 text-center lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="ui-surface group rounded-xl px-5 py-4 transition-all hover:-translate-y-0.5"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            使用文档{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="ui-surface group rounded-xl px-5 py-4 transition-all hover:-translate-y-0.5"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            学习{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="ui-surface group rounded-xl px-5 py-4 transition-all hover:-translate-y-0.5"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            登陆{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Explore starter templates for Next.js.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="ui-surface group rounded-xl px-5 py-4 transition-all hover:-translate-y-0.5"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            一键启动{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-balance text-sm opacity-50">
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
      </div>
    </main>
  );
}
