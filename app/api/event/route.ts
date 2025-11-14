
import type { NextApiRequest, NextApiResponse } from "next";
import { type NextRequest } from 'next/server'
import dbConnect from "@/lib/dbconn";
import Event from "@/models/event";
import { task } from "@/models/task";

export async function POST(req: Request, res: NextApiResponse) {
    let data = await req.json()
    console.log(data);

    await dbConnect();

    const newEvent = new Event(data);
    const savedEvent = await newEvent.save();
    const eventId = savedEvent._id;

    return Response.json({ code: 200, msg: "上报成功", data: { eventId } });
}

// todo: 分页查询
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const eventid = searchParams.get('eventid')

    const query = eventid ? { _id: eventid } : {}

    require('@/models/task')
    await dbConnect();
    let events = await Event.find(query).populate<{ taskId: task }>('taskId', 'taskName').exec();

    return Response.json({ code: 200, msg: "查询成功", data: { events } });
}