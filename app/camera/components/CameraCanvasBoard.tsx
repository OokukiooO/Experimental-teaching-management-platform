'use client';

import { Card, Empty } from 'antd';
import type { RefObject } from 'react';

interface CameraCanvasBoardProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  width: number;
  height: number;
  hasData: boolean;
}

export default function CameraCanvasBoard({
  canvasRef,
  width,
  height,
  hasData,
}: CameraCanvasBoardProps) {
  return (
    <Card title='实验室二维平面映射 (Canvas)'>
      <div
        style={{
          width,
          height,
          border: '1px solid #d9d9d9',
          borderRadius: 8,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {!hasData && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(255,255,255,0.92)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
            <Empty description='点击开始或单步，拉取时序数据后开始绘制' />
          </div>
        )}

        <canvas ref={canvasRef} width={width} height={height} />
      </div>
    </Card>
  );
}
