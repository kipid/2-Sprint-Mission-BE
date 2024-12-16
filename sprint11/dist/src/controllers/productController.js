"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productService_js_1 = __importDefault(require("../services/productService.js"));
const productCommentService_js_1 = __importDefault(require("../services/productCommentService.js"));
const structs_js_1 = require("../structs.js");
const superstruct_1 = require("superstruct");
const auth_js_1 = __importDefault(require("../middlewares/auth.js"));
const passport_js_1 = __importDefault(require("../config/passport.js"));
const httpStatus_js_1 = __importDefault(require("../httpStatus.js"));
const productController = express_1.default.Router();
productController.post('/', passport_js_1.default.authenticate('access-token', { session: false }), async (req, res, next) => {
    try {
        req.body.ownerId = req.user.id;
        (0, superstruct_1.assert)(req.body, structs_js_1.CreateProduct);
        req.body.favoriteCount = 0;
        const createdProduct = await productService_js_1.default.create(req.body);
        return res.json(createdProduct);
    }
    catch (err) {
        next(err);
    }
});
productController.get('/:productId', passport_js_1.default.authenticate('access-token', { session: false }), async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await productService_js_1.default.getById(productId, req.user.id);
        return res.json(product);
    }
    catch (err) {
        next(err);
    }
});
productController.get('/:productId/comments', async (req, res, next) => {
    try {
        const { productId } = req.params;
        const products = await productCommentService_js_1.default.findManyComments(productId);
        return res.json(products);
    }
    catch (err) {
        next(err);
    }
});
productController.post("/:productId/comments", passport_js_1.default.authenticate('access-token', { session: false }), async (req, res, next) => {
    try {
        req.body.commenterId = req.user.id;
        (0, superstruct_1.assert)(req.body, structs_js_1.CreateProductComment);
        const { productId } = req.params;
        const productComment = await productCommentService_js_1.default.create({
            ...req.body,
            productId,
        });
        res.status(httpStatus_js_1.default.CREATED).send(productComment);
    }
    catch (err) {
        next(err);
    }
});
productController.patch("/:productId/comments/:commentId", passport_js_1.default.authenticate('access-token', { session: false }), auth_js_1.default.verifyProductCommentAuth, async (req, res, next) => {
    try {
        const { productId, commentId } = req.params;
        req.body.commenterId = req.user.id;
        (0, superstruct_1.assert)(req.body, structs_js_1.CreateProductComment);
        const productComment = await productCommentService_js_1.default.update(commentId, req.body);
        res.send(productComment);
    }
    catch (err) {
        next(err);
    }
});
productController.delete("/:productId/comments/:commentId", passport_js_1.default.authenticate('access-token', { session: false }), auth_js_1.default.verifyProductCommentAuth, async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const productComment = await productCommentService_js_1.default.deleteById(commentId);
        res.status(httpStatus_js_1.default.NO_CONTENT).send(productComment);
    }
    catch (err) {
        next(err);
    }
});
productController.patch("/:productId", passport_js_1.default.authenticate('access-token', { session: false }), auth_js_1.default.verifyProductAuth, async (req, res, next) => {
    try {
        (0, superstruct_1.assert)(req.body, structs_js_1.PatchProduct);
        const { productId } = req.params;
        const product = await productService_js_1.default.updateById(productId, req.body);
        res.send(product);
    }
    catch (err) {
        next(err);
    }
});
productController.get("/", async (req, res, next) => {
    try {
        const result = await productService_js_1.default.getProducts(req.query);
        res.send(result);
    }
    catch (err) {
        next(err);
    }
});
productController.get("/:productId", passport_js_1.default.authenticate('access-token', { session: false }), async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await productService_js_1.default.getById(productId, req.user.id);
        res.send(product);
    }
    catch (err) {
        next(err);
    }
});
productController.delete("/:productId", passport_js_1.default.authenticate('access-token', { session: false }), auth_js_1.default.verifyProductAuth, async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await productService_js_1.default.deleteById(productId);
        res.status(httpStatus_js_1.default.NO_CONTENT).send(product);
    }
    catch (err) {
        next(err);
    }
});
productController.post('/:productId/favorite', passport_js_1.default.authenticate('access-token', { session: false }), async (req, res, next) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;
        const [favorite] = await productService_js_1.default.favorite(productId, userId);
        res.status(httpStatus_js_1.default.CREATED).send(favorite);
    }
    catch (err) {
        next(err);
    }
});
productController.delete('/:productId/favorite', passport_js_1.default.authenticate('access-token', { session: false }), async (req, res, next) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;
        const [favorite] = await productService_js_1.default.unfavorite(productId, userId);
        res.status(httpStatus_js_1.default.NO_CONTENT).send(favorite);
    }
    catch (err) {
        next(err);
    }
});
exports.default = productController;
