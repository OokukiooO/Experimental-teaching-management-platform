"use client";
import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

export default function CameraModal(){
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();

  const submit = async ()=>{
    const values = await form.validateFields();
    setLoading(true);
    try{
      const res = await fetch('/api/camera', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(values) });
      const json = await res.json();
      if(json.ok){ message.success('新增成功'); setOpen(false); form.resetFields(); router.refresh(); }
      else { message.error('新增失败'); }
    } finally { setLoading(false); }
  }

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={()=>setOpen(true)}>新增摄像头</Button>
      <Modal title="新增摄像头" open={open} onCancel={()=>setOpen(false)} onOk={submit} confirmLoading={loading} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item label="名称" name="name" rules={[{ required:true }]}><Input /></Form.Item>
          <Form.Item label="厂商" name="vendor"><Input /></Form.Item>
          <Form.Item label="IP" name="ip"><Input placeholder="如 192.168.1.10" /></Form.Item>
          <Form.Item label="位置" name="locationName"><Input /></Form.Item>
          <Form.Item label="流地址(URI)" name="streamUri" rules={[{ required:true }]}>
            <Input placeholder="rtsp://user:pwd@ip:554/Streaming/Channels/101" />
          </Form.Item>
          <Form.Item label="ONVIF 地址" name="onvifUri"><Input placeholder="http://ip:80/onvif/device_service" /></Form.Item>
          <Form.Item label="备注" name="note"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
    </>
  )
}
