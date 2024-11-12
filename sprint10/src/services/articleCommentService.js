import articleCommentRepository from '../repositories/articleCommentRepository.js';

async function findManyComments(articleId) {
	return await articleCommentRepository.findManyComments(articleId);
}

async function create(articleId, userId, content) {
	return await articleCommentRepository.create({
		data: {
			articleId,
			commenterId: userId,
			content,
		},
	});
}

async function updateById(id, data) {
	return await articleCommentRepository.update({
		where: {
			id,
		},
		data,
	});
}

export default {
	findManyComments,
	create,
	updateById,
};
