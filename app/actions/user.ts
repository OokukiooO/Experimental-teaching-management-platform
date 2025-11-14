/*
 * @Author: Jan
 * @Date: 2024-05-14 15:30:40
 * @LastEditTime: 2024-06-03 16:16:48
 * @FilePath: /EasyAIWeb/app/actions/user.ts
 * @Description: 
 * 
 */
'use server';
import  User from '@/models/user';
import dbConnect from '@/lib/dbconn';

export async function getUser(name: string) {
    await dbConnect();
    let user = await User.findOne({ name: name }).exec()
    console.log(user);
}