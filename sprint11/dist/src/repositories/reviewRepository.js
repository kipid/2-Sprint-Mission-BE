"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = __importDefault(require("../config/prisma.js"));
async function save(review) {
    const createdReview = await prisma_js_1.default.review.create({
        data: {
            title: review.title,
            description: review.description,
            rating: review.rating,
            product: {
                connect: {
                    id: review.productId,
                },
            },
            author: {
                connect: {
                    id: review.authorId,
                },
            },
        },
    });
    return createdReview;
}
async function getById(id) {
    const review = await prisma_js_1.default.review.findUnique({
        where: {
            id: parseInt(id, 10),
        },
    });
    return review;
}
async function getAll() {
    const reviews = await prisma_js_1.default.review.findMany();
    return reviews;
}
async function update(id, review) {
    const updatedReview = await prisma_js_1.default.review.update({
        where: {
            id: parseInt(id, 10),
        },
        data: {
            title: review.title,
            description: review.description,
            rating: review.rating,
        },
    });
    return updatedReview;
}
async function deleteById(id) {
    const deletedReview = await prisma_js_1.default.review.delete({
        where: {
            id: parseInt(id, 10),
        },
    });
    return deletedReview;
}
exports.default = {
    save,
    getById,
    getAll,
    update,
    deleteById,
};
