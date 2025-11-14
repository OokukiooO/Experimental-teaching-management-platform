import { Badge, Descriptions, Button, DescriptionsProps, Tag } from 'antd';
import { event } from '@/models/event';
import { getEvents } from '@/app/actions/event'
import ErrorMessage from '@/components/ErrorMessage';
import { Types } from 'mongoose';

export default async function EventPage({ params: { eventid } }: { params: { eventid: string } }) {
    // ObjectId 格式校验
    if (!Types.ObjectId.isValid(eventid)) {
        return <ErrorMessage title="事件ID无效" detail={`提供的参数: ${eventid}`} suggestion="请检查链接或从列表页重新进入。" />
    }

    // 无数据库时友好提示
    if (!process.env.MONGODB_URI) {
        return <ErrorMessage title="数据源未配置" detail="未检测到 MONGODB_URI，无法查询事件。" suggestion="复制 .env.local.example 为 .env.local 并填写有效 MongoDB 连接串后重启服务。" />
    }

    let events: event[] = [];
    try {
        events = JSON.parse(await getEvents(eventid));
        if (!events || events.length === 0) {
            return <ErrorMessage title="未找到事件" detail={`ID: ${eventid}`} suggestion="可能已被删除或尚未生成。" />
        }
    } catch (e: any) {
        return <ErrorMessage title="查询事件失败" detail={e?.message} suggestion="稍后重试或检查数据库连接。" />
    }
    events.map((item, index) => {
        switch (item.state) {
            case 'pending':
                item.state = '等待处理';
                break;
            case 'finish':
                item.state = '已解决';
                break;
            case 'uploaded':
                item.state = '已自动上报';
                break;
        }
        item.labels.map((label, index) => {
            // @ts-ignore
            item.labels[index] = <Tag color={label.color} key={label.name}>{label.name}</Tag>
        })
    })

    const event: any = events[0]

    // const [event, setEvent] = useState<any>()

    // useEffect(() => {
    //     fetch(`/api/event?eventid=${eventid}`)
    //         .then(res => res.json())
    //         .then(res => {
    //             const events: event[] = res.data.events;
    //             events.map((item, index) => {
    //                 switch (item.state) {
    //                     case 'pending':
    //                         item.state = '等待处理';
    //                         break;
    //                     case 'finish':
    //                         item.state = '已解决';
    //                         break;
    //                     case 'uploaded':
    //                         item.state = '已自动上报';
    //                         break;
    //                 }
    //                 item.labels.map((label, index) => {
    //                     //@ts-ignore
    //                     item.labels[index] = <Tag color={label.color} key={label.name}>{label.name}</Tag>
    //                 })
    //             })
    //             setEvent(events[0])
    //         })
    // }, [])

    const items: DescriptionsProps['items'] = [
        {
            label: '事件处理状态',
            children: <Badge status="processing" text={event?.state} />,
            span: 1,
        },
        {
            label: '识别时间',
            children: new Date(event?.reportDate).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            span: 2,
        },
        {
            label: '任务名称',
            children: event?.taskId.taskName,
        },
        {
            label: '摄像头名称',
            children: event?.taskId.taskName,   //
        },
        {
            label: '摄像头位置',
            children: event?.locationName,
        },

        {
            span: 2,
            label: '检测信息',
            children: event?.labels
        },
        {
            span: 1,
            label: '操作',
            children: <Button type="primary">查看配置</Button>,
        }
    ];

    return (
        <>
            <div className='grid grid-cols-12 gap-5 mb-5'>
                <div className='col-span-9'>
                    <img src={`/resources/${event?.picsNames[0]}`}></img>
                    {/* <video className='aspect-video' autoPlay controls={false} loop>
                        <source src={`/resources/${event?.picsNames[0]}`} type="video/mp4" />
                    </video> */}
                </div>
                <div className='col-span-3'>
                </div>
            </div>
            <Descriptions title="事件信息" bordered items={items} />
        </>
    )
}