import dbConnect from '@/lib/dbconn';
import Location from '@/models/location';
import Task from '@/models/task';
import Event from '@/models/event';
import { Types } from 'mongoose';

export async function POST(){
  await dbConnect();

  // 清理旧数据（仅开发环境建议）
  await Promise.all([
    Location.deleteMany({}),
    Task.deleteMany({}),
    Event.deleteMany({})
  ]);

  const locations = await Location.insertMany([
    { name: '柜台1', desc: '大厅柜台1' },
    { name: '金库门口', desc: '金库外走廊' },
    { name: '过道2', desc: '二楼过道' }
  ]);

  const [l1,l2,l3] = locations;

  const tasks = await Task.insertMany([
    { taskName:'柜台行为检测', locationId: l1._id as Types.ObjectId, locationName: l1.name, desc:'手机、离岗等', detectStreamUrl:'http://example.com/stream/gt1.m3u8' },
    { taskName:'金库行为检测', locationId: l2._id as Types.ObjectId, locationName: l2.name, desc:'出入规范', detectStreamUrl:'http://example.com/stream/jk.m3u8' },
    { taskName:'过道杂物检测', locationId: l3._id as Types.ObjectId, locationName: l3.name, desc:'杂物清理', detectStreamUrl:'http://example.com/stream/gd2.m3u8' },
  ]);

  const [t1,t2,t3] = tasks;

  const today = new Date();
  const day = 24*3600*1000;
  function d(i:number){ return new Date(today.getTime()-i*day) }

  await Event.insertMany([
    { taskId: t1._id, state:'pending', reportDate: d(0), labels:[{name:'玩手机', color:'gold'}], desc:'员工低头看手机' },
    { taskId: t2._id, state:'uploaded', reportDate: d(1), labels:[{name:'动作超时', color:'gold'}], desc:'办理超时' },
    { taskId: t3._id, state:'finish', reportDate: d(2), labels:[{name:'杂物占用', color:'blue'}], desc:'过道堆放杂物' },
    { taskId: t1._id, state:'pending', reportDate: d(3), labels:[{name:'其他警告', color:'geekblue'}], desc:'其他异常' },
  ]);

  return Response.json({ code:200, msg:'seed ok' });
}
