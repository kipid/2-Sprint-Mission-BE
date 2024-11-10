import prisma from "../config/prisma.js";

async function getArticles({ skip, take, orderBy, where }) {
	const list = await prisma.article.findMany({
		skip,
		take,
		orderBy,
		where,
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
		}
	});
	const totalCount = await prisma.article.count({
		where,
	});
	return { list, totalCount };
}

async function create({ data }) {
	return await prisma.article.create({
		data,
	});
}

async function deleteById(id) {
	return await prisma.article.delete({
		where: {
			id,
		},
	});
}

async function getById(id) {
	return await prisma.article.findUnique({
		where: {
			id,
		},
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
}

export default {
	create,
	deleteById,
	getById,
};
