/*
 * @Author: Jan
 * @Date: 2024-06-04 21:52:14
 * @LastEditTime: 2024-06-10 19:51:23
 * @FilePath: /EasyAIWeb/app/(dashboard)/config/task/page.tsx
 * @Description: 
 * 
 */
'use client'
import React from 'react';
import TaskTable from './tasktable';
import TaskModal from './taskmodal';
import { Button } from 'antd';
import { useState } from 'react';
import { task } from '@/models/task';

export default function TaskPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState<unknown | task>({});
    const [modalMode, setModalMode] = useState('创建');

    const showModal = () => {
        setIsModalOpen(true);
    }
    const closeModal = () => {
        setIsModalOpen(false);
    }

    return (
        <>
            <TaskModal isModalOpen={isModalOpen} handleOk={closeModal} handleCancel={closeModal} mode={modalMode}></TaskModal>
            <TaskTable showModal={showModal} setModalInfo={setModalInfo} setModalMode={setModalMode}></TaskTable>
        </>
    )
}