'use client';

import { Card, Segmented, Select, Space, Tag, Typography } from 'antd';
import type { ScheduleViewMode } from '../types';

interface ScheduleToolbarProps {
  mode: ScheduleViewMode;
  entities: string[];
  selectedEntity: string;
  fitnessScore: number;
  loading: boolean;
  onModeChange: (mode: ScheduleViewMode) => void;
  onEntityChange: (entity: string) => void;
}

export default function ScheduleToolbar({
  mode,
  entities,
  selectedEntity,
  fitnessScore,
  loading,
  onModeChange,
  onEntityChange,
}: ScheduleToolbarProps) {
  return (
    <Card>
      <Space size={16} wrap>
        <Segmented
          value={mode}
          options={[
            { label: '按班级查看', value: 'class' },
            { label: '按教师查看', value: 'teacher' },
          ]}
          onChange={(value) => onModeChange(value as ScheduleViewMode)}
        />

        <Select
          style={{ width: 240 }}
          loading={loading}
          value={selectedEntity}
          options={entities.map((entity) => ({ label: entity, value: entity }))}
          onChange={onEntityChange}
          placeholder={mode === 'class' ? '选择班级' : '选择教师'}
        />

        <Typography.Text type='secondary'>算法适应度：</Typography.Text>
        <Tag color='blue'>{fitnessScore}</Tag>
      </Space>
    </Card>
  );
}
