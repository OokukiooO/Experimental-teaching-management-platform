'use client';

import { Card, Empty, Tag, Typography } from 'antd';
import type { CSSProperties } from 'react';
import type { DragPayload, ScheduleItem, ScheduleViewMode } from '../types';

const WEEK_DAYS = ['周一', '周二', '周三', '周四', '周五'];
const PERIODS = ['第1节', '第2节', '第3节'];

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '120px repeat(5, minmax(140px, 1fr))',
  border: '1px solid #f0f0f0',
  borderRadius: 8,
  overflow: 'hidden',
};

interface ScheduleMatrixProps {
  schedules: ScheduleItem[];
  mode: ScheduleViewMode;
  selectedEntity: string;
  conflictSlot: number | null;
  onDropToSlot: (dragPayload: DragPayload, targetSlot: number) => void;
}

function toSlot(dayIndex: number, periodIndex: number) {
  return dayIndex * 3 + periodIndex + 1;
}

function getSlot(item: ScheduleItem) {
  return item.time_slot;
}

export default function ScheduleMatrix({
  schedules,
  mode,
  selectedEntity,
  conflictSlot,
  onDropToSlot,
}: ScheduleMatrixProps) {
  const filtered = schedules.filter((item) => {
    if (!selectedEntity) {
      return true;
    }

    return mode === 'class'
      ? item.class_name === selectedEntity
      : item.teacher === selectedEntity;
  });

  return (
    <Card title='实验教学智能排课看板' extra={<Typography.Text type='secondary'>拖拽课程卡片到新时间槽可微调</Typography.Text>}>
      <div style={gridStyle}>
        <div style={{ padding: 12, background: '#fafafa', borderBottom: '1px solid #f0f0f0' }} />
        {WEEK_DAYS.map((day) => (
          <div key={day} style={{ padding: 12, textAlign: 'center', fontWeight: 600, background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
            {day}
          </div>
        ))}

        {PERIODS.map((period, periodIndex) => (
          <div key={`period-row-${period}`} style={{ display: 'contents' }}>
            <div
              key={`${period}-label`}
              style={{
                padding: 12,
                background: '#fafafa',
                borderTop: '1px solid #f0f0f0',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {period}
            </div>

            {WEEK_DAYS.map((_, dayIndex) => {
              const slot = toSlot(dayIndex, periodIndex);
              const slotsItems = filtered.filter((item) => getSlot(item) === slot);
              const isConflictCell = conflictSlot === slot;

              return (
                <div
                  key={`slot-${slot}`}
                  style={{
                    minHeight: 130,
                    padding: 8,
                    borderTop: '1px solid #f0f0f0',
                    borderLeft: '1px solid #f0f0f0',
                    background: isConflictCell ? '#fff1f0' : '#fff',
                    transition: 'background .2s ease',
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    const payloadText = e.dataTransfer.getData('application/json');
                    if (!payloadText) {
                      return;
                    }

                    const payload = JSON.parse(payloadText) as DragPayload;
                    onDropToSlot(payload, slot);
                  }}
                >
                  {slotsItems.length === 0 ? (
                    <div style={{ color: '#bfbfbf', fontSize: 12 }}>空闲</div>
                  ) : (
                    slotsItems.map((item, itemIndex) => {
                      // 这里使用全量数组下标，确保拖拽后可以定位到原始课表项。
                      const rawIndex = schedules.findIndex((origin) => origin === item);

                      return (
                        <div
                          key={`${item.course}-${item.teacher}-${item.class_name}-${item.time_slot}-${itemIndex}`}
                          draggable
                          onDragStart={(e) => {
                            const payload: DragPayload = {
                              itemIndex: rawIndex,
                              originSlot: item.time_slot,
                            };
                            e.dataTransfer.setData('application/json', JSON.stringify(payload));
                          }}
                          style={{
                            border: '1px solid #91caff',
                            background: '#e6f4ff',
                            borderRadius: 6,
                            padding: 8,
                            marginBottom: 8,
                            cursor: 'grab',
                          }}
                        >
                          <div style={{ fontWeight: 600 }}>{item.course}</div>
                          <div style={{ fontSize: 12, color: '#595959', marginTop: 4 }}>
                            {item.class_name}
                          </div>
                          <div style={{ fontSize: 12, color: '#595959' }}>
                            {item.teacher} · {item.room}
                          </div>
                          <Tag color='blue' style={{ marginTop: 6 }}>
                            time_slot={item.time_slot}
                          </Tag>
                        </div>
                      );
                    })
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ marginTop: 24 }}>
          <Empty description='当前筛选下暂无课程数据' />
        </div>
      )}
    </Card>
  );
}
