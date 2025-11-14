import { model, models, Schema } from 'mongoose';

// 新的用户模型：使用 passwordHash 替代明文/旧字段 pwd；保留 pwd 兼容（只读，用于迁移）
let UserSchema = new Schema({
    name: { type: String, required: true, index: true, unique: true },
    passwordHash: { type: String }, // 新字段，哈希后的密码
    pwd: { type: String }, // 旧字段兼容，后续迁移可清理
    role: { type: String, default: 'admin' },
    avatar: { type: String },
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() }
}, { timestamps: true });

const User = models.User || model('User', UserSchema);
export default User;