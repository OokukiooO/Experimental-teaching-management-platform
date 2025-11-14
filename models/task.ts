/*
 * @Author: Jan
 * @Date: 2024-06-02 23:17:22
 * @LastEditTime: 2024-06-04 00:32:24
 * @FilePath: /EasyAIWeb/models/task.ts
 * @Description: 
 * 
 */
import { model, models, Schema, Types } from 'mongoose';
import { location } from './location';

export interface task {
    taskName: string,
    locationId: Types.ObjectId,
    locationName: location['name'],
    createDate?: Date,
    desc?: string,
    streamUrl?: string
    detectStreamUrl?: string
}

let TaskSchema = new Schema<task>({
    taskName: { type: String, required: true },
    locationId: { type: Schema.Types.ObjectId, required: true, ref: 'locations' },
    locationName: { type: String, required: true },
    createDate: { type: Date, default: Date.now, required: false },
    desc: { type: String, required: true },
    streamUrl: { type: String },
    detectStreamUrl: { type: String }
})

const Task = models.Task || model('Task', TaskSchema)
export default Task