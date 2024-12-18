"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const articleService_1 = __importDefault(require("../services/articleService"));
const articleCommentService_1 = __importDefault(require("../services/articleCommentService"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const passport_1 = __importDefault(require("../config/passport"));
const structs_1 = require("../structs");
const httpStatus_1 = __importDefault(require("../httpStatus"));
const superstruct_1 = require("superstruct");
const multer_1 = __importDefault(require("multer"));
const structs_2 = require("../structs");
const articleController = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, "uploads/");
    },
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
articleController.post("/", passport_1.default.authenticate("access-token", { session: false }), upload.array("images", 3), async (req, res, next) => {
    try {
        const { id: userId } = req.user;
        const files = req.files;
        const data = {
            ...req.body,
            authorId: userId,
            images: files.map((file) => `/uploads/${file.filename}`),
        };
        data.favoriteCount = 0;
        (0, superstruct_1.assert)(data, structs_2.CreateArticle);
        const article = await articleService_1.default.create(data);
        res.send(article);
    }
    catch (err) {
        next(err);
    }
});
articleController.post("/:articleId/comments", passport_1.default.authenticate("access-token", { session: false }), async (req, res, next) => {
    try {
        const { id: userId } = req.user;
        req.body.commenterId = userId;
        (0, superstruct_1.assert)(req.body, structs_1.CreateArticleComment);
        const body = req.body;
        const { articleId } = req.params;
        const articleComment = await articleCommentService_1.default.create(articleId, userId, body.content);
        res.send(articleComment);
    }
    catch (err) {
        next(err);
    }
});
articleController.patch("/:articleId/comments/:commentId", passport_1.default.authenticate("access-token", { session: false }), auth_1.default.verifyArticleCommentAuth, async (req, res, next) => {
    try {
        const { id: userId } = req.user;
        req.body.commenterId = userId;
        (0, superstruct_1.assert)(req.body, structs_1.CreateArticleComment);
        const body = req.body;
        const { articleId, commentId } = req.params;
        const articleComment = await articleCommentService_1.default.updateById(commentId, {
            ...body,
            articleId,
        });
        res.send(articleComment);
    }
    catch (err) {
        next(err);
    }
});
articleController.delete("/:articleId/comments/:commentId", passport_1.default.authenticate("access-token", { session: false }), auth_1.default.verifyArticleCommentAuth, async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const articleComment = await articleCommentService_1.default.deleteById(commentId);
        res.status(httpStatus_1.default.NO_CONTENT).send(articleComment);
    }
    catch (err) {
        next(err);
    }
});
articleController.patch("/:articleId", passport_1.default.authenticate("access-token", { session: false }), auth_1.default.verifyArticleAuth, async (req, res, next) => {
    try {
        (0, superstruct_1.assert)(req.body, structs_1.PatchArticle);
        const { articleId } = req.params;
        const article = await articleService_1.default.updateById(articleId, req.body);
        res.send(article);
    }
    catch (err) {
        next(err);
    }
});
articleController.get("/", async (req, res, next) => {
    try {
        const { page, pageSize, sort, keyword } = req.query;
        const result = await articleService_1.default.getArticles({
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
articleController.get("/:articleId", passport_1.default.authenticate("access-token", { session: false }), async (req, res, next) => {
    try {
        const { articleId } = req.params;
        const { id: userId } = req.user;
        const article = await articleService_1.default.getById(articleId, userId);
        if (!article) {
            res.status(httpStatus_1.default.NOT_FOUND).send();
            return;
        }
        res.send(article);
    }
    catch (err) {
        next(err);
    }
});
articleController.get("/:articleId/comments", async (req, res, next) => {
    try {
        const { articleId } = req.params;
        const articleComments = await articleCommentService_1.default.findManyComments(articleId);
        if (!articleComments) {
            res.status(httpStatus_1.default.NOT_FOUND).send();
            return;
        }
        res.send(articleComments);
    }
    catch (err) {
        next(err);
    }
});
articleController.delete("/:articleId", passport_1.default.authenticate("access-token", { session: false }), auth_1.default.verifyArticleAuth, async (req, res, next) => {
    try {
        const { articleId } = req.params;
        const article = await articleService_1.default.deleteById(articleId);
        res.status(httpStatus_1.default.NO_CONTENT).send(article);
    }
    catch (err) {
        next(err);
    }
});
articleController.post("/:articleId/favorite", passport_1.default.authenticate("access-token", { session: false }), async (req, res, next) => {
    try {
        const { articleId } = req.params;
        const { id: userId } = req.user;
        const [favorite] = await articleService_1.default.favorite(articleId, userId);
        res.send(favorite);
    }
    catch (err) {
        next(err);
    }
});
articleController.delete("/:articleId/favorite", passport_1.default.authenticate("access-token", { session: false }), async (req, res, next) => {
    try {
        const { articleId } = req.params;
        const { id: userId } = req.user;
        const [favorite] = await articleService_1.default.unfavorite(articleId, userId);
        if (!favorite) {
            res.status(httpStatus_1.default.NO_CONTENT).send();
            return;
        }
        res.send(favorite);
    }
    catch (err) {
        next(err);
    }
});
exports.default = articleController;
