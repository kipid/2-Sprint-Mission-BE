"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = __importDefault(require("../config/prisma.js"));
async function create(data) {
    return await prisma_js_1.default.productComment.create({
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
async function getById(id) {
    return await prisma_js_1.default.productComment.findUnique({
        where: {
            id,
        },
    });
}
async function updateById(id, data) {
    return await prisma_js_1.default.productComment.update({
        where: {
            id,
        },
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
async function deleteById(id) {
    return await prisma_js_1.default.productComment.delete({
        where: {
            id,
        },
    });
}
async function findManyComments(productId) {
    return await prisma_js_1.default.productComment.findMany({
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
exports.default = {
    create,
    getById,
    updateById,
    deleteById,
    findManyComments,
};
