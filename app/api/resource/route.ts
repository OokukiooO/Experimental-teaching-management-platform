/*
 * @Author: Jan
 * @Date: 2024-06-03 14:18:59
 * @LastEditTime: 2024-07-07 16:00:40
 * @FilePath: /EasyAIWeb/app/api/resource/route.ts
 * @Description: 
 * 
 */
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile, readFile } from "fs/promises";
import { ObjectId } from "bson";


export const POST = async (req: Request) => {
    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
        return NextResponse.json({ code: 410, msg: "没有识别到上传文件" }, { status: 200 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = path.extname(file.name);
    const fileId = new ObjectId().toString();
    const fileName = fileId + fileExtension;
    try {
        await writeFile(
            path.join(process.cwd(), "public/resources/" + fileName),
            buffer
        );
        return NextResponse.json({ code: 200, msg: "上传成功", data: { resourceName: fileName } });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ code: 500, msg: "上传失败" }, { status: 500 });
    }
};

export const GET = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const rid = searchParams.get('rid')
    let file = null

    try {
        file = await readFile(`./public/resources/${rid}`)
    } catch (e) {
        return NextResponse.json({ code: 500, msg: "资源失效" }, { status: 500 })
    }

    return new Response(file, {
        headers: {
            'Content-Type': 'image/png',
        }
    })
}
