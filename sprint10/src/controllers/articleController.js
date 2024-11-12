import express from 'express';

import articleService from '../services/articleService.js';
import articleCommentService from '../services/articleCommentService.js';
import auth from '../middlewares/auth.js';
import passport from '../config/passport.js';
import { CreateArticle, CreateArticleComment } from '../structs.js';
import HttpStatus from '../httpStatus.js';
import { assert } from 'superstruct';

const articleController = express.Router();

articleController.post("/",
passport.authenticate('access-token', { session: false }),
async (req, res) => {
	const { id: userId } = req.user;
	const data = {
		...req.body,
		authorId: userId,
	};
	assert(data, CreateArticle);
	const article = await articleService.create(data);
	res.send(article);
});

articleController.post("/:articleId/comments",
passport.authenticate('access-token', { session: false }),
async (req, res) => {
	req.body.commenterId = req.user.id;
	assert(req.body, CreateArticleComment);
	const { articleId } = req.params;
	const articleComment = await articleCommentService.create(articleId, req.user.id, req.body.content);
	res.send(articleComment);
});

articleController.patch("/:articleId/comments/:commentId",
passport.authenticate('access-token', { session: false }),
auth.verifyArticleCommentAuth,
async (req, res) => {
	req.body.commenterId = req.user.id;
	assert(req.body, CreateArticleComment);
	const { articleId, commentId } = req.params;
	const articleComment = await articleCommentService.update(commentId, {
			...req.body,
			articleId,
		});
	res.send(articleComment);
});

articleController.delete("/:articleId/comments/:commentId",
passport.authenticate('access-token', { session: false }),
auth.verifyArticleCommentAuth,
async (req, res) => {
	const { commentId } = req.params;
	const articleComment = await articleCommentService.delete({
		where: { id: commentId },
	});
	res.status(HttpStatus.NO_CONTENT).send(articleComment);
});

articleController.patch("/:articleId",
passport.authenticate('access-token', { session: false }),
auth.verifyArticleAuth,
async (req, res) => {
	assert(req.body, PatchArticle);
	const { articleId } = req.params;
	const article = await articleService.updateById(articleId, req.body);
	res.send(article);
});

articleController.get("/", async (req, res) => {
	const result = await articleService.getArticles(req.query);
	res.send(result);
});

articleController.get("/:articleId",
passport.authenticate('access-token', { session: false }),
async (req, res) => {
	const { articleId } = req.params;
	const article = await articleService.getById(articleId, req.user.id);
	if (!article) {
		return res.status(HttpStatus.NOT_FOUND).send();
	}
	res.send(article);
});

articleController.get("/:articleId/comments", async (req, res) => {
	const { articleId } = req.params;
	const articleComments = await articleCommentService.findManyComments(articleId);
	if (!articleComments) {
		return res.status(HttpStatus.NOT_FOUND).send();
	}
	res.send(articleComments);
});

articleController.delete("/:articleId",
passport.authenticate('access-token', { session: false }),
auth.verifyArticleAuth,
async (req, res) => {
const { articleId } = req.params;
	const article = await articleService.deleteArticle(articleId);
	res.status(HttpStatus.NO_CONTENT).send(article);
});

articleController.post("/:articleId/favorite",
passport.authenticate('access-token', { session: false }),
async (req, res) => {
  const { articleId } = req.params;
  const { id: userId } = req.user;
  const [favorite] = await articleService.favorite(articleId, userId);
  res.send(favorite);
});

articleController.delete("/:articleId/favorite",
passport.authenticate('access-token', { session: false }),
async (req, res) => {
  const { articleId } = req.params;
  const { id: userId } = req.user;
  const [favorite] = await articleService.unfavorite(articleId, userId);
	if (!favorite) {
		return res.status(HttpStatus.NO_CONTENT).send();
	}
  res.send(favorite);
});

export default articleController;
