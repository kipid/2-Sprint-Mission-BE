"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_js_1 = __importDefault(require("../config/prisma.js"));
class UserRepository {
    async findById(id) {
        return prisma_js_1.default.user.findUnique({
            where: {
                id,
            },
        });
    }
    async findByEmail(email) {
        return prisma_js_1.default.user.findUnique({
            where: {
                email,
            },
        });
    }
    async save(user) {
        return prisma_js_1.default.user.create({
            data: { ...user },
        });
    }
    async update(id, data) {
        return prisma_js_1.default.user.update({
            where: {
                id,
            },
            data,
        });
    }
    async createOrUpdate(provider, providerId, email, nickname) {
        return prisma_js_1.default.user.upsert({
            where: { email },
            update: { provider, providerId },
            create: { provider, providerId, email, nickname },
        });
    }
}
exports.UserRepository = UserRepository;
const userRepository = new UserRepository();
exports.default = userRepository;
