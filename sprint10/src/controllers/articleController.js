import express from 'express';

import articleService from '../services/articleService.js';
import auth from '../middlewares/auth.js';

const articleController = express.Router();

articleController.post("/", async (req, res) => {
	assert(req.body, CreateArticle);
	const article = await prisma.article.create({
		data: req.body,
	});
	res.send(article);
});

articleController.post("/:id/comment", async (req, res) => {
	assert(req.body, CreateArticleComment);
	const { id: articleId } = req.params;
	const articleComment = await prisma.articleComment.create({
		data: {
			...req.body,
			articleId,
		},
		select: {
			id: true,
			content: true,
			createdAt: true,
			updatedAt: true,
			commenter: {
				select: {
					nickname: true,
				},
			},
			article: {
				select: {
					id: true,
					author: {
						select: {
							nickname: true,
						},
					},
					title: true,
					content: true,
					createdAt: true,
					updatedAt: true,
				}
			}
		},
	});
	res.send(articleComment);
});

articleController.patch("/:articleId/comment/:commentId", async (req, res) => {
	assert(req.body, CreateArticleComment);
	const { articleId, commentId } = req.params;
	const articleComment = await prisma.articleComment.update({
		where: { id: commentId },
		data: {
			...req.body,
			articleId,
		},
		select: {
			id: true,
			content: true,
			createdAt: true,
			updatedAt: true,
			commenter: {
				select: {
					nickname: true,
				},
			},
			// article: {
			// 	select: {
			// 		id: true,
			// 		author: {
			// 			select: {
			// 				nickname: true,
			// 			},
			// 		},
			// 		title: true,
			// 		content: true,
			// 		createdAt: true,
			// 		updatedAt: true,
			// 	}
			// },
		},
	});
	res.send(articleComment);
});

articleController.delete("/:articleId/comment/:commentId", async (req, res) => {
	const { commentId } = req.params;
	const articleComment = await prisma.articleComment.delete({
		where: { id: commentId },
	});
	res.status(HttpStatus.NO_CONTENT).send(articleComment);
});

articleController.patch("/:id", async (req, res) => {
	assert(req.body, PatchArticle);
	const { id } = req.params;
	const article = await prisma.article.update({
		where: { id },
		data: req.body,
	});
	res.send(article);
});

articleController.get("/", async (req, res) => {
	const { offset = 0, limit = 12, sort = "recent", keyword = "" } = req.query;
	const query = keyword ? {
		OR: [{
				title: { contains: keyword }
			},
			{
				content: { contains: keyword }
			}]
		}
	: {};
	let orderBy;
	switch (orderBy) {
		case "oldest":
			orderBy = { createdAt: "asc" };
			break;
		case "recent":
		default:
			orderBy = { createdAt: "desc" };
	}
	const totalCount = await prisma.article.count({
		where: query,
	});
	const articles = await prisma.article.findMany({
		where: query,
		orderBy,
		skip: parseInt(offset),
		take: parseInt(limit),
	});
	res.send({ list: articles, totalCount });
});

articleController.get("/:id", async (req, res) => {
	const { id } = req.params;
	const article = await prisma.article.findUniqueOrThrow({
		where: { id },
		select: {
			id: true,
			author: {
				select: {
					nickname: true,
				}
			},
			title: true,
			content: true,
			createdAt: true,
			updatedAt: true,
			articleComments: {
				orderBy: { createdAt: "desc" },
				select: {
					content: true,
					commenter: {
						select: {
							nickname: true,
						}
					},
					createdAt: true,
					updatedAt: true,
				}
			}
		}
	});
	res.send(article);
});

articleController.delete("/:id", async (req, res) => {
const { id } = req.params;
	const article = await prisma.article.delete({
		where: { id },
	});
	res.status(HttpStatus.NO_CONTENT).send(article);
});

export default articleController;
