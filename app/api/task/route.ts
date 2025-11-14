/*
 * @Author: Jan
 * @Date: 2024-06-03 14:18:59
 * @LastEditTime: 2024-06-04 00:32:25
 * @FilePath: /EasyAIWeb/app/api/task/route.ts
 * @Description: 
 * 
 */
import dbConnect from "@/lib/dbconn";
import Task,{task} from "@/models/task";
import {ObjectId} from 'bson';

export const POST = async (req: Request) => {

    await dbConnect();

    let taskData:task={
        taskName:"杂物检测任务",
        locationId: new ObjectId("665d1d62bf2ce7ef0007dc82"),
        locationName:"过道",
        desc:"过道杂物检测任务",
    }

    const newTask = new Task(taskData);
    const savedEvent = await newTask.save();
    const id = savedEvent._id;

    return Response.json({ code: 200, msg: "新建成功", data: { id } });
};
