/*
 * @Author: Jan
 * @Date: 2024-06-03 22:17:40
 * @LastEditTime: 2024-06-16 14:10:57
 * @FilePath: /EasyAIWeb/app/api/location/route.ts
 * @Description: 
 * 
 */
import Location from '@/models/location';
import dbConnect from "@/lib/dbconn";

const locationData = [
    { name: 'Home' },
    {
        name: 'Products', children: [
            {
                name: 'Laptops', children: [
                    { name: 'Product A' },
                    { name: 'Product B' }
                ]
            },
            { name: 'Desktops' }
        ]
    },
    { name: 'About' },
    { name: 'Services' },
    { name: 'Contact' }
]

function createMenu(locationData: Array<any>) {
    const locations: Array<any> = [];
    locationData.forEach(item => {
        const menuItem = new Location({ name: item.name });
        if (item.children) {
            menuItem.children = createMenu(item.children);
        }
        locations.push(menuItem);
    });
    return locations;
}

export async function POST() {
    await dbConnect()
    // 递归函数，用于创建嵌套的菜单项
    // const locations = createMenu(locationData);
    // console.log(JSON.stringify(locations));
    // await Location.insertMany(locations)

    return Response.json({ message: 'Location data inserted' });
}

