'use client';

import { useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import type {
  CameraStepData,
  CameraStepResponse,
  CameraStrategy,
  UrgencyPoint,
} from '../types';

const DEFAULT_STRATEGY: CameraStrategy = 'greedy';
const TICK_MS = 500;

const FALLBACK_STEP: CameraStepData = {
  step: 1,
  angle: 135,
  covered: ['P1'],
  total_urgency: 96,
  pois: [
    { id: 'P1', x: 10, y: 80, w: 10, last_seen: 1 },
    { id: 'P2', x: 28, y: 65, w: 8, last_seen: 0 },
    { id: 'P3', x: 72, y: 32, w: 12, last_seen: 1 },
    { id: 'P4', x: 86, y: 75, w: 6, last_seen: 0 },
  ],
};

function mockStep(prev: CameraStepData): CameraStepData {
  const nextStep = prev.step + 1;
  const nextAngle = (prev.angle + 25) % 360;
  const covered = prev.pois
    .filter((poi, index) => index % 2 === nextStep % 2)
    .map((poi) => poi.id);

  const pois = prev.pois.map((poi, index) => {
    const jitter = ((nextStep + index * 7) % 3) - 1;
    return {
      ...poi,
      x: Math.max(5, Math.min(95, poi.x + jitter * 0.8)),
      y: Math.max(5, Math.min(95, poi.y - jitter * 0.6)),
      last_seen: covered.includes(poi.id) ? nextStep : poi.last_seen,
    };
  });

  const totalUrgency = pois.reduce((sum, poi) => {
    const urgency = Math.max(0, poi.w * (nextStep - poi.last_seen));
    return sum + urgency;
  }, 0);

  return {
    step: nextStep,
    angle: nextAngle,
    covered,
    total_urgency: Number(totalUrgency.toFixed(2)),
    pois,
  };
}

export function useCameraSimulation() {
  const [running, setRunning] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [strategy, setStrategy] = useState<CameraStrategy>(DEFAULT_STRATEGY);
  const [stepData, setStepData] = useState<CameraStepData | null>(null);
  const [trend, setTrend] = useState<UrgencyPoint[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const engineErrorNotifiedRef = useRef<boolean>(false);

  const pushTrend = (data: CameraStepData) => {
    setTrend((prev) => {
      const next = [...prev, { step: data.step, totalUrgency: data.total_urgency }];
      // 仅保留最近 30 个点，避免图表无限增长。
      return next.slice(-30);
    });
  };

  const fetchOneStep = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/camera/step?strategy=${strategy}`, {
        cache: 'no-store',
      });

      if (response.status >= 500) {
        throw new Error('ALGO_ENGINE_UNAVAILABLE');
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = (await response.json()) as CameraStepResponse;
      if (json.status !== 'success') {
        throw new Error('仿真接口返回失败');
      }

      engineErrorNotifiedRef.current = false;
      setStepData(json.data);
      pushTrend(json.data);
      return json.data;
    } catch (error) {
      if (
        (error as Error).message === 'ALGO_ENGINE_UNAVAILABLE' &&
        !engineErrorNotifiedRef.current
      ) {
        void message.error('算法引擎连接失败，请检查后端服务');
        engineErrorNotifiedRef.current = true;
      }
      console.error('拉取仿真步数据失败，使用本地 mock:', error);
      setStepData((prev) => {
        const seed = prev ?? FALLBACK_STEP;
        const next = mockStep(seed);
        pushTrend(next);
        return next;
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const start = () => {
    if (timerRef.current) {
      return;
    }

    setRunning(true);
    timerRef.current = setInterval(() => {
      void fetchOneStep();
    }, TICK_MS);
  };

  const pause = () => {
    setRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const singleStep = async () => {
    await fetchOneStep();
  };

  const reset = () => {
    pause();
    setStepData(null);
    setTrend([]);
    void message.success('仿真状态已重置');
  };

  useEffect(() => {
    // 切换策略时自动停表并清理历史，让不同策略结果互不干扰。
    pause();
    setStepData(null);
    setTrend([]);
  }, [strategy]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    running,
    loading,
    strategy,
    stepData,
    trend,
    setStrategy,
    start,
    pause,
    singleStep,
    reset,
  };
}
