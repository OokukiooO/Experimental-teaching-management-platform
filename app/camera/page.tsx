'use client';

import { Alert, Card, Col, Row, Space } from 'antd';
import { Line } from '@ant-design/charts';
import CameraCanvasBoard from './components/CameraCanvasBoard';
import CameraControlPanel from './components/CameraControlPanel';
import { useCameraCanvas } from './hooks/useCameraCanvas';
import { useCameraSimulation } from './hooks/useCameraSimulation';

export default function CameraPage() {
  const {
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
  } = useCameraSimulation();

  const { canvasRef, width, height } = useCameraCanvas(stepData);

  return (
    <Space direction='vertical' size={16} style={{ width: '100%' }}>
      <Alert
        showIcon
        type='info'
        message='说明：左侧控制仿真节奏与策略，右侧 Canvas 按 step 数据重绘热力 POI 与相机视场角。'
      />

      <Row gutter={16}>
        <Col xs={24} lg={8}>
          <CameraControlPanel
            running={running}
            loading={loading}
            strategy={strategy}
            stepData={stepData}
            onChangeStrategy={setStrategy}
            onStart={start}
            onPause={pause}
            onStep={singleStep}
            onReset={reset}
          />
        </Col>

        <Col xs={24} lg={16}>
          <CameraCanvasBoard
            canvasRef={canvasRef}
            width={width}
            height={height}
            hasData={Boolean(stepData)}
          />
        </Col>
      </Row>

      <Card title='total_urgency 时序趋势'>
        <Line
          data={trend}
          xField='step'
          yField='totalUrgency'
          smooth
          animation={{ enter: { type: 'path-in', duration: 350 } }}
          point={{ size: 3, shape: 'circle' }}
          xAxis={{ title: { text: 'Step' } }}
          yAxis={{ title: { text: 'Total Urgency' } }}
          tooltip={{ showMarkers: true }}
        />
      </Card>
    </Space>
  );
}
