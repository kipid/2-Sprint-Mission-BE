import express from "express";

import articleService from "../services/articleService.ts";
import articleCommentService from "../services/articleCommentService.ts";
import auth from "../middlewares/auth.ts";
import passport from "../config/passport.ts";
import { CreateArticleComment, PatchArticle } from "../structs.ts";
import HttpStatus from "../httpStatus.ts";
import { assert } from "superstruct";
import multer from "multer";
import { FilteredUser } from "../services/userService.ts";
import { CreateArticle } from "../structs.ts";

const articleController = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

articleController.post(
  "/",
  passport.authenticate("access-token", { session: false }),
  upload.array("images", 3),
  async (req, res, next) => {
    try {
      const { id: userId } = req.user as FilteredUser;
      const files = req.files as Express.Multer.File[];
      const data = {
        ...req.body,
        authorId: userId,
        images: files.map((file) => `/uploads/${file.filename}`),
      };
      data.favoriteCount = 0;
      assert(data, CreateArticle);
      const article = await articleService.create(data);
      res.send(article);
    } catch (err) {
      next(err);
    }
  },
);

articleController.post(
  "/:articleId/comments",
  passport.authenticate("access-token", { session: false }),
  async (req, res, next) => {
    try {
      const { id: userId } = req.user as FilteredUser;
      req.body.commenterId = userId;
      assert(req.body, CreateArticleComment);
      const body = req.body;
      const { articleId } = req.params;
      const articleComment = await articleCommentService.create(
        articleId,
        userId,
        body.content,
      );
      res.send(articleComment);
    } catch (err) {
      next(err);
    }
  },
);

articleController.patch(
  "/:articleId/comments/:commentId",
  passport.authenticate("access-token", { session: false }),
  auth.verifyArticleCommentAuth,
  async (req, res, next) => {
    try {
      const { id: userId } = req.user as FilteredUser;
      req.body.commenterId = userId;
      assert(req.body, CreateArticleComment);
      const body = req.body;
      const { articleId, commentId } = req.params;
      const articleComment = await articleCommentService.updateById(commentId, {
        ...body,
        articleId,
      });
      res.send(articleComment);
    } catch (err) {
      next(err);
    }
  },
);

articleController.delete(
  "/:articleId/comments/:commentId",
  passport.authenticate("access-token", { session: false }),
  auth.verifyArticleCommentAuth,
  async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const articleComment = await articleCommentService.deleteById(commentId);
      res.status(HttpStatus.NO_CONTENT).send(articleComment);
    } catch (err) {
      next(err);
    }
  },
);

articleController.patch(
  "/:articleId",
  passport.authenticate("access-token", { session: false }),
  auth.verifyArticleAuth,
  async (req, res, next) => {
    try {
      assert(req.body, PatchArticle);
      const { articleId } = req.params;
      const article = await articleService.updateById(articleId, req.body);
      res.send(article);
    } catch (err) {
      next(err);
    }
  },
);

articleController.get("/", async (req, res, next) => {
  try {
    const { page, pageSize, sort, keyword } = req.query;
    const result = await articleService.getArticles({
      page: parseInt(page as string),
      pageSize: parseInt(pageSize as string),
      sort: sort as string,
      keyword: keyword as string,
    });
    res.send(result);
  } catch (err) {
    next(err);
  }
});

articleController.get(
  "/:articleId",
  passport.authenticate("access-token", { session: false }),
  async (req, res, next) => {
    try {
      const { articleId } = req.params;
      const { id: userId } = req.user as FilteredUser;
      const article = await articleService.getById(articleId, userId);
      if (!article) {
        res.status(HttpStatus.NOT_FOUND).send();
        return;
      }
      res.send(article);
    } catch (err) {
      next(err);
    }
  },
);

articleController.get("/:articleId/comments", async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const articleComments = await articleCommentService.findManyComments(
      articleId,
    );
    if (!articleComments) {
      res.status(HttpStatus.NOT_FOUND).send();
      return;
    }
    res.send(articleComments);
  } catch (err) {
    next(err);
  }
});

articleController.delete(
  "/:articleId",
  passport.authenticate("access-token", { session: false }),
  auth.verifyArticleAuth,
  async (req, res, next) => {
    try {
      const { articleId } = req.params;
      const article = await articleService.deleteById(articleId);
      res.status(HttpStatus.NO_CONTENT).send(article);
    } catch (err) {
      next(err);
    }
  },
);

articleController.post(
  "/:articleId/favorite",
  passport.authenticate("access-token", { session: false }),
  async (req, res, next) => {
    try {
      const { articleId } = req.params;
      const { id: userId } = req.user as FilteredUser;
      const [favorite] = await articleService.favorite(articleId, userId);
      res.send(favorite);
    } catch (err) {
      next(err);
    }
  },
);

articleController.delete(
  "/:articleId/favorite",
  passport.authenticate("access-token", { session: false }),
  async (req, res, next) => {
    try {
      const { articleId } = req.params;
      const { id: userId } = req.user as FilteredUser;
      const [favorite] = await articleService.unfavorite(articleId, userId);
      if (!favorite) {
        res.status(HttpStatus.NO_CONTENT).send();
        return;
      }
      res.send(favorite);
    } catch (err) {
      next(err);
    }
  },
);

export default articleController;
