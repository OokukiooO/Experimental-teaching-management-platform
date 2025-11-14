/*
 * @Author: Jan
 * @Date: 2024-05-13 16:14:08
 * @LastEditTime: 2024-05-13 16:14:19
 * @FilePath: /EasyAIWeb/lib/dbconn.ts
 * @Description: 
 * 
 */
import mongoose from "mongoose";
declare global {
    var mongoose: any; // This must be a `var` and not a `let / const`
}

// 允许在未配置时给出更清晰的日志，而不是在构建阶段直接 throw 使页面 500
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    if (process.env.NODE_ENV === 'production') {
        throw new Error("缺少 MONGODB_URI 环境变量 (.env.local)" );
    } else {
        console.warn('[dbConnect] 未检测到 MONGODB_URI，返回 mock 连接对象，相关查询会失败。请复制 .env.local.example 到 .env.local 并修改。');
    }
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise && MONGODB_URI) {
        const opts = { bufferCommands: false, serverSelectionTimeoutMS: 3000 } as any;
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose);
    }
    try {
        if (cached.promise) {
            cached.conn = await cached.promise;
        } else {
            // 无 URI 时直接抛错给调用方做 fallback，避免 Mongoose 内部缓冲导致 10s 超时
            throw new Error('MONGODB 未配置');
        }
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;