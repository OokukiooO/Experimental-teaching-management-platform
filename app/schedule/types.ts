export interface ScheduleItem {
  course: string;
  class_name: string;
  teacher: string;
  room: string;
  time_slot: number;
}

export interface ScheduleApiResponse {
  status: string;
  fitness_score: number;
  schedule: ScheduleItem[];
}

export type ScheduleViewMode = 'class' | 'teacher';

export interface DragPayload {
  itemIndex: number;
  originSlot: number;
}
