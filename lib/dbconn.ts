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
let RAW_URI = process.env.MONGODB_URI;
// 处理可能的 BOM 与首尾空白
if (RAW_URI) {
    RAW_URI = RAW_URI.replace(/^\uFEFF/, '').trim();
}
const MONGODB_URI = RAW_URI;

if (!MONGODB_URI) {
    if (process.env.NODE_ENV === 'production') {
        throw new Error("缺少 MONGODB_URI 环境变量 (.env.local)" );
    } else {
        console.warn('[dbConnect] 未检测到 MONGODB_URI，返回 mock 连接对象，相关查询会失败。请复制 .env.local.example 到 .env.local 并修改。');
    }
}

// 连接字符串自修复：
function normalizeMongoUri(raw?: string): string | undefined {
    if (!raw) return undefined;
    let uri = raw.replace(/^\uFEFF/, '').trim();
    // 非法前缀：截取第一个以 mongodb 开头的部分
    if (!/^mongodb(\+srv)?:\/\//.test(uri)) {
        const idx = uri.indexOf('mongodb://');
        const idxSrv = uri.indexOf('mongodb+srv://');
        const cut = [idx, idxSrv].filter(i => i >= 0).sort((a,b)=>a-b)[0];
        if (cut !== undefined) uri = uri.slice(cut);
    }
    // 若是 SRV 且没有路径数据库名，则补一个默认库 easyaiweb
    if (/^mongodb\+srv:\/\//.test(uri)) {
        // 形如 mongodb+srv://user:pass@host/?query 或 没有 /dbname
        const afterHost = uri.replace(/^mongodb\+srv:\/\/[^/]+/, (m) => m); // 保留
        if (/^mongodb\+srv:\/\/[^/]+\/?(\?|$)/.test(uri)) {
            // 在主机后面直接插入 /easyaiweb
            uri = uri.replace(/^(mongodb\+srv:\/\/[^/]+)\/?/, '$1/easyaiweb');
            if (!/\?/.test(uri)) {
                uri += '?retryWrites=true&w=majority';
            }
        }
    }
    return uri;
}

let FINAL_URI = normalizeMongoUri(MONGODB_URI);

// 支持备用直连主机列表（避免本地 SRV 解析问题）
// MONGODB_FALLBACK_HOSTS=hostA:27017,hostB:27017,hostC:27017
// MONGODB_RS=atlas-2jf2eq-shard-0  MONGODB_DB=easyaiweb  MONGODB_USER=xxx  MONGODB_PASS=xxx
if (!FINAL_URI && process.env.MONGODB_FALLBACK_HOSTS && process.env.MONGODB_USER && process.env.MONGODB_PASS) {
    const hosts = process.env.MONGODB_FALLBACK_HOSTS.trim();
    const rs = process.env.MONGODB_RS || 'atlas-2jf2eq-shard-0';
    const db = process.env.MONGODB_DB || 'easyaiweb';
    FINAL_URI = `mongodb://${encodeURIComponent(process.env.MONGODB_USER)}:${encodeURIComponent(process.env.MONGODB_PASS)}@${hosts}/${db}?replicaSet=${rs}&ssl=true&authSource=admin`;    
}

// 在开发模式输出前 80 字符用于排查（隐藏密码）
if (process.env.NODE_ENV !== 'production') {
    try {
        const safe = FINAL_URI?.replace(/:\/\/(.*?):(.*?)@/, (m, u) => `://<${u}>:***@`).slice(0,80);
        console.log('[dbConnect] Using URI prefix:', safe);
    } catch {}
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise && FINAL_URI) {
        const opts = { bufferCommands: false, serverSelectionTimeoutMS: 5000 } as any;
        cached.promise = mongoose.connect(FINAL_URI, opts).then((mongoose) => mongoose);
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