import express from 'express';

import productService from '../services/productService.js';
import productCommentService from '../services/productCommentService.js';
import { CreateProduct, CreateProductComment, PatchProduct } from '../structs.js';
import { assert, create } from "superstruct";
import auth from '../middlewares/auth.js';
import passport from '../config/passport.js';
import HttpStatus from '../httpStatus.js';

const productController = express.Router();

productController.post('/',
passport.authenticate('access-token', { session: false }),
async (req, res, next) => {
	req.body.ownerId = req.user.id;
	assert(req.body, CreateProduct);
	const createdProduct = await productService.create(req.body);
	return res.json(createdProduct);
});

productController.get('/:productId',
passport.authenticate('access-token', { session: false }),
async (req, res) => {
  const { productId } = req.params;
  const product = await productService.getById(productId, req.user.id);
  return res.json(product);
});

productController.get('/:productId/comments',
async (req, res) => {
  const { productId } = req.params;
  const products = await productCommentService.findManyComments(productId);
  return res.json(products);
});

productController.post("/:productId/comments",
passport.authenticate('access-token', { session: false }),
async (req, res) => {
	req.body.commenterId = req.user.id;
	assert(req.body, CreateProductComment);
	const { productId } = req.params;
	const productComment = await productCommentService.create({
			...req.body,
			productId,
		});
	res.status(HttpStatus.CREATED).send(productComment);
});

productController.patch("/:productId/comments/:commentId",
passport.authenticate('access-token', { session: false }),
auth.verifyProductCommentAuth,
async (req, res) => {
	const { productId, commentId } = req.params;
	req.body.commenterId = req.user.id;
	assert(req.body, CreateProductComment);
	const productComment = await productCommentService.update(commentId, req.body);
	res.send(productComment);
});

productController.delete("/:productId/comments/:commentId",
passport.authenticate('access-token', { session: false }),
auth.verifyProductCommentAuth,
async (req, res) => {
	const { commentId } = req.params;
	const productComment = await productCommentService.deleteById(commentId);
	res.status(HttpStatus.NO_CONTENT).send(productComment);
});

productController.patch("/:productId",
passport.authenticate('access-token', { session: false }),
auth.verifyProductAuth,
async (req, res) => {
	assert(req.body, PatchProduct);
	const { productId } = req.params;
	const product = await productService.update({
		where: { productId },
		data: req.body,
	});
	res.send(product);
});

productController.get("/", async (req, res) => {
	const result = await productService.getProducts(req.query);
	res.send(result);
});

productController.get("/:productId",
passport.authenticate('access-token', { session: false }),
async (req, res) => {
	const { productId } = req.params;
	const product = await productService.getById(productId, req.user.id);
	res.send(product);
});

productController.delete("/:productId",
passport.authenticate('access-token', { session: false }),
auth.verifyProductAuth,
async (req, res) => {
const { productId } = req.params;
	const product = await productService.deleteById(productId);
	res.status(HttpStatus.NO_CONTENT).send(product);
});

productController.post('/:productId/favorite',
passport.authenticate('access-token', { session: false }),
async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;
  const [favorite] = await productService.favorite(productId, userId);
  res.status(HttpStatus.CREATED).send(favorite);
});

productController.delete('/:productId/favorite',
passport.authenticate('access-token', { session: false }),
async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;
  const [favorite] = await productService.unfavorite(productId, userId);
  res.status(HttpStatus.NO_CONTENT).send(favorite);
});

export default productController;
