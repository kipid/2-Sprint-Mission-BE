"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const articleRepository_js_1 = __importDefault(require("../repositories/articleRepository.js"));
async function getArticles({ page = 1, pageSize = 12, sort = "recent", keyword = "" }) {
    page = parseInt(page);
    pageSize = parseInt(pageSize);
    if (page < 1) {
        page = 1;
    }
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const query = keyword ? {
        OR: [{
                title: { contains: keyword }
            },
            {
                content: { contains: keyword }
            }]
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
    const { list, totalCount } = await articleRepository_js_1.default.getArticles({ skip, take, orderBy, where: query });
    return {
        list,
        totalCount
    };
}
async function create(data) {
    return await articleRepository_js_1.default.create(data);
}
async function updateById(id, data) {
    return await articleRepository_js_1.default.updateById(id, data);
}
async function deleteById(id) {
    return await articleRepository_js_1.default.deleteById(id);
}
async function getById(id, userId) {
    const article = await articleRepository_js_1.default.getById(id);
    if (!article) {
        throw new Error("Article not found");
    }
    const favorite = await articleRepository_js_1.default.getArticleFavorite(id, userId);
    try {
        article.isFavorite = favorite !== null;
    }
    catch (err) {
        article.isFavorite = false;
    }
    return article;
}
async function favorite(articleId, userId) {
    return await articleRepository_js_1.default.likeArticle(articleId, userId);
}
async function unfavorite(articleId, userId) {
    return await articleRepository_js_1.default.unlikeArticle(articleId, userId);
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
