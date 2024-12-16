"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = __importDefault(require("../config/prisma.js"));
async function getProducts({ skip, take, orderBy, where }) {
    const products = await prisma_js_1.default.product.findMany({
        skip,
        take,
        orderBy,
        where,
        include: {
            owner: {
                select: {
                    id: true,
                    nickname: true,
                },
            },
        }
    });
    const totalCount = await prisma_js_1.default.product.count({
        where,
    });
    return { products, totalCount };
}
async function getById(id) {
    return await prisma_js_1.default.product.findUnique({
        where: {
            id,
        },
        include: {
            owner: {
                select: {
                    id: true,
                    nickname: true,
                },
            },
        }
    });
}
async function updateById(id, product) {
    return await prisma_js_1.default.product.update({
        where: {
            id,
        },
        data: {
            ...product,
        },
    });
}
async function save(product) {
    return await prisma_js_1.default.product.create({
        data: {
            ...product
        },
    });
}
async function deleteById(id) {
    return await prisma_js_1.default.product.delete({
        where: {
            id,
        },
    });
}
;
async function likeProduct(productId, userId) {
    return await prisma_js_1.default.$transaction([
        prisma_js_1.default.productFavorite.create({
            data: {
                productId,
                userId,
            },
        }),
        prisma_js_1.default.product.update({
            where: {
                id: productId,
            },
            data: {
                favoriteCount: {
                    increment: 1,
                },
            },
        })
    ]);
}
async function unlikeProduct(productId, userId) {
    return await prisma_js_1.default.$transaction([
        prisma_js_1.default.productFavorite.delete({
            where: {
                userId_productId: {
                    userId,
                    productId,
                },
            },
        }),
        prisma_js_1.default.product.update({
            where: {
                id: productId,
            },
            data: {
                favoriteCount: {
                    decrement: 1,
                },
            },
        })
    ]);
}
async function getProductFavorite(productId, userId) {
    return await prisma_js_1.default.productFavorite.findUnique({
        where: {
            userId_productId: {
                userId,
                productId,
            },
        },
    });
}
exports.default = {
    getProducts,
    getById,
    updateById,
    save,
    deleteById,
    likeProduct,
    unlikeProduct,
    getProductFavorite,
};
