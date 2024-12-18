"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateArticleComment = exports.CreateProductComment = exports.PatchArticle = exports.CreateArticle = exports.PatchProduct = exports.CreateProduct = exports.PatchUser = exports.CreateUser = void 0;
const is_email_1 = __importDefault(require("is-email"));
// import isUuid from "is-uuid";
const superstruct_1 = require("superstruct");
// const Uuid = define('Uuid', (value: unknown) => isUuid.v4(value as string));
const email = (0, superstruct_1.define)("email", (value) => (0, is_email_1.default)(value));
exports.CreateUser = (0, superstruct_1.object)({
    email: email,
    nickname: (0, superstruct_1.size)((0, superstruct_1.string)(), 1, 20),
    password: (0, superstruct_1.string)(),
});
exports.PatchUser = (0, superstruct_1.partial)(exports.CreateUser);
// * User id 는 따로 받아야 함.
exports.CreateProduct = (0, superstruct_1.object)({
    name: (0, superstruct_1.size)((0, superstruct_1.string)(), 1, 10),
    description: (0, superstruct_1.size)((0, superstruct_1.string)(), 10, 100),
    price: (0, superstruct_1.min)((0, superstruct_1.number)(), 0),
    tags: (0, superstruct_1.size)((0, superstruct_1.array)((0, superstruct_1.string)()), 0, 15),
    images: (0, superstruct_1.size)((0, superstruct_1.array)((0, superstruct_1.string)()), 0, 3),
    ownerId: (0, superstruct_1.integer)(),
    favoriteCount: (0, superstruct_1.min)((0, superstruct_1.integer)(), 0),
});
exports.PatchProduct = (0, superstruct_1.partial)(exports.CreateProduct);
// * Product id 는 따로 받아야 함.
exports.CreateArticle = (0, superstruct_1.object)({
    title: (0, superstruct_1.size)((0, superstruct_1.string)(), 1, 50),
    authorId: (0, superstruct_1.integer)(),
    content: (0, superstruct_1.size)((0, superstruct_1.string)(), 10, 500),
    images: (0, superstruct_1.size)((0, superstruct_1.array)((0, superstruct_1.string)()), 0, 3),
    favoriteCount: (0, superstruct_1.min)((0, superstruct_1.integer)(), 0),
});
exports.PatchArticle = (0, superstruct_1.partial)(exports.CreateArticle);
// * Article id 는 따로 받아야 함.
exports.CreateProductComment = (0, superstruct_1.object)({
    commenterId: (0, superstruct_1.integer)(),
    content: (0, superstruct_1.size)((0, superstruct_1.string)(), 1, 255),
});
// * Patch 는 위 데이터에 id 추가.
exports.CreateArticleComment = (0, superstruct_1.object)({
    commenterId: (0, superstruct_1.integer)(),
    content: (0, superstruct_1.size)((0, superstruct_1.string)(), 1, 255),
});
// * Patch 는 위 데이터에 id 추가.
