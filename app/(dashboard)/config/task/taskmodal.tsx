/*
 * @Author: Jan
 * @Date: 2024-06-04 22:25:11
 * @LastEditTime: 2024-06-11 16:14:58
 * @FilePath: /EasyAIWeb/app/(dashboard)/config/task/taskmodal.tsx
 * @Description: 
 * 
 */
import React, { useState } from 'react';
import { Button, Modal, Form, Space, Select, Input, Spin } from 'antd';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export default function TaskModal({ isModalOpen, handleOk, handleCancel, mode }: { isModalOpen: boolean, handleOk: () => void, handleCancel: () => void, mode: string }) {
    const [form] = Form.useForm();
    const [fetchingLocation, setFetchingLocation] = useState(false);

    const onGenderChange = (value: string) => {
        switch (value) {
            case 'male':
                form.setFieldsValue({ note: 'Hi, man!' });
                break;
            case 'female':
                form.setFieldsValue({ note: 'Hi, lady!' });
                break;
            case 'other':
                form.setFieldsValue({ note: 'Hi there!' });
                break;
            default:
        }
    };

    const onFinish = (values: any) => {
        console.log(values);
    };

    const onReset = () => {
        form.resetFields();
    };

    const onFill = () => {
        form.setFieldsValue({ note: 'Hello world!', gender: 'male' });
    };

    return (
        <>
            <Modal title={`${mode}任务`} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    {...layout}
                    form={form}
                    name="control-hooks"
                    onFinish={onFinish}
                    style={{ maxWidth: 600 }}
                >
                    <Form.Item name="note" label="任务名称" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="gender" label="位置" rules={[{ required: false }]}>
                        <Select
                            labelInValue
                            filterOption={false}
                            onSearch={(value) => {console.log(value);}}
                            notFoundContent={fetchingLocation ? <Spin size="small" /> : null}
                            
                        />
                    </Form.Item>
                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}
                    >
                        {({ getFieldValue }) =>
                            getFieldValue('gender') === 'other' ? (
                                <Form.Item name="customizeGender" label="Customize Gender" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            ) : null
                        }
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                            <Button htmlType="button" onClick={onReset}>
                                Reset
                            </Button>
                            <Button type="link" htmlType="button" onClick={onFill}>
                                Fill form
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
