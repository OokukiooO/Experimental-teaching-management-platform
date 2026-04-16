"use client";
import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Input, message, Spin } from 'antd';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [profileForm] = Form.useForm();
  const [pwdForm] = Form.useForm();

  async function loadProfile() {
    setLoading(true);
    try {
      const res = await fetch('/api/user/profile', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '加载失败');
      profileForm.setFieldsValue({
        name: data.profile?.name || '',
        email: data.profile?.email || '',
        role: data.profile?.role || 'admin',
        streamGatewayUrl: data.profile?.streamGatewayUrl || '',
        dbUri: data.profile?.databaseConfig?.uri || '',
        dbName: data.profile?.databaseConfig?.dbName || '',
        dbUser: data.profile?.databaseConfig?.user || '',
        dbPassword: data.profile?.databaseConfig?.password || '',
      });
    } catch (e: any) {
      message.error(e?.message || '加载失败');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadProfile(); }, []);

  const saveProfile = async () => {
    const values = await profileForm.validateFields();
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          streamGatewayUrl: values.streamGatewayUrl,
          databaseConfig: {
            uri: values.dbUri,
            dbName: values.dbName,
            user: values.dbUser,
            password: values.dbPassword,
          }
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '保存失败');
      message.success('用户信息已更新');
      await loadProfile();
    } catch (e: any) {
      message.error(e?.message || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    const values = await pwdForm.validateFields();
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的新密码不一致');
      return;
    }
    setPwdSaving(true);
    try {
      const res = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '密码修改失败');
      message.success('密码修改成功');
      pwdForm.resetFields();
    } catch (e: any) {
      message.error(e?.message || '密码修改失败');
    } finally {
      setPwdSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='ui-surface p-8 flex items-center justify-center min-h-[360px]'>
        <Spin />
      </div>
    );
  }

  return (
    <div className='space-y-5'>
      <div className='ui-surface p-6'>
        <h1 className='ui-title text-2xl font-semibold text-slate-800'>当前用户信息</h1>
        <p className='mt-1 text-sm text-slate-500'>管理账号资料、登录安全、统一流媒体网关地址与数据库连接配置。</p>
      </div>

      <div className='grid grid-cols-1 xl:grid-cols-2 gap-5'>
        <div className='ui-surface p-6'>
          <h2 className='text-lg font-semibold text-slate-800 mb-4'>基础资料与系统配置</h2>
          <Form form={profileForm} layout='vertical'>
            <Form.Item label='用户名' name='name' rules={[{ required: true, message: '请输入用户名' }]}>
              <Input placeholder='请输入用户名' />
            </Form.Item>
            <Form.Item label='邮箱绑定' name='email' rules={[{ type: 'email', message: '邮箱格式不正确' }]}>
              <Input placeholder='例如 admin@example.com' />
            </Form.Item>
            <Form.Item label='角色' name='role'>
              <Input disabled />
            </Form.Item>
            <Form.Item label='统一流媒体网关地址' name='streamGatewayUrl'>
              <Input placeholder='例如 http://stream-gateway.local:8080' />
            </Form.Item>

            <div className='mt-2 mb-3 text-sm font-semibold text-slate-700'>数据库配置</div>
            <Form.Item label='连接地址 URI' name='dbUri'>
              <Input placeholder='mongodb://127.0.0.1:27017' />
            </Form.Item>
            <Form.Item label='数据库名称' name='dbName'>
              <Input placeholder='experimental_teaching' />
            </Form.Item>
            <Form.Item label='数据库账号' name='dbUser'>
              <Input placeholder='db_user' />
            </Form.Item>
            <Form.Item label='数据库密码' name='dbPassword'>
              <Input.Password placeholder='请输入数据库密码' />
            </Form.Item>

            <Alert
              type='info'
              showIcon
              className='mb-4'
              message='配置说明'
              description='该配置用于运维参数记录与页面管理展示。若需实际生效，请同步更新服务端环境变量并重启服务。'
            />

            <Button type='primary' loading={saving} onClick={saveProfile}>保存资料与配置</Button>
          </Form>
        </div>

        <div className='ui-surface p-6'>
          <h2 className='text-lg font-semibold text-slate-800 mb-4'>登录安全</h2>
          <Form form={pwdForm} layout='vertical'>
            <Form.Item label='原密码' name='oldPassword' rules={[{ required: true, message: '请输入原密码' }]}>
              <Input.Password placeholder='请输入原密码' />
            </Form.Item>
            <Form.Item label='新密码' name='newPassword' rules={[{ required: true, message: '请输入新密码' }, { min: 6, message: '新密码至少 6 位' }]}>
              <Input.Password placeholder='请输入新密码' />
            </Form.Item>
            <Form.Item label='确认新密码' name='confirmPassword' rules={[{ required: true, message: '请再次输入新密码' }]}>
              <Input.Password placeholder='请再次输入新密码' />
            </Form.Item>
            <Button type='primary' loading={pwdSaving} onClick={changePassword}>修改密码</Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
