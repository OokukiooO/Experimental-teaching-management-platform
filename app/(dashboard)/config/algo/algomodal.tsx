"use client";
import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export default function AlgoModal(){
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const submit = async ()=>{
    const values = await form.validateFields();
    setLoading(true);
    try{
      const res = await fetch('/api/algo', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(values) });
      const json = await res.json();
      if(json.ok){ message.success('新增成功'); setOpen(false); form.resetFields(); location.reload(); }
      else { message.error('新增失败'); }
    } finally { setLoading(false); }
  }

  return (
    <>
      <Button type="default" icon={<PlusOutlined />} onClick={()=>setOpen(true)}>新增算法节点</Button>
      <Modal title="新增算法节点" open={open} onCancel={()=>setOpen(false)} onOk={submit} confirmLoading={loading} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item label="节点名称" name="name" rules={[{ required:true }]}><Input /></Form.Item>
          <Form.Item label="节点地址/主机" name="host" rules={[{ required:true }]}><Input placeholder="如 10.0.0.11 或 node.local" /></Form.Item>
          <Form.Item label="API 基址" name="apiBase"><Input placeholder="http://host:port" /></Form.Item>
        </Form>
      </Modal>
    </>
  )
}
