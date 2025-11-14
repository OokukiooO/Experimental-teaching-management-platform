import type { ActionType, ProColumns } from '@ant-design/pro-components';
import dynamic from 'next/dynamic';
const ProTable = dynamic<ProTableProps<event,any>>(() => import('@ant-design/pro-components').then(({ ProTable }) => ProTable), { ssr: false });
import type { ProTableProps } from '@ant-design/pro-components';
import { TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown, Space, Tag } from 'antd';
import { useRef } from 'react';
import { event } from '@/models/event'
import { task } from '@/models/task';

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

const columns: ProColumns<event>[] = [
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
        render: (_, record) => <>{(record.taskId as task).taskName}</>,
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
                    // @ts-ignore
                    onSelect={(key) => { key === 'handled' ? tohandled(record.id) : todelete(record.id) }}
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
    return (
        <ProTable
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={async (params, sort, filter) => {
                let data = (await (await fetch('/api/event')).json()).data
                return { data: data.events, total: data.total }
                //modify
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
            rowKey="id"
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
        />
    );
};