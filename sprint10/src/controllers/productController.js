import express from 'express';

import productService from '../services/productService.js';
import auth from '../middlewares/auth.js';

const productController = express.Router();

productController.post('/',
  auth.passportAuthenticateSession,
  // auth.verifySessionLogin,
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

app.post("/products", async (req, res) => {
	assert(req.body, CreateProduct);
	const product = await prisma.product.create({
		data: req.body,
	});
	res.send(product);
});

app.post("/products/:id/comment", async (req, res) => {
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

app.patch("/products/:productId/comment/:commentId", async (req, res) => {
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

app.delete("/products/:productId/comment/:commentId", async (req, res) => {
	const { commentId } = req.params;
	const productComment = await prisma.productComment.delete({
		where: { id: commentId },
	});
	res.status(HttpStatus.NO_CONTENT).send(productComment);
});

app.patch("/products/:id", async (req, res) => {
	assert(req.body, PatchProduct);
	const { id } = req.params;
	const product = await prisma.product.update({
		where: { id },
		data: req.body,
	});
	res.send(product);
});

app.get("/products", async (req, res) => {
	const { skip = 0, take = 10, sort = "recent", keyword = "" } = req.query;
	const query = keyword ? {
		OR: [{
				name: { contains: keyword }
			},
			{
				description: { contains: keyword }
			}]
		}
	: {};
	let orderBy;
	switch (sort) {
		case "favorite":
			orderBy = { favoriteCount: "desc" };
			break;
		case "oldest":
			orderBy = { createdAt: "asc" };
			break;
		case "recent":
		default:
			orderBy = { createdAt: "desc" };
	}
	const totalCount = await prisma.product.count({
		where: query,
	});
	const products = await prisma.product.findMany({
		where: query,
		orderBy,
		skip: parseInt(skip),
		take: parseInt(take),
	});
	res.send({ list: products, totalCount });
});

app.get("/products/:id", async (req, res) => {
	const { id } = req.params;
	const product = await prisma.product.findUniqueOrThrow({
		where: { id },
	});
	res.send(product);
});

app.delete("/products/:id", async (req, res) => {
const { id } = req.params;
	const product = await prisma.product.delete({
		where: { id },
	});
	res.status(HttpStatus.NO_CONTENT).send(product);
});

export default productController;
