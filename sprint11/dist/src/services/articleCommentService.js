"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const articleCommentRepository_1 = __importDefault(require("../repositories/articleCommentRepository"));
async function findManyComments(articleId) {
    return await articleCommentRepository_1.default.findManyComments(articleId);
}
async function create(articleId, userId, content) {
    return await articleCommentRepository_1.default.create({
        data: {
            articleId,
            commenterId: userId,
            content,
        },
    });
}
async function updateById(id, data) {
    return await articleCommentRepository_1.default.updateById(id, data);
}
async function deleteById(id) {
    return await articleCommentRepository_1.default.deleteById(id);
}
exports.default = {
    findManyComments,
    create,
    updateById,
    deleteById,
};
