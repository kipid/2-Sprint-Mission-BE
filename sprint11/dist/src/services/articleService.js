"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const articleRepository_1 = __importDefault(require("../repositories/articleRepository"));
const types_1 = require("../types/types");
const httpStatus_1 = __importDefault(require("../httpStatus"));
async function getArticles({ page = 1, pageSize = 12, sort = "recent", keyword = "" }) {
    if (page < 1) {
        page = 1;
    }
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const query = keyword
        ? {
            OR: [{
                    title: { contains: keyword },
                }, {
                    content: { contains: keyword },
                }],
        }
        : {};
    let orderBy;
    switch (sort) {
        case "favorite":
            orderBy = { favoriteCount: "desc" };
            break;
        case "oldest":
            orderBy = { createdAt: "asc" };
            break;
        case "recent":
        default:
            orderBy = { createdAt: "desc" };
    }
    const { list, totalCount } = await articleRepository_1.default.getArticles({
        skip,
        take,
        orderBy,
        where: query,
    });
    return {
        list,
        totalCount,
    };
}
async function create(data) {
    return await articleRepository_1.default.create(data);
}
async function updateById(id, data) {
    return await articleRepository_1.default.updateById(id, data);
}
async function deleteById(id) {
    return await articleRepository_1.default.deleteById(id);
}
async function getById(id, userId) {
    const article = await articleRepository_1.default.getById(id);
    if (!article) {
        throw new types_1.CustomError("Article not found", httpStatus_1.default.NOT_FOUND);
    }
    const favorite = await articleRepository_1.default.getArticleFavorite(id, userId);
    return { ...article, isFavorite: favorite !== null };
}
async function favorite(articleId, userId) {
    return await articleRepository_1.default.likeArticle(articleId, userId);
}
async function unfavorite(articleId, userId) {
    return await articleRepository_1.default.unlikeArticle(articleId, userId);
}
exports.default = {
    getArticles,
    create,
    updateById,
    deleteById,
    getById,
    favorite,
    unfavorite,
};
