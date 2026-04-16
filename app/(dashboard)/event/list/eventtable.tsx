import type { ActionType, ProColumns } from '@ant-design/pro-components';
import dynamic from 'next/dynamic';
const ProTable = dynamic<ProTableProps<event,any>>(() => import('@ant-design/pro-components').then(({ ProTable }) => ProTable), { ssr: false });
import type { ProTableProps } from '@ant-design/pro-components';
import { TableDropdown } from '@ant-design/pro-components';
import { message, Space, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { event } from '@/models/event'
import { task } from '@/models/task';
import { mockEvents } from '@/lib/mockEventData';

export const waitTimePromise = async (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

export const waitTime = async (time: number = 100) => {
    await waitTimePromise(time);
};

const columns: ProColumns<any>[] = [
    {
        dataIndex: 'index',
        valueType: 'index',
        width: 48,
    },
    {
        title: '任务名称',
        dataIndex: 'taskId',
        ellipsis: true,
        // @ts-ignore
        render: (_, record) => <>{(record.taskId as task)?.taskName || '未命名任务'}</>,
    },
    {
        disable: true,
        title: '状态',
        dataIndex: 'state',
        filters: true,
        onFilter: true,
        ellipsis: true,
        valueType: 'select',
        valueEnum: {
            pending: {
                text: '等待处理',
                status: 'processing',
            },
            uploaded: {
                text: '已上报',
                status: 'success',
            },
            finish: {
                text: '已解决',
                status: 'default',
            },
        },
    },
    {
        disable: true,
        title: '行为标签',
        dataIndex: 'labels',
        search: false,
        render: (_, record) => (
            <Space>
                {record.labels.map(({ name, color }) => (
                    <Tag color={color} key={name}>
                        {name}
                    </Tag>
                ))}
            </Space>
        ),
    },
    {
        title: '上报时间',
        key: 'showTime',
        dataIndex: 'reportDate',
        valueType: 'dateTime',
        sorter: true,
        width: 180
    },
    {
        title: '操作',
        valueType: 'option',
        key: 'option',
        render: (text, record, _, action) => {
            return [
                <a href={`/event/${record._id}`} key="view">查看</a>,
                <TableDropdown
                    key="actionGroup"
                    onSelect={(key) => {
                        window.dispatchEvent(new CustomEvent('event:list:action', { detail: { id: record._id, action: key } }));
                        action?.reload?.();
                    }}
                    menus={[
                        { key: 'handled', name: '已处理' },
                        { key: 'delete', name: '删除' },
                    ]}
                />,
            ]
        }
    },
];

export default () => {
    const actionRef = useRef<ActionType>();
    const [rows, setRows] = useState<any[]>([]);
    const [ready, setReady] = useState(false);

    const loadRows = async () => {
        if (ready) return rows;
        try {
            const res = await fetch('/api/event');
            const json = await res.json();
            const remoteRows = json?.data?.events || [];
            if (Array.isArray(remoteRows) && remoteRows.length) {
                setRows(remoteRows);
                setReady(true);
                return remoteRows;
            }
        } catch {
            // fallback to mock
        }
        setRows(mockEvents as any[]);
        setReady(true);
        return mockEvents as any[];
    };

    const applyAction = (list: any[], id: string, actionKey: string) => {
        if (actionKey === 'handled') {
            return list.map((it) => it._id === id ? { ...it, state: 'finish' } : it);
        }
        if (actionKey === 'delete') {
            return list.filter((it) => it._id !== id);
        }
        return list;
    };

    useEffect(() => {
        const onAction = (evt: any) => {
            const id = evt?.detail?.id;
            const actionKey = evt?.detail?.action;
            if (!id || !actionKey) return;
            setRows((prev) => {
                const next = applyAction(prev, id, actionKey);
                return next;
            });
            if (actionKey === 'handled') message.success('已标记为处理完成');
            if (actionKey === 'delete') message.success('已删除该条记录');
        };
        window.addEventListener('event:list:action', onAction as EventListener);
        return () => window.removeEventListener('event:list:action', onAction as EventListener);
    }, []);

    return (
        <ProTable
            className='pro-table-modern'
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={async (params, sort, filter) => {
                const current = (await loadRows()).slice();

                if (filter?.state && Array.isArray(filter.state) && filter.state.length) {
                    const states = filter.state as string[];
                    current.splice(0, current.length, ...current.filter((it) => states.includes(it.state)));
                }

                const order = (sort as any)?.reportDate;
                if (order === 'ascend') {
                    current.sort((a, b) => new Date(a.reportDate).getTime() - new Date(b.reportDate).getTime());
                } else if (order === 'descend') {
                    current.sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime());
                }

                return { data: current, total: current.length, success: true };
            }}
            // request={async (params, sort, filter) => {
            //     console.log(sort, filter);
            //     // await waitTime(2000);
            //     return request<{
            //         data: GithubIssueItem[];
            //     }>('https://proapi.azurewebsites.net/github/issues', {
            //         params,
            //     });
            // }}
            columnsState={{
                persistenceKey: 'event_list',
                persistenceType: 'localStorage',
                defaultValue: {
                    option: { fixed: 'right', disable: true },
                },
                onChange(value) {
                    // console.log('value: ', value);
                },
            }}
            rowKey="_id"
            search={{
                labelWidth: 'auto',
            }}
            options={{
                setting: {
                    listsHeight: 400,
                },
            }}
            form={{
                // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
                syncToUrl: (values, type) => {
                    if (type === 'get') {
                        return {
                            ...values,
                            created_at: [values.startTime, values.endTime],
                        };
                    }
                    return values;
                },
            }}
            pagination={{
                pageSize: 20,
                onChange: (page) => console.log(page),
            }}
            dateFormatter="string"
            headerTitle="事件清单"
            toolBarRender={false}
            onRow={(record) => ({
                onDoubleClick: () => {
                    location.href = `/event/${record._id}`;
                }
            })}
            postData={(data) => {
                if (!Array.isArray(data)) return data;
                return data.map((it) => ({ ...it }));
            }}
        />
    );
};