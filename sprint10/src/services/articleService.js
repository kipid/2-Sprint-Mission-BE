import articleRepository from '../repositories/articleRepository.js';

async function getArticles({ page = 1, pageSize = 12, sort = "recent", keyword = "" }) {
	page = parseInt(page);
	pageSize = parseInt(pageSize);

	if (page < 1) {
		page = 1;
	}
	const skip = (page - 1) * pageSize;
	const take = pageSize;

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

	const { list, totalCount } = await articleRepository.getArticles({ skip, take, orderBy, where: query });

	return {
		list,
		totalCount
	};
}

async function createArticle({ data }) {
	const article = await articleRepository.create({ data });
	return article;
}

async function deleteArticle(id) {
	return await articleRepository.deleteById(id);
}

async function findUnique(id) {
	return await articleRepository.getById(id);
}

export default {
	getArticles,
	createArticle,
	deleteArticle,
	findUnique,
};
