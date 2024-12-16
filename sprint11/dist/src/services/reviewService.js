"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reviewRepository_js_1 = __importDefault(require("../repositories/reviewRepository.js"));
async function create(review) {
    return reviewRepository_js_1.default.save(review);
}
async function getById(id) {
    return reviewRepository_js_1.default.getById(id);
}
async function getAll() {
    return reviewRepository_js_1.default.getAll();
}
async function update(id, review) {
    return reviewRepository_js_1.default.update(id, review);
}
async function deleteById(id) {
    return reviewRepository_js_1.default.deleteById(id);
}
exports.default = {
    create,
    getById,
    getAll,
    update,
    deleteById,
};
