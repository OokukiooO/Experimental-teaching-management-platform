/*
 * @Author: Jan
 * @Date: 2024-06-03 23:12:24
 * @LastEditTime: 2024-06-03 23:32:30
 * @FilePath: /EasyAIWeb/app/actions/task.ts
 * @Description: 
 * 
 */
'use server'
import Task from '@/models/task';
import dbConnect from '@/lib/dbconn';

export async function getTaskById(taskId: string) {
    await dbConnect();

    let task = await Task.findOne({ _id: taskId }).exec();

    return JSON.stringify(task);
}

export async function getTasks() {
    await dbConnect();

    let tasks = await Task.find().exec();

    return JSON.stringify(tasks);
}