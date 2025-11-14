/*
 * @Author: Jan
 * @Date: 2024-05-15 15:23:04
 * @LastEditTime: 2024-07-02 10:40:12
 * @FilePath: /EasyAIWeb/models/event.ts
 * @Description: 
 * 
 */
import { model, models, Schema, Types } from 'mongoose';
import { task } from './task';

export interface label {
    name: string;
    color: string;
}

export interface event {
    _id: Types.ObjectId;
    taskId: Types.ObjectId;
    state: string;
    reportDate: Date;
    labels: Array<label>;
    desc: string;
    videoNames?: Array<string>;
    picsNames?: Array<string>;
    facePicsNames?: Array<string>;
}

let EventSchema = new Schema<event>({
    taskId: { type: Schema.Types.ObjectId, required: true, ref: 'Task' },
    state: { type: String, required: true, default: 'pending' },
    reportDate: { type: Date, default: Date.now, required: true },
    labels: { type: [Object] },
    desc: { type: String, default: '' },
    videoNames: { type: [String] },
    picsNames: { type: [String] },
    facePicsNames: { type: [String] }
    // id
})

const Event = models.Event || model('Event', EventSchema)
export default Event