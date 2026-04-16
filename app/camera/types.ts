export interface CameraPoi {
  id: string;
  x: number;
  y: number;
  w: number;
  last_seen: number;
}

export interface CameraStepData {
  step: number;
  angle: number;
  covered: string[];
  total_urgency: number;
  pois: CameraPoi[];
}

export interface CameraStepResponse {
  status: string;
  data: CameraStepData;
}

export type CameraStrategy = 'greedy' | 'round_robin' | 'weight_first';

export interface UrgencyPoint {
  step: number;
  totalUrgency: number;
}
