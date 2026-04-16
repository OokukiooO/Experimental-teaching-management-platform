'use client';

import { useEffect, useRef } from 'react';
import type { CameraPoi, CameraStepData } from '../types';

const CANVAS_SIZE = 800;
const PADDING = 48;

function mapValueToCanvas(value: number) {
  return PADDING + (value / 100) * (CANVAS_SIZE - PADDING * 2);
}

function toUrgencyColor(urgency: number, maxUrgency: number) {
  // 线性插值：低紧迫度更偏绿色，高紧迫度更偏红色。
  const ratio = maxUrgency <= 0 ? 0 : Math.min(1, urgency / maxUrgency);
  const red = Math.round(32 + (220 - 32) * ratio);
  const green = Math.round(180 + (50 - 180) * ratio);
  const blue = Math.round(60 + (40 - 60) * ratio);
  return `rgb(${red}, ${green}, ${blue})`;
}

function drawLabBackground(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  const gradient = ctx.createLinearGradient(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  gradient.addColorStop(0, '#f7fbff');
  gradient.addColorStop(1, '#eaf2ff');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // 绘制实验室主轮廓。
  ctx.strokeStyle = '#8aa7d6';
  ctx.lineWidth = 2;
  ctx.strokeRect(PADDING, PADDING, CANVAS_SIZE - PADDING * 2, CANVAS_SIZE - PADDING * 2);

  // 参考网格，用于强化 0-100 物理坐标映射感。
  ctx.strokeStyle = 'rgba(118, 146, 189, 0.18)';
  ctx.lineWidth = 1;
  for (let i = 1; i < 10; i += 1) {
    const x = mapValueToCanvas(i * 10);
    const y = mapValueToCanvas(i * 10);
    ctx.beginPath();
    ctx.moveTo(x, PADDING);
    ctx.lineTo(x, CANVAS_SIZE - PADDING);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(PADDING, y);
    ctx.lineTo(CANVAS_SIZE - PADDING, y);
    ctx.stroke();
  }
}

function drawPoi(
  ctx: CanvasRenderingContext2D,
  poi: CameraPoi,
  currentStep: number,
  maxUrgency: number,
  coveredSet: Set<string>,
) {
  const urgency = Math.max(0, poi.w * (currentStep - poi.last_seen));
  const x = mapValueToCanvas(poi.x);
  const y = mapValueToCanvas(poi.y);

  ctx.beginPath();
  ctx.arc(x, y, 9, 0, Math.PI * 2);
  ctx.fillStyle = toUrgencyColor(urgency, maxUrgency);
  ctx.fill();

  if (coveredSet.has(poi.id)) {
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.strokeStyle = '#1677ff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  ctx.fillStyle = '#1f1f1f';
  ctx.font = '12px sans-serif';
  ctx.fillText(`${poi.id}(${urgency.toFixed(1)})`, x + 12, y - 8);
}

function drawCameraAndFov(ctx: CanvasRenderingContext2D, angle: number) {
  const centerX = mapValueToCanvas(50);
  const centerY = mapValueToCanvas(50);
  const radius = mapValueToCanvas(60) - mapValueToCanvas(0);

  // 绘制相机本体。
  ctx.beginPath();
  ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
  ctx.fillStyle = '#003a8c';
  ctx.fill();

  const halfFov = 30;
  const start = ((angle - halfFov) * Math.PI) / 180;
  const end = ((angle + halfFov) * Math.PI) / 180;

  // 半透明蓝色扇形表示当前视场角覆盖区域。
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, start, end);
  ctx.closePath();
  ctx.fillStyle = 'rgba(22, 119, 255, 0.28)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, start, end);
  ctx.strokeStyle = 'rgba(22, 119, 255, 0.65)';
  ctx.lineWidth = 2;
  ctx.stroke();
}

export function useCameraCanvas(stepData: CameraStepData | null) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !stepData) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    drawLabBackground(ctx);

    const maxUrgency = Math.max(
      1,
      ...stepData.pois.map((poi) => Math.max(0, poi.w * (stepData.step - poi.last_seen))),
    );

    const coveredSet = new Set(stepData.covered);
    stepData.pois.forEach((poi) =>
      drawPoi(ctx, poi, stepData.step, maxUrgency, coveredSet),
    );

    drawCameraAndFov(ctx, stepData.angle);
  }, [stepData]);

  return {
    canvasRef,
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
  };
}
