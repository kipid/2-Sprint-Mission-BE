"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../config/prisma"));
class ProductCommentRepository {
    create(data) {
        return prisma_1.default.productComment.create({
            data,
            select: {
                id: true,
                content: true,
                createdAt: true,
                updatedAt: true,
                commenter: {
                    select: {
                        id: true,
                        nickname: true,
                    },
                },
            },
        });
    }
    getById(id) {
        return prisma_1.default.productComment.findUnique({
            where: {
                id,
            },
        });
    }
    updateById(id, data) {
        return prisma_1.default.productComment.update({
            where: {
                id,
            },
            data,
        });
    }
    deleteById(id) {
        return prisma_1.default.productComment.delete({
            where: {
                id,
            },
        });
    }
    findManyComments(productId) {
        return prisma_1.default.productComment.findMany({
            where: {
                productId,
            },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
                updatedAt: true,
                commenter: {
                    select: {
                        id: true,
                        nickname: true,
                    },
                },
            },
        });
    }
}
const productCommentRepository = new ProductCommentRepository();
exports.default = productCommentRepository;
