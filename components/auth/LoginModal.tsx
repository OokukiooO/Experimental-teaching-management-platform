"use client";
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Space, message } from 'antd';

interface Props { visible: boolean; onSuccess: () => void; }

export default function LoginModal({ visible, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [captchaSvg, setCaptchaSvg] = useState<string>('');
  const [captchaId, setCaptchaId] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [captchaReady, setCaptchaReady] = useState(false);
  const [form] = Form.useForm();

  const loadCaptcha = async () => {
  setCaptchaReady(false);
  const res = await fetch('/api/auth/captcha');
  const data = await res.json();
  setCaptchaId(data.id);
  setCaptchaSvg(data.svg);
  setCaptchaReady(true);
  };

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (mounted && visible) loadCaptcha(); }, [mounted, visible]);

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      if (!captchaId) {
        message.warning('验证码未就绪，请稍候或点击刷新');
        await loadCaptcha();
        return;
      }
  const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
          captcha: values.captcha,
          captchaId
        })
      });
  let data: any = {};
  try { data = await res.json(); } catch { data = {}; }
      if (res.ok) {
        onSuccess();
      } else {
        if (data?.missing?.captchaId) {
          message.error('验证码失效，请刷新后重试');
        } else {
          message.error(data.error || '登录失败');
        }
        await loadCaptcha();
      }
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <Modal open={visible} title="登录" footer={null} closable={false} maskClosable={false} getContainer={false} destroyOnClose>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        validateTrigger={["onChange","onBlur"]}
        onValuesChange={(changed)=>{ Object.keys(changed).forEach((k)=> form.setFields([{ name: k, errors: [] }])); }}
      >
        <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
          <Input autoFocus allowClear />
        </Form.Item>
        <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password allowClear />
        </Form.Item>
        <Form.Item label="验证码" required>
          <Space align="start">
            <Form.Item name="captcha" noStyle rules={[{ required: true, message: '请输入验证码' }]}>
              <Input style={{ width: 120 }} />
            </Form.Item>
            <div dangerouslySetInnerHTML={{ __html: captchaSvg }} style={{ cursor: 'pointer' }} onClick={loadCaptcha} />
            <Button type="link" onClick={loadCaptcha}>刷新</Button>
          </Space>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} disabled={!captchaReady} block>登录</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
