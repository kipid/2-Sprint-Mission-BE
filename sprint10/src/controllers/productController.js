import express from 'express';

import productService from '../services/productService.js';
import auth from '../middlewares/auth.js';
import passport from '../config/passport.js';

const productController = express.Router();

productController.post('/',
  passport.authenticate('access-token', { session: false }),
  async (req, res, next) => {
  const createdProduct = await productService.create(req.body);
  return res.json(createdProduct);
});

productController.get('/:id', async (req, res) => {
  const { id } = req.params;
  const product = await productService.getById(id);
  return res.json(product);
});

/////////////////////////////////////////////////////
// Products
/////////////////////////////////////////////////////

productController.post("/", async (req, res) => {
	assert(req.body, CreateProduct);
	const product = await prisma.product.create({
		data: req.body,
	});
	res.send(product);
});

productController.post("/:id/comment", async (req, res) => {
	assert(req.body, CreateProductComment);
	const { id: productId } = req.params;
	const productComment = await prisma.productComment.create({
		data: {
			...req.body,
			productId,
		},
		select: {
			id: true,
			content: true,
			commenter: {
				select: {
					nickname: true,
				},
			},
			product: {
				select: {
					name: true,
					description: true,
					price: true,
					tags: true,
					images: true,
					favoriteCount: true,
					createdAt: true,
					updatedAt: true,
				}
			}
		},
	});
	res.send(productComment);
});

productController.patch("/:productId/comment/:commentId", async (req, res) => {
	assert(req.body, CreateProductComment);
	const { productId, commentId } = req.params;
	const productComment = await prisma.productComment.update({
		where: { id: commentId },
		data: {
			...req.body,
			productId,
		},
		select: {
			id: true,
			content: true,
			commenter: {
				select: {
					nickname: true,
				},
			},
			// product: {
			// 	select: {
			// 		id: true,
			// 		name: true,
			// 		description: true,
			// 		price: true,
			// 		tags: true,
			// 		images: true,
			// 		favoriteCount: true,
			// 		createdAt: true,
			// 		updatedAt: true,
			// 	}
			// },
		},
	});
	res.send(productComment);
});

productController.delete("/:productId/comment/:commentId", async (req, res) => {
	const { commentId } = req.params;
	const productComment = await prisma.productComment.delete({
		where: { id: commentId },
	});
	res.status(HttpStatus.NO_CONTENT).send(productComment);
});

productController.patch("/:id", async (req, res) => {
	assert(req.body, PatchProduct);
	const { id } = req.params;
	const product = await prisma.product.update({
		where: { id },
		data: req.body,
	});
	res.send(product);
});

productController.get("/", async (req, res) => {
	const result = await productService.getProducts(req.query);
	res.send(result);
});

productController.get("/:id", async (req, res) => {
	const { id } = req.params;
	const product = await prisma.product.findUniqueOrThrow({
		where: { id },
	});
	res.send(product);
});

productController.delete("/:id", async (req, res) => {
const { id } = req.params;
	const product = await prisma.product.delete({
		where: { id },
	});
	res.status(HttpStatus.NO_CONTENT).send(product);
});

export default productController;
