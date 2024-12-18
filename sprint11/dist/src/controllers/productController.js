"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productService_1 = __importDefault(require("../services/productService"));
const productCommentService_1 = __importDefault(require("../services/productCommentService"));
const structs_1 = require("../structs");
const superstruct_1 = require("superstruct");
const auth_1 = __importDefault(require("../middlewares/auth"));
const passport_1 = __importDefault(require("../config/passport"));
const httpStatus_1 = __importDefault(require("../httpStatus"));
const productController = express_1.default.Router();
productController.post("/", passport_1.default.authenticate("access-token", { session: false }), async (req, res, next) => {
    try {
        const { id: userId } = req.user;
        req.body.ownerId = userId;
        req.body.favoriteCount = 0;
        (0, superstruct_1.assert)(req.body, structs_1.CreateProduct);
        const createdProduct = await productService_1.default.create(req.body);
        res.json(createdProduct);
    }
    catch (err) {
        next(err);
    }
});
productController.get("/:productId", passport_1.default.authenticate("access-token", { session: false }), async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { id: userId } = req.user;
        const product = await productService_1.default.getById(productId, userId);
        res.json(product);
    }
    catch (err) {
        next(err);
    }
});
productController.get("/:productId/comments", async (req, res, next) => {
    try {
        const { productId } = req.params;
        const products = await productCommentService_1.default.findManyComments(productId);
        res.json(products);
    }
    catch (err) {
        next(err);
    }
});
productController.post("/:productId/comments", passport_1.default.authenticate("access-token", { session: false }), async (req, res, next) => {
    try {
        const { id: userId } = req.user;
        req.body.commenterId = userId;
        (0, superstruct_1.assert)(req.body, structs_1.CreateProductComment);
        const { productId } = req.params;
        const productComment = await productCommentService_1.default.create({
            ...req.body,
            productId,
        });
        res.status(httpStatus_1.default.CREATED).send(productComment);
    }
    catch (err) {
        next(err);
    }
});
productController.patch("/:productId/comments/:commentId", passport_1.default.authenticate("access-token", { session: false }), auth_1.default.verifyProductCommentAuth, async (req, res, next) => {
    try {
        const { _productId, commentId } = req.params;
        const { id: userId } = req.user;
        req.body.commenterId = userId;
        (0, superstruct_1.assert)(req.body, structs_1.CreateProductComment);
        const productComment = await productCommentService_1.default.update(commentId, req.body);
        res.send(productComment);
    }
    catch (err) {
        next(err);
    }
});
productController.delete("/:productId/comments/:commentId", passport_1.default.authenticate("access-token", { session: false }), auth_1.default.verifyProductCommentAuth, async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const productComment = await productCommentService_1.default.deleteById(commentId);
        res.status(httpStatus_1.default.NO_CONTENT).send(productComment);
    }
    catch (err) {
        next(err);
    }
});
productController.patch("/:productId", passport_1.default.authenticate("access-token", { session: false }), auth_1.default.verifyProductAuth, async (req, res, next) => {
    try {
        (0, superstruct_1.assert)(req.body, structs_1.PatchProduct);
        const { productId } = req.params;
        const product = await productService_1.default.updateById(productId, req.body);
        res.send(product);
    }
    catch (err) {
        next(err);
    }
});
productController.get("/", async (req, res, next) => {
    try {
        const { page, pageSize, sort, keyword } = req.query;
        const result = await productService_1.default.getProducts({
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            sort: sort,
            keyword: keyword,
        });
        res.send(result);
    }
    catch (err) {
        next(err);
    }
});
productController.get("/:productId", passport_1.default.authenticate("access-token", { session: false }), async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { id: userId } = req.user;
        const product = await productService_1.default.getById(productId, userId);
        res.send(product);
    }
    catch (err) {
        next(err);
    }
});
productController.delete("/:productId", passport_1.default.authenticate("access-token", { session: false }), auth_1.default.verifyProductAuth, async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await productService_1.default.deleteById(productId);
        res.status(httpStatus_1.default.NO_CONTENT).send(product);
    }
    catch (err) {
        next(err);
    }
});
productController.post("/:productId/favorite", passport_1.default.authenticate("access-token", { session: false }), async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { id: userId } = req.user;
        const [favorite] = await productService_1.default.favorite(productId, userId);
        res.status(httpStatus_1.default.CREATED).send(favorite);
    }
    catch (err) {
        next(err);
    }
});
productController.delete("/:productId/favorite", passport_1.default.authenticate("access-token", { session: false }), async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { id: userId } = req.user;
        const [favorite] = await productService_1.default.unfavorite(productId, userId);
        res.status(httpStatus_1.default.NO_CONTENT).send(favorite);
    }
    catch (err) {
        next(err);
    }
});
exports.default = productController;
