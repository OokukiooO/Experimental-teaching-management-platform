/*
 * @Author: Jan
 * @Date: 2024-05-14 15:30:40
 * @LastEditTime: 2024-06-03 23:55:38
 * @FilePath: /EasyAIWeb/app/actions/event.ts
 * @Description: 
 * 
 */
'use server';
import Event from '@/models/event'; 
import dbConnect from '@/lib/dbconn';
import { task } from '@/models/task';

export async function getEvents(eventid: string) {
    const query = eventid ? { _id: eventid } : {}

    require('@/models/task')
    await dbConnect();
    let events = await Event.find(query).populate<{ taskId: task }>('taskId', 'taskName').exec();

    return JSON.stringify(events);
    
    // let events = [{
    //     taskName: '柜台行为检测',
    //     state: 'pending',
    //     reportDate: Date.now(),
    //     labels: [{ name: '玩手机', color: 'gold' }],
    //     id: 1,
    //     location: '柜台1'
    // },
    // {
    //     taskName: '金库行为检测',
    //     state: 'uploaded',
    //     reportDate: Date.now(),
    //     labels: [{ name: '动作超时', color: 'gold' }, { name: '动作异常', color: 'geekblue' }],
    //     id: 2,
    //     location: '金库门口'
    // },
    // {
    //     taskName: '过道杂物检测',
    //     state: 'finish',
    //     reportDate: Date.now(),
    //     labels: [{ name: '杂物占用', color: 'blue' }],
    //     id: 3,
    //     location: '过道2'
    // }]

}