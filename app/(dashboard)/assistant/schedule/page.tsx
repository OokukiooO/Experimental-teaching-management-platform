"use client";
import { Button, DatePicker, Form, Input, Select, Table } from 'antd';
import React, { useState } from 'react';

export default function Schedule() {
  const [data, setData] = useState<any[]>([]);
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">智能排课</h2>
      <Form layout="inline" onFinish={(v)=> setData([{ key:1, room:v.room, course:v.course, teacher:v.teacher, time:v.date?.format('YYYY-MM-DD') }])}>
        <Form.Item name="course" label="课程" rules={[{ required:true }]}><Input placeholder="例如 实验课A" /></Form.Item>
        <Form.Item name="teacher" label="教师" rules={[{ required:true }]}><Input placeholder="张三" /></Form.Item>
        <Form.Item name="room" label="意向实验室"><Select style={{width:180}} options={[{value:'A101'},{value:'B203'},{value:'C305'}]} /></Form.Item>
        <Form.Item name="date" label="日期" rules={[{ required:true }]}><DatePicker /></Form.Item>
        <Form.Item><Button type="primary" htmlType="submit">生成方案</Button></Form.Item>
      </Form>
      <Table size="small" dataSource={data} columns={[{title:'课程',dataIndex:'course'},{title:'教师',dataIndex:'teacher'},{title:'实验室',dataIndex:'room'},{title:'日期',dataIndex:'time'}]} pagination={false} />
    </div>
  );
}
