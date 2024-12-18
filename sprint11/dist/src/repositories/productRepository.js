"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../config/prisma"));
class ProductRepository {
    async getProducts({ skip, take, orderBy, where }) {
        const products = await prisma_1.default.product.findMany({
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
            },
        });
        const totalCount = await prisma_1.default.product.count({
            where,
        });
        return { products, totalCount };
    }
    getById(id) {
        return prisma_1.default.product.findUnique({
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
            },
        });
    }
    updateById(id, product) {
        return prisma_1.default.product.update({
            where: {
                id,
            },
            data: {
                ...product,
            },
        });
    }
    save(product) {
        return prisma_1.default.product.create({
            data: product,
        });
    }
    deleteById(id) {
        return prisma_1.default.product.delete({
            where: {
                id,
            },
        });
    }
    likeProduct(productId, userId) {
        return prisma_1.default.$transaction([
            prisma_1.default.productFavorite.create({
                data: {
                    productId,
                    userId,
                },
            }),
            prisma_1.default.product.update({
                where: {
                    id: productId,
                },
                data: {
                    favoriteCount: {
                        increment: 1,
                    },
                },
            }),
        ]);
    }
    unlikeProduct(productId, userId) {
        return prisma_1.default.$transaction([
            prisma_1.default.productFavorite.delete({
                where: {
                    userId_productId: {
                        userId,
                        productId,
                    },
                },
            }),
            prisma_1.default.product.update({
                where: {
                    id: productId,
                },
                data: {
                    favoriteCount: {
                        decrement: 1,
                    },
                },
            }),
        ]);
    }
    getProductFavorite(productId, userId) {
        return prisma_1.default.productFavorite.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId,
                },
            },
        });
    }
}
const productRepository = new ProductRepository();
exports.default = productRepository;
