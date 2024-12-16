"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const articleService_js_1 = __importDefault(require("../services/articleService.js"));
const articleCommentService_js_1 = __importDefault(require("../services/articleCommentService.js"));
const auth_js_1 = __importDefault(require("../middlewares/auth.js"));
const passport_js_1 = __importDefault(require("../config/passport.js"));
const structs_js_1 = require("../structs.js");
const httpStatus_js_1 = __importDefault(require("../httpStatus.js"));
const superstruct_1 = require("superstruct");
const multer_1 = __importDefault(require("multer"));
const articleController = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
articleController.post("/", passport_js_1.default.authenticate('access-token', { session: false }), upload.array('images', 3), async (req, res, next) => {
    try {
        const { id: userId } = req.user;
        const data = {
            ...req.body,
            authorId: userId,
            images: req.files.map((file) => `/uploads/${file.filename}`),
        };
        // assert(data, CreateArticle);
        data.favoriteCount = 0;
        const article = await articleService_js_1.default.create(data);
        res.send(article);
    }
    catch (err) {
        next(err);
    }
});
articleController.post("/:articleId/comments", passport_js_1.default.authenticate('access-token', { session: false }), async (req, res, next) => {
    try {
        req.body.commenterId = req.user.id;
        (0, superstruct_1.assert)(req.body, structs_js_1.CreateArticleComment);
        const { articleId } = req.params;
        const articleComment = await articleCommentService_js_1.default.create(articleId, req.user.id, req.body.content);
        res.send(articleComment);
    }
    catch (err) {
        next(err);
    }
});
articleController.patch("/:articleId/comments/:commentId", passport_js_1.default.authenticate('access-token', { session: false }), auth_js_1.default.verifyArticleCommentAuth, async (req, res, next) => {
    try {
        req.body.commenterId = req.user.id;
        (0, superstruct_1.assert)(req.body, structs_js_1.CreateArticleComment);
        const { articleId, commentId } = req.params;
        const articleComment = await articleCommentService_js_1.default.updateById(commentId, {
            ...req.body,
            articleId,
        });
        res.send(articleComment);
    }
    catch (err) {
        next(err);
    }
});
articleController.delete("/:articleId/comments/:commentId", passport_js_1.default.authenticate('access-token', { session: false }), auth_js_1.default.verifyArticleCommentAuth, async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const articleComment = await articleCommentService_js_1.default.deleteById(commentId);
        res.status(httpStatus_js_1.default.NO_CONTENT).send(articleComment);
    }
    catch (err) {
        next(err);
    }
});
articleController.patch("/:articleId", passport_js_1.default.authenticate('access-token', { session: false }), auth_js_1.default.verifyArticleAuth, async (req, res, next) => {
    try {
        (0, superstruct_1.assert)(req.body, PatchArticle);
        const { articleId } = req.params;
        const article = await articleService_js_1.default.updateById(articleId, req.body);
        res.send(article);
    }
    catch (err) {
        next(err);
    }
});
articleController.get("/", async (req, res, next) => {
    try {
        const result = await articleService_js_1.default.getArticles(req.query);
        res.send(result);
    }
    catch (err) {
        next(err);
    }
});
articleController.get("/:articleId", passport_js_1.default.authenticate('access-token', { session: false }), async (req, res, next) => {
    try {
        const { articleId } = req.params;
        const article = await articleService_js_1.default.getById(articleId, req.user.id);
        if (!article) {
            return res.status(httpStatus_js_1.default.NOT_FOUND).send();
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
        const articleComments = await articleCommentService_js_1.default.findManyComments(articleId);
        if (!articleComments) {
            return res.status(httpStatus_js_1.default.NOT_FOUND).send();
        }
        res.send(articleComments);
    }
    catch (err) {
        next(err);
    }
});
articleController.delete("/:articleId", passport_js_1.default.authenticate('access-token', { session: false }), auth_js_1.default.verifyArticleAuth, async (req, res, next) => {
    try {
        const { articleId } = req.params;
        const article = await articleService_js_1.default.deleteArticle(articleId);
        res.status(httpStatus_js_1.default.NO_CONTENT).send(article);
    }
    catch (err) {
        next(err);
    }
});
articleController.post("/:articleId/favorite", passport_js_1.default.authenticate('access-token', { session: false }), async (req, res, next) => {
    try {
        const { articleId } = req.params;
        const { id: userId } = req.user;
        const [favorite] = await articleService_js_1.default.favorite(articleId, userId);
        res.send(favorite);
    }
    catch (err) {
        next(err);
    }
});
articleController.delete("/:articleId/favorite", passport_js_1.default.authenticate('access-token', { session: false }), async (req, res, next) => {
    try {
        const { articleId } = req.params;
        const { id: userId } = req.user;
        const [favorite] = await articleService_js_1.default.unfavorite(articleId, userId);
        if (!favorite) {
            return res.status(httpStatus_js_1.default.NO_CONTENT).send();
        }
        res.send(favorite);
    }
    catch (err) {
        next(err);
    }
});
exports.default = articleController;
