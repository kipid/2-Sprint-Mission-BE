"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../config/prisma"));
class ArticleRepository {
    async getArticles({ skip, take, orderBy, where }) {
        const list = await prisma_1.default.article.findMany({
            skip,
            take,
            orderBy,
            where,
            include: {
                author: {
                    select: {
                        id: true,
                        nickname: true,
                    },
                },
            },
        });
        const totalCount = await prisma_1.default.article.count({
            where,
        });
        return { list, totalCount };
    }
    create(data) {
        return prisma_1.default.article.create({
            data,
        });
    }
    updateById(id, data) {
        return prisma_1.default.article.update({
            where: {
                id,
            },
            data,
        });
    }
    deleteById(id) {
        return prisma_1.default.article.delete({
            where: {
                id,
            },
        });
    }
    getById(id) {
        return prisma_1.default.article.findUnique({
            where: {
                id,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        nickname: true,
                    },
                },
            },
        });
    }
    async likeArticle(articleId, userId) {
        return await prisma_1.default.$transaction([
            prisma_1.default.articleFavorite.create({
                data: {
                    articleId,
                    userId,
                },
            }),
            prisma_1.default.article.update({
                where: {
                    id: articleId,
                },
                data: {
                    favoriteCount: {
                        increment: 1,
                    },
                },
            }),
        ]);
    }
    async unlikeArticle(articleId, userId) {
        return await prisma_1.default.$transaction([
            prisma_1.default.articleFavorite.delete({
                where: {
                    userId_articleId: {
                        userId,
                        articleId,
                    },
                },
            }),
            prisma_1.default.article.update({
                where: {
                    id: articleId,
                },
                data: {
                    favoriteCount: {
                        decrement: 1,
                    },
                },
            }),
        ]);
    }
    getArticleFavorite(articleId, userId) {
        return prisma_1.default.articleFavorite.findUnique({
            where: {
                userId_articleId: {
                    userId,
                    articleId,
                },
            },
        });
    }
}
const articleRepository = new ArticleRepository();
exports.default = articleRepository;
