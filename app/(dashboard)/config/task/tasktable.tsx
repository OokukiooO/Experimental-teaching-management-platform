import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
// import { TableDropdown } from '@ant-design/pro-components';
import dynamic from 'next/dynamic';
const ProTable = dynamic<ProTableProps<task, any>>(() => import('@ant-design/pro-components').then(({ ProTable }) => ProTable), { ssr: false });
import type { ProTableProps } from '@ant-design/pro-components';
import { Button, Dropdown, Space, Tag } from 'antd';
import { useRef } from 'react';
import { task } from '@/models/task'
import { getTasks } from '@/app/actions/task'

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

const columns: ProColumns<task>[] = [
    {
        title: '检测ID',
        dataIndex: '_id',
        valueType: 'text',
        copyable: true,
        width: 100,
        ellipsis: true,
    },
    {
        title: '任务名称',
        dataIndex: 'taskName',
        copyable: false,
        ellipsis: true,
    },
    {
        title: '位置',
        key: 'locationName',
        dataIndex: 'locationName',
        valueType: 'text',
        sorter: true,
        hideInSearch: false,
        width: 100
    },
    {
        title: '串流地址',
        key: 'streamUrl',
        dataIndex: 'streamUrl',
        valueType: 'text',
        hideInSearch: false,
        tooltip: '摄像头的串流地址',
    },
    {
        title: '识别串流地址',
        key: 'detectStreamUrl',
        dataIndex: 'detectStreamUrl',
        valueType: 'text',
        hideInSearch: true,
        hideInTable: true,
        tooltip: '识别结果的串流地址',
    },
    {
        title: '备注',
        key: 'desc',
        dataIndex: 'desc',
        valueType: 'text',
    },
    {
        title: '创建时间',
        dataIndex: 'createDate',
        valueType: 'dateTime',
        // search: {
        //     transform: (value) => {
        //         return {
        //             startTime: value[0],
        //             endTime: value[1],
        //         };
        //     },
        // },
    },
    {
        title: '操作',
        valueType: 'option',
        key: 'option',
        render: (text, record, _, action) => [
            <a
                key="editable"
                onClick={() => {

                }}
            >
                编辑
            </a>
        ],
    },
];

export default ({ showModal, setModalInfo, setModalMode }: { showModal: () => void, setModalInfo: (info: task) => void, setModalMode: (mode: string) => void }) => {
    const actionRef = useRef<ActionType>();
    return (
        <ProTable
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={async (params, sort, filter) => {
                let data = JSON.parse(await getTasks())
                console.log(data);
                return { data: data }
            }}
            editable={{
                type: 'multiple',
            }}
            columnsState={{
                persistenceKey: 'pro-table-singe-demos',
                persistenceType: 'localStorage',
                defaultValue: {
                    option: { fixed: 'right', disable: true },
                },
                onChange(value) {
                    console.log('value: ', value);
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
                pageSize: 5,
                onChange: (page) => console.log(page),
            }}
            dateFormatter="string"
            headerTitle="任务清单"
            toolBarRender={() => [
                <Button
                    key="button"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        showModal()
                    }}
                    type="primary"
                >
                    新建
                </Button>
            ]}
        />
    );
};