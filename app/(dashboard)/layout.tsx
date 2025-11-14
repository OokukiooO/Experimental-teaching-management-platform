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
        <div className='h-screen overflow-hidden'>
            <div className='top-0 left-0 h-14 w-screen bg-white z-1 flex flex-row content-center justify-between pr-6'>
                <div className='flex flex-row'>
                    <img src='/gdut.png' className='h-[73%] relative top-3 left-4' alt='GDUT' />
                </div>
                <div className='flex items-center'>
                    <UserMenu user={user} />
                </div>
            </div>
            <div className="grid grid-cols-10 gap-0 h-full bg-gray">
                <div className="col-span-2">
                    <Menu />
                </div>
                <div className="col-span-8 overflow-scroll pb-20">
                    <div className='m-8'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default App;