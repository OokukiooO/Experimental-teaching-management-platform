import { model, models, Schema } from 'mongoose';

export interface algoNode {
  name: string;
  host: string; // ip 或域名
  apiBase?: string; // 后端服务地址
  status?: 'online' | 'offline' | 'degraded';
  version?: string;
  cpuUsage?: number; // 0-100
  memUsage?: number; // 0-100
  gpuName?: string;
  gpuMemTotal?: number; // MB
  gpuMemUsed?: number; // MB
  connectedCameras?: number;
  lastHeartbeatAt?: Date;
  createdAt?: Date;
}

const AlgoNodeSchema = new Schema<algoNode>({
  name: { type: String, required: true },
  host: { type: String, required: true },
  apiBase: { type: String },
  status: { type: String, default: 'offline' },
  version: { type: String },
  cpuUsage: { type: Number, default: 0 },
  memUsage: { type: Number, default: 0 },
  gpuName: { type: String },
  gpuMemTotal: { type: Number },
  gpuMemUsed: { type: Number },
  connectedCameras: { type: Number, default: 0 },
  lastHeartbeatAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const AlgoNode = models.AlgoNode || model('AlgoNode', AlgoNodeSchema);
export default AlgoNode;
