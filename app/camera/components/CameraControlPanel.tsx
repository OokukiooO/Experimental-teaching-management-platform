'use client';

import {
  Button,
  Card,
  Descriptions,
  Select,
  Space,
  Statistic,
  Tag,
  Typography,
} from 'antd';
import type { CameraStepData, CameraStrategy } from '../types';

interface CameraControlPanelProps {
  running: boolean;
  loading: boolean;
  strategy: CameraStrategy;
  stepData: CameraStepData | null;
  onChangeStrategy: (strategy: CameraStrategy) => void;
  onStart: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
}

export default function CameraControlPanel({
  running,
  loading,
  strategy,
  stepData,
  onChangeStrategy,
  onStart,
  onPause,
  onStep,
  onReset,
}: CameraControlPanelProps) {
  return (
    <Card title='仿真控制面板' bordered>
      <Space direction='vertical' size={16} style={{ width: '100%' }}>
        <div>
          <Typography.Text strong>调度策略</Typography.Text>
          <Select
            style={{ width: '100%', marginTop: 8 }}
            value={strategy}
            options={[
              { label: 'Greedy 贪心策略', value: 'greedy' },
              { label: 'Round Robin 轮转策略', value: 'round_robin' },
              { label: 'Weight First 权重优先', value: 'weight_first' },
            ]}
            onChange={(value) => onChangeStrategy(value as CameraStrategy)}
          />
        </div>

        <Space wrap>
          <Button type='primary' onClick={onStart} disabled={running || loading}>
            开始
          </Button>
          <Button onClick={onPause} disabled={!running}>
            暂停
          </Button>
          <Button onClick={onStep} loading={loading}>
            单步
          </Button>
          <Button danger onClick={onReset}>
            重置
          </Button>
        </Space>

        <Statistic
          title='总紧迫度 (total_urgency)'
          value={stepData?.total_urgency ?? 0}
          precision={2}
          valueStyle={{ color: '#cf1322' }}
        />

        <Descriptions column={1} size='small' bordered>
          <Descriptions.Item label='当前步数'>
            {stepData?.step ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label='相机角度'>
            {stepData?.angle ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label='已覆盖 POI'>
            {stepData?.covered?.length ? (
              <Space wrap>
                {stepData.covered.map((id) => (
                  <Tag key={id} color='processing'>
                    {id}
                  </Tag>
                ))}
              </Space>
            ) : (
              '-'
            )}
          </Descriptions.Item>
        </Descriptions>
      </Space>
    </Card>
  );
}
