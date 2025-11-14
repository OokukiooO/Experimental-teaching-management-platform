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
import { Watermark } from "antd";
import '@/app/globals.css'

const RootLayout = ({ children }: React.PropsWithChildren) => (
    <html lang="en">
        <body style={{ margin: 0 }}>
            {/* <Watermark content="兆德梁行AI中台未授权" gap={[150,150]}> */}

                <AntdRegistry>{children}</AntdRegistry>

            {/* </Watermark> */}
        </body>
    </html>
);

export default RootLayout;
