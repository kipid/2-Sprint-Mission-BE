"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = __importDefault(require("../config/prisma.js"));
async function findManyComments(articleId) {
    return await prisma_js_1.default.articleComment.findMany({
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
async function getById(id) {
    return await prisma_js_1.default.articleComment.findUnique({
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
async function create({ data }) {
    return await prisma_js_1.default.articleComment.create({
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
async function updateById(id, data) {
    return await prisma_js_1.default.articleComment.update({
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
        }
    });
}
async function deleteById(id) {
    return await prisma_js_1.default.articleComment.delete({
        where: {
            id,
        },
    });
}
exports.default = {
    findManyComments,
    getById,
    create,
    updateById,
    deleteById,
};
