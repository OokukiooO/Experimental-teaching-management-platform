'use server'
import dbConnect from '@/lib/dbconn'
import Event from '@/models/event'
import Task from '@/models/task'
import { ensureDemoSeed } from '@/lib/seed'

interface TimeRange { from: Date; to: Date }

// 通用聚合，根据指标类型返回数据
export async function getMetric(metric: string, timeRange: TimeRange, groupBy?: string) {
  const hasDb = !!process.env.MONGODB_URI;
  const match: any = { reportDate: { $gte: timeRange.from, $lte: timeRange.to } };

  // 本地无数据库时返回 mock 数据，避免 500
  if (!hasDb) {
    if (metric === 'event.countByDay') {
      const days = Math.ceil((timeRange.to.getTime() - timeRange.from.getTime()) / (24*3600*1000));
      return Array.from({ length: days }, (_, i) => {
        const d = new Date(timeRange.from.getTime() + i*24*3600*1000);
        const key = d.toISOString().slice(0,10);
        return { _id: key, value: Math.max(0, Math.round(5 + 3*Math.sin(i/2))) };
      });
    }
    if (metric === 'event.countByLabel') {
      return [
        { _id: '玩手机', value: 12 },
        { _id: '杂物占用', value: 7 },
        { _id: '其他警告', value: 5 }
      ];
    }
    if (metric === 'task.total') {
      return [{ _id: 'tasks', value: 3 }];
    }
    throw new Error('未知 metric');
  }

  // 有数据库时，执行真实聚合
  try {
    await ensureDemoSeed();
    await dbConnect();
  } catch {
    // 连接失败时按无数据库处理
    if (metric === 'event.countByDay') {
      const days = Math.ceil((timeRange.to.getTime() - timeRange.from.getTime()) / (24*3600*1000));
      return Array.from({ length: days }, (_, i) => {
        const d = new Date(timeRange.from.getTime() + i*24*3600*1000);
        const key = d.toISOString().slice(0,10);
        return { _id: key, value: Math.max(0, Math.round(5 + 3*Math.sin(i/2))) };
      });
    }
    if (metric === 'event.countByLabel') return [ { _id:'玩手机', value:12 }, { _id:'杂物占用', value:7 }, { _id:'其他警告', value:5 } ];
    if (metric === 'task.total') return [ { _id:'tasks', value:3 } ];
  }
  try {
    switch(metric){
      case 'event.countByDay':
        return await Event.aggregate([
          { $match: match },
          { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$reportDate' } }, value: { $count: {} } } },
          { $sort: { _id: 1 } }
        ])
      case 'event.countByLabel':
        return await Event.aggregate([
          { $match: match },
          { $unwind: '$labels' },
          { $group: { _id: '$labels.name', value: { $count: {} } } },
          { $sort: { value: -1 } }
        ])
      case 'task.total':
        return await Task.aggregate([
          { $group: { _id: 'tasks', value: { $count: {} } } }
        ])
      default:
        throw new Error('未知 metric');
    }
  } catch (e) {
    // 聚合失败时兜底为 mock，保障前端不 500
    if (metric === 'event.countByDay') return [{ _id: 'fallback', value: 0 }];
    if (metric === 'event.countByLabel') return [];
    if (metric === 'task.total') return [{ _id: 'tasks', value: 0 }];
    return [];
  }
}

export async function getMetricsPayload(metrics: string[], days: number){
  const to = new Date();
  const from = new Date(Date.now() - days*24*3600*1000);
  const result: Record<string, any> = {}
  for(const m of metrics){
    result[m] = await getMetric(m, {from, to});
  }
  return result;
}
