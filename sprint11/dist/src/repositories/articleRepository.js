"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = __importDefault(require("../config/prisma.js"));
async function getArticles({ skip, take, orderBy, where }) {
    const list = await prisma_js_1.default.article.findMany({
        skip,
        take,
        orderBy,
        where,
        select: {
            id: true,
            author: {
                select: {
                    nickname: true,
                }
            },
            title: true,
            content: true,
            images: true,
            favoriteCount: true,
            createdAt: true,
            updatedAt: true,
        }
    });
    const totalCount = await prisma_js_1.default.article.count({
        where,
    });
    return { list, totalCount };
}
async function create(data) {
    return await prisma_js_1.default.article.create({
        data,
    });
}
async function updateById(id, data) {
    return await prisma_js_1.default.article.update({
        where: {
            id,
        },
        data,
    });
}
async function deleteById(id) {
    return await prisma_js_1.default.article.delete({
        where: {
            id,
        },
    });
}
async function getById(id) {
    return await prisma_js_1.default.article.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            author: {
                select: {
                    id: true,
                    nickname: true,
                }
            },
            title: true,
            content: true,
            images: true,
            favoriteCount: true,
            createdAt: true,
            updatedAt: true,
        }
    });
}
async function likeArticle(articleId, userId) {
    return await prisma_js_1.default.$transaction([
        prisma_js_1.default.articleFavorite.create({
            data: {
                articleId,
                userId,
            },
        }),
        prisma_js_1.default.article.update({
            where: {
                id: articleId,
            },
            data: {
                favoriteCount: {
                    increment: 1,
                },
            },
        })
    ]);
}
async function unlikeArticle(articleId, userId) {
    return await prisma_js_1.default.$transaction([
        prisma_js_1.default.articleFavorite.delete({
            where: {
                userId_articleId: {
                    userId,
                    articleId,
                },
            },
        }),
        prisma_js_1.default.article.update({
            where: {
                id: articleId,
            },
            data: {
                favoriteCount: {
                    decrement: 1,
                },
            },
        })
    ]);
}
async function getArticleFavorite(articleId, userId) {
    return await prisma_js_1.default.articleFavorite.findUnique({
        where: {
            userId_articleId: {
                userId,
                articleId,
            },
        },
    });
}
exports.default = {
    getArticles,
    create,
    updateById,
    deleteById,
    getById,
    likeArticle,
    unlikeArticle,
    getArticleFavorite,
};
