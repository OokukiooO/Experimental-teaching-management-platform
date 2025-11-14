import dbConnect from '@/lib/dbconn';
import Location from '@/models/location';
import Task from '@/models/task';
import Event from '@/models/event';
import Camera from '@/models/camera';
import { Types } from 'mongoose';

export async function ensureDemoSeed() {
  if (!process.env.MONGODB_URI) return false;
  await dbConnect();
  const [locCnt, taskCnt, eventCnt, camCnt] = await Promise.all([
    Location.countDocuments({}),
    Task.countDocuments({}),
    Event.countDocuments({}),
    Camera.countDocuments({}),
  ]);

  let seeded = false;

  // Seed locations if empty
  let locations = [] as any[];
  if (locCnt === 0) {
    locations = await Location.insertMany([
      { name: '柜台1', desc: '大厅柜台1' },
      { name: '金库门口', desc: '金库外走廊' },
      { name: '过道2', desc: '二楼过道' },
    ]);
    seeded = true;
  } else {
    locations = await Location.find({}).limit(3).lean();
  }

  const [l1, l2, l3] = locations;

  // Seed tasks if empty
  if (taskCnt === 0) {
    await Task.insertMany([
      { taskName:'柜台行为检测', locationId: l1?._id as Types.ObjectId, locationName: l1?.name, desc:'手机、离岗等', detectStreamUrl:'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
      { taskName:'金库行为检测', locationId: l2?._id as Types.ObjectId, locationName: l2?.name, desc:'出入规范', detectStreamUrl:'https://test-streams.mux.dev/pts_shift/master.m3u8' },
      { taskName:'过道杂物检测', locationId: l3?._id as Types.ObjectId, locationName: l3?.name, desc:'杂物清理', detectStreamUrl:'https://test-streams.mux.dev/test_001/stream.m3u8' },
    ]);
    seeded = true;
  }

  // Seed events if empty
  if (eventCnt === 0) {
    const tasks = await Task.find({}).limit(3).lean();
    const [t1, t2, t3] = tasks;
    const today = new Date();
    const day = 24 * 3600 * 1000;
    function d(i: number) { return new Date(today.getTime() - i * day) }
    await Event.insertMany([
      { taskId: t1?._id, state:'pending', reportDate: d(0), labels:[{name:'玩手机', color:'gold'}], desc:'员工低头看手机' },
      { taskId: t2?._id, state:'uploaded', reportDate: d(1), labels:[{name:'动作超时', color:'gold'}], desc:'办理超时' },
      { taskId: t3?._id, state:'finish', reportDate: d(2), labels:[{name:'杂物占用', color:'blue'}], desc:'过道堆放杂物' },
      { taskId: t1?._id, state:'pending', reportDate: d(3), labels:[{name:'其他警告', color:'geekblue'}], desc:'其他异常' },
    ]);
    seeded = true;
  }

  // Seed cameras if empty
  if (camCnt === 0) {
    await Camera.insertMany([
      { name:'大厅-柜台1', vendor:'Hikvision', ip:'10.0.0.11', locationId: l1?._id, locationName: l1?.name, streamUri:'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', status:'online' },
      { name:'金库-入口', vendor:'Dahua', ip:'10.0.0.21', locationId: l2?._id, locationName: l2?.name, streamUri:'https://test-streams.mux.dev/pts_shift/master.m3u8', status:'online' },
    ]);
    seeded = true;
  }

  return seeded;
}
