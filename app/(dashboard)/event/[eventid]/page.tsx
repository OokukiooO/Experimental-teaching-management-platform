import { Badge, Descriptions, Button, DescriptionsProps, Tag, Alert } from 'antd';
import { event } from '@/models/event';
import { getEvents } from '@/app/actions/event'
import ErrorMessage from '@/components/ErrorMessage';
import { Types } from 'mongoose';
import { mockEvents, toBadgeStatus, toStateText } from '@/lib/mockEventData';

export default async function EventPage({ params: { eventid } }: { params: { eventid: string } }) {
    // ObjectId 格式校验
    if (!Types.ObjectId.isValid(eventid)) {
        return <ErrorMessage title="事件ID无效" detail={`提供的参数: ${eventid}`} suggestion="请检查链接或从列表页重新进入。" />
    }

    let eventData: any = null;
    let usedMock = false;
    try {
        if (process.env.MONGODB_URI) {
            const events: event[] = JSON.parse(await getEvents(eventid));
            if (events && events.length > 0) {
                eventData = events[0] as any;
            }
        }
    } catch {
        // fallback below
    }

    if (!eventData) {
        const found = mockEvents.find((it) => it._id === eventid) || mockEvents[0];
        if (!found) {
            return <ErrorMessage title="未找到事件" detail={`ID: ${eventid}`} suggestion="可能已被删除或尚未生成。" />
        }
        eventData = found;
        usedMock = true;
    }

    const labels = (eventData?.labels || []).map((label: any) => (
        <Tag color={label.color} key={label.name}>{label.name}</Tag>
    ));

    const picName = String(eventData?.picsNames?.[0] || '');
    const pic = picName
        ? (picName.startsWith('http')
            ? picName
            : (picName.startsWith('/') ? picName : `/resources/${picName}`))
        : '/event-snapshot.svg';

    const items: DescriptionsProps['items'] = [
        {
            label: '事件处理状态',
            children: <Badge status={toBadgeStatus(eventData?.state)} text={toStateText(eventData?.state)} />,
            span: 1,
        },
        {
            label: '识别时间',
            children: new Date(eventData?.reportDate).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            span: 2,
        },
        {
            label: '任务名称',
            children: eventData?.taskId?.taskName || '未命名任务',
        },
        {
            label: '摄像头名称',
            children: eventData?.cameraName || eventData?.taskId?.taskName || '未配置',
        },
        {
            label: '摄像头位置',
            children: eventData?.locationName || '未配置',
        },

        {
            span: 2,
            label: '检测信息',
            children: labels
        },
        {
            span: 1,
            label: '操作',
            children: <Button type="primary">查看配置</Button>,
        }
    ];

    return (
        <div className='space-y-5'>
            {usedMock && (
                <Alert type="info" showIcon message="当前展示为演示数据" description="未命中数据库记录时，系统会自动回退到伪数据，便于页面演示。" />
            )}
            <div className='grid grid-cols-12 gap-5 mb-1'>
                <div className='col-span-12 lg:col-span-9 ui-surface p-3'>
                    <img src={pic} className='w-full rounded-lg'></img>
                    {/* <video className='aspect-video' autoPlay controls={false} loop>
                        <source src={`/resources/${event?.picsNames[0]}`} type="video/mp4" />
                    </video> */}
                </div>
                <div className='col-span-12 lg:col-span-3 ui-surface p-4'>
                    <div className='text-sm text-slate-500'>事件资源预览与异常提示</div>
                    <div className='mt-2 text-xs text-slate-400 leading-6'>
                        支持场景：ID 无效、查询失败、事件不存在。异常时将给出清晰提示信息。
                    </div>
                </div>
            </div>
            <div className='ui-surface p-3'>
              <Descriptions title={<span className='text-slate-800 font-semibold'>事件信息</span>} bordered items={items} className='rounded-xl overflow-hidden' />
            </div>
        </div>
    )
}