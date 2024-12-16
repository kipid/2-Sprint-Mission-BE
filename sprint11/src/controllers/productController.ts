import express from "express";

import productService from "../services/productService.ts";
import productCommentService from "../services/productCommentService.ts";
import {
  CreateProduct,
  CreateProductComment,
  PatchProduct,
} from "../structs.ts";
import { assert } from "superstruct";
import auth from "../middlewares/auth.ts";
import passport from "../config/passport.ts";
import HttpStatus from "../httpStatus.ts";
import { FilteredUser } from "../services/userService.ts";

const productController = express.Router();

productController.post(
  "/",
  passport.authenticate("access-token", { session: false }),
  async (req, res, next) => {
    try {
      const { id: userId } = req.user as FilteredUser;
      req.body.ownerId = userId;
      req.body.favoriteCount = 0;
      assert(req.body, CreateProduct);
      const createdProduct = await productService.create(req.body);
      res.json(createdProduct);
    } catch (err) {
      next(err);
    }
  },
);

productController.get(
  "/:productId",
  passport.authenticate("access-token", { session: false }),
  async (req, res, next) => {
    try {
      const { productId } = req.params;
      const { id: userId } = req.user as FilteredUser;
      const product = await productService.getById(productId, userId);
      res.json(product);
    } catch (err) {
      next(err);
    }
  },
);

productController.get("/:productId/comments", async (req, res, next) => {
  try {
    const { productId } = req.params;
    const products = await productCommentService.findManyComments(productId);
    res.json(products);
  } catch (err) {
    next(err);
  }
});

productController.post(
  "/:productId/comments",
  passport.authenticate("access-token", { session: false }),
  async (req, res, next) => {
    try {
      const { id: userId } = req.user as FilteredUser;
      req.body.commenterId = userId;
      assert(req.body, CreateProductComment);
      const { productId } = req.params;
      const productComment = await productCommentService.create({
        ...req.body,
        productId,
      });
      res.status(HttpStatus.CREATED).send(productComment);
    } catch (err) {
      next(err);
    }
  },
);

productController.patch(
  "/:productId/comments/:commentId",
  passport.authenticate("access-token", { session: false }),
  auth.verifyProductCommentAuth,
  async (req, res, next) => {
    try {
      const { _productId, commentId } = req.params;
      const { id: userId } = req.user as FilteredUser;
      req.body.commenterId = userId;
      assert(req.body, CreateProductComment);
      const productComment = await productCommentService.update(
        commentId,
        req.body,
      );
      res.send(productComment);
    } catch (err) {
      next(err);
    }
  },
);

productController.delete(
  "/:productId/comments/:commentId",
  passport.authenticate("access-token", { session: false }),
  auth.verifyProductCommentAuth,
  async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const productComment = await productCommentService.deleteById(commentId);
      res.status(HttpStatus.NO_CONTENT).send(productComment);
    } catch (err) {
      next(err);
    }
  },
);

productController.patch(
  "/:productId",
  passport.authenticate("access-token", { session: false }),
  auth.verifyProductAuth,
  async (req, res, next) => {
    try {
      assert(req.body, PatchProduct);
      const { productId } = req.params;
      const product = await productService.updateById(productId, req.body);
      res.send(product);
    } catch (err) {
      next(err);
    }
  },
);

productController.get("/", async (req, res, next) => {
  try {
    const { page, pageSize, sort, keyword } = req.query;
    const result = await productService.getProducts({
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

productController.get(
  "/:productId",
  passport.authenticate("access-token", { session: false }),
  async (req, res, next) => {
    try {
      const { productId } = req.params;
      const { id: userId } = req.user as FilteredUser;
      const product = await productService.getById(productId, userId);
      res.send(product);
    } catch (err) {
      next(err);
    }
  },
);

productController.delete(
  "/:productId",
  passport.authenticate("access-token", { session: false }),
  auth.verifyProductAuth,
  async (req, res, next) => {
    try {
      const { productId } = req.params;
      const product = await productService.deleteById(productId);
      res.status(HttpStatus.NO_CONTENT).send(product);
    } catch (err) {
      next(err);
    }
  },
);

productController.post(
  "/:productId/favorite",
  passport.authenticate("access-token", { session: false }),
  async (req, res, next) => {
    try {
      const { productId } = req.params;
      const { id: userId } = req.user as FilteredUser;
      const [favorite] = await productService.favorite(productId, userId);
      res.status(HttpStatus.CREATED).send(favorite);
    } catch (err) {
      next(err);
    }
  },
);

productController.delete(
  "/:productId/favorite",
  passport.authenticate("access-token", { session: false }),
  async (req, res, next) => {
    try {
      const { productId } = req.params;
      const { id: userId } = req.user as FilteredUser;
      const [favorite] = await productService.unfavorite(productId, userId);
      res.status(HttpStatus.NO_CONTENT).send(favorite);
    } catch (err) {
      next(err);
    }
  },
);

export default productController;
