/*
 * @Author: Jan
 * @Date: 2024-04-23 22:22:30
 * @LastEditTime: 2024-05-15 10:07:57
 * @FilePath: /EasyAIWeb/app/layout.tsx
 * @Description: 
 * 
 */
import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from "antd";
import '@/app/globals.css'

const RootLayout = ({ children }: React.PropsWithChildren) => (
    <html lang="en">
        <body className='ui-body' style={{ margin: 0 }}>
            {/* <Watermark content="兆德梁行AI中台未授权" gap={[150,150]}> */}

                <AntdRegistry>
                    <ConfigProvider
                        theme={{
                            token: {
                                colorPrimary: '#2563eb',
                                borderRadius: 12,
                                colorBgContainer: '#ffffff',
                                colorText: '#0f172a',
                                colorTextSecondary: '#475569',
                                boxShadowSecondary: '0 10px 35px rgba(15, 23, 42, 0.08)'
                            },
                            components: {
                                Button: {
                                    controlHeight: 36,
                                    borderRadius: 10
                                },
                                Input: {
                                    borderRadius: 10,
                                    controlHeight: 38
                                },
                                Select: {
                                    borderRadius: 10,
                                    controlHeight: 38
                                },
                                Card: {
                                    borderRadiusLG: 14
                                },
                                Table: {
                                    borderRadius: 12
                                }
                            }
                        }}
                    >
                        {children}
                    </ConfigProvider>
                </AntdRegistry>

            {/* </Watermark> */}
        </body>
    </html>
);

export default RootLayout;
