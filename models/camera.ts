import { model, models, Schema, Types } from 'mongoose';

export interface camera {
  name: string;
  vendor?: string;
  ip?: string;
  locationId?: Types.ObjectId;
  locationName?: string;
  streamUri: string; // RTSP/HTTP/WebRTC 标识
  onvifUri?: string;
  status?: 'online' | 'offline' | 'unknown';
  lastOnlineAt?: Date;
  note?: string;
  createdAt?: Date;
}

const CameraSchema = new Schema<camera>({
  name: { type: String, required: true },
  vendor: { type: String },
  ip: { type: String },
  locationId: { type: Schema.Types.ObjectId, ref: 'Location' },
  locationName: { type: String },
  streamUri: { type: String, required: true },
  onvifUri: { type: String },
  status: { type: String, default: 'unknown' },
  lastOnlineAt: { type: Date },
  note: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Camera = models.Camera || model('Camera', CameraSchema);
export default Camera;
