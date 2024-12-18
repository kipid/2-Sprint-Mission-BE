"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../config/prisma"));
class ArticleCommentRepository {
    async findManyComments(articleId) {
        return await prisma_1.default.articleComment.findMany({
            where: {
                articleId,
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
    async getById(id) {
        return await prisma_1.default.articleComment.findUnique({
            where: {
                id,
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
    async create({ data }) {
        return await prisma_1.default.articleComment.create({
            data,
        });
    }
    updateById(id, data) {
        return prisma_1.default.articleComment.update({
            where: {
                id,
            },
            data,
        });
    }
    deleteById(id) {
        return prisma_1.default.articleComment.delete({
            where: {
                id,
            },
        });
    }
}
const articleCommentRepository = new ArticleCommentRepository();
exports.default = articleCommentRepository;
