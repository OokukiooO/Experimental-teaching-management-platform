import React from 'react';
import ErrorMessage from '@/components/ErrorMessage';

export default function FacePage(){
  return <ErrorMessage title="人脸事件页面" detail="当前人脸事件模块尚未接入数据。" suggestion="后续可在此显示人脸识别记录、抓拍图片、搜索过滤等。" />
}