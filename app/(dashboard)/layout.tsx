/*
 * @Author: Jan
 * @Date: 2024-05-09 21:44:35
 * @LastEditTime: 2024-06-04 23:38:13
 * @FilePath: /EasyAIWeb/app/(dashboard)/layout.tsx
 * @Description: 
 * 
 */
'use server'
import React from 'react';
import Menu from '@/components/menu';
import { getUserFromRequest } from '@/lib/auth';
import UserMenu from '@/components/auth/UserMenu';


const App: React.FC = async ({ children }: React.PropsWithChildren) => {

    // const activeItemId = menuItem?.find(itm => _.includes(usePathname(), itm!.key))?.key;
    // console.log(activeItemId);

    const user = await getUserFromRequest();
    return (
        <div className='h-screen overflow-hidden bg-transparent'>
            <div className='top-0 left-0 h-16 w-screen bg-white/90 backdrop-blur border-b border-slate-200 z-10 flex flex-row content-center justify-between px-6'>
                <div className='flex flex-row items-center'>
                    <div className='flex items-center gap-2'>
                        <span className='inline-block h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-md shadow-blue-200' />
                        <span className='ui-title text-base font-semibold tracking-wide text-slate-700'>实验教学管理平台</span>
                    </div>
                </div>
                <div className='flex items-center'>
                    <UserMenu user={user} />
                </div>
            </div>
            <div className="grid grid-cols-10 gap-6 h-[calc(100%-64px)] bg-transparent p-6">
                <div className="col-span-2 app-shell-card overflow-hidden">
                    <div className='h-full py-3'>
                        <Menu />
                    </div>
                </div>
                <div className="col-span-8 overflow-scroll pb-20 app-shell-card">
                    <div className='m-6'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default App;