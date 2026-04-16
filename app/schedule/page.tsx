'use client';

import { useEffect, useMemo, useState } from 'react';
import { Alert, Space, Spin, message } from 'antd';
import ScheduleMatrix from './components/ScheduleMatrix';
import ScheduleToolbar from './components/ScheduleToolbar';
import type { DragPayload, ScheduleApiResponse, ScheduleItem, ScheduleViewMode } from './types';

const FALLBACK_DATA: ScheduleItem[] = [
  {
    course: '基础IE实验',
    class_name: 'IE21级1班',
    teacher: '吴老师',
    room: '机房A',
    time_slot: 3,
  },
  {
    course: '智能制造实验',
    class_name: 'IE21级2班',
    teacher: '李老师',
    room: '机房B',
    time_slot: 6,
  },
  {
    course: '数据分析实验',
    class_name: 'IE21级1班',
    teacher: '王老师',
    room: '机房A',
    time_slot: 8,
  },
];

function extractEntities(schedules: ScheduleItem[], mode: ScheduleViewMode) {
  const values = schedules.map((item) =>
    mode === 'class' ? item.class_name : item.teacher,
  );
  return Array.from(new Set(values));
}

export default function SchedulePage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<ScheduleViewMode>('class');
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [fitnessScore, setFitnessScore] = useState<number>(0);
  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const [conflictSlot, setConflictSlot] = useState<number | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/schedule', { cache: 'no-store' });
        if (response.status >= 500) {
          throw new Error('ALGO_ENGINE_UNAVAILABLE');
        }
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const json = (await response.json()) as ScheduleApiResponse;
        if (json.status !== 'success') {
          throw new Error('排课接口返回失败');
        }

        setSchedules(json.schedule ?? []);
        setFitnessScore(json.fitness_score ?? 0);
      } catch (error) {
        if ((error as Error).message === 'ALGO_ENGINE_UNAVAILABLE') {
          void message.error('算法引擎连接失败，请检查后端服务');
        }
        console.error('获取排课数据失败，使用本地兜底数据:', error);
        setSchedules(FALLBACK_DATA);
        setFitnessScore(860);
      } finally {
        setLoading(false);
      }
    };

    void fetchSchedule();
  }, []);

  const entities = useMemo(() => extractEntities(schedules, mode), [schedules, mode]);

  useEffect(() => {
    // 当视图切换或数据变更时，自动回到第一个可选实体，避免空筛选。
    setSelectedEntity((prev) => {
      if (prev && entities.includes(prev)) {
        return prev;
      }
      return entities[0] ?? '';
    });
  }, [entities]);

  const handleManualAdjust = (dragPayload: DragPayload, targetSlot: number) => {
    const targetItem = schedules[dragPayload.itemIndex];
    if (!targetItem || targetItem.time_slot === targetSlot) {
      return;
    }

    const hasConflict = schedules.some((item, index) => {
      if (index === dragPayload.itemIndex || item.time_slot !== targetSlot) {
        return false;
      }

      // BFF 层冲突模拟：同一时间槽下，班级或教师冲突都直接拦截。
      const classConflict = item.class_name === targetItem.class_name;
      const teacherConflict = item.teacher === targetItem.teacher;
      return classConflict || teacherConflict;
    });

    if (hasConflict) {
      setConflictSlot(targetSlot);
      void message.error('冲突拦截：教师时间冲突或实验室容量不足');
      setTimeout(() => setConflictSlot(null), 1200);
      return;
    }

    setSchedules((prev) =>
      prev.map((item, index) =>
        index === dragPayload.itemIndex ? { ...item, time_slot: targetSlot } : item,
      ),
    );

    void message.success('微调成功');
  };

  return (
    <Space direction='vertical' size={16} style={{ width: '100%' }}>
      <Alert
        showIcon
        type='info'
        message='说明：课表支持拖拽微调，系统会在前端模拟冲突校验（班级/教师时间冲突）并提示拦截。'
      />

      <ScheduleToolbar
        mode={mode}
        entities={entities}
        selectedEntity={selectedEntity}
        fitnessScore={fitnessScore}
        loading={loading}
        onModeChange={setMode}
        onEntityChange={setSelectedEntity}
      />

      <Spin spinning={loading}>
        <ScheduleMatrix
          schedules={schedules}
          mode={mode}
          selectedEntity={selectedEntity}
          conflictSlot={conflictSlot}
          onDropToSlot={handleManualAdjust}
        />
      </Spin>
    </Space>
  );
}
