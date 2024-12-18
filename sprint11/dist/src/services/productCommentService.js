"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productCommentRepository_1 = __importDefault(require("../repositories/productCommentRepository"));
async function create(data) {
    try {
        const createdComment = await productCommentRepository_1.default.create(data);
        return createdComment;
    }
    catch (error) {
        throw error;
    }
}
async function findManyComments(productId) {
    try {
        const comments = await productCommentRepository_1.default.findManyComments(productId);
        return comments;
    }
    catch (error) {
        throw error;
    }
}
async function update(commentId, data) {
    try {
        const updatedComment = await productCommentRepository_1.default.updateById(commentId, data);
        return updatedComment;
    }
    catch (error) {
        throw error;
    }
}
async function deleteById(commentId) {
    try {
        const deletedComment = await productCommentRepository_1.default.deleteById(commentId);
        return deletedComment;
    }
    catch (error) {
        throw error;
    }
}
exports.default = {
    create,
    findManyComments,
    update,
    deleteById,
};
