/*
 * @Author: Jan
 * @Date: 2024-06-03 09:05:02
 * @LastEditTime: 2024-06-16 14:11:54
 * @FilePath: /EasyAIWeb/models/location.ts
 * @Description: 
 * 
 */
import { model, models, Schema, Types } from 'mongoose';

export interface location {
    name: string,
    desc: string,
}

let LocationSchema = new Schema<location>({
    name: { type: String, required: true },
    desc: { type: String, default: '' },
})

const Location = models.Location || model('Location', LocationSchema)
export default Location