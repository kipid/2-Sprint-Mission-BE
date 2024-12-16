"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productRepository_js_1 = __importDefault(require("../repositories/productRepository.js"));
async function getProducts({ page = 1, pageSize = 10, sort = "recent", keyword = "" }) {
    page = parseInt(page);
    pageSize = parseInt(pageSize);
    if (page < 1) {
        page = 1;
    }
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const query = keyword ? {
        OR: [{
                name: { contains: keyword }
            },
            {
                description: { contains: keyword }
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
    const { products: list, totalCount } = await productRepository_js_1.default.getProducts({ skip, take, orderBy, where: query });
    return {
        list,
        totalCount
    };
}
async function getById(id, userId) {
    const product = await productRepository_js_1.default.getById(id);
    if (!product) {
        throw new Error('Product not found');
    }
    const favorite = await productRepository_js_1.default.getProductFavorite(id, userId);
    console.log('Favorite:', favorite);
    console.log('userId', userId);
    try {
        product.isFavorite = favorite !== null;
    }
    catch (err) {
        product.isFavorite = false;
    }
    return product;
}
async function updateById(id, product) {
    return await productRepository_js_1.default.updateById(id, product);
}
async function create(product) {
    return await productRepository_js_1.default.save(product);
}
async function deleteById(id) {
    return await productRepository_js_1.default.deleteById(id);
}
async function favorite(productId, userId) {
    return await productRepository_js_1.default.likeProduct(productId, userId);
}
async function unfavorite(productId, userId) {
    return await productRepository_js_1.default.unlikeProduct(productId, userId);
}
exports.default = {
    getProducts,
    getById,
    updateById,
    create,
    deleteById,
    favorite,
    unfavorite,
};
