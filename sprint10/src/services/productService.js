import productRepository from '../repositories/productRepository.js';

async function getProducts({ page = 1, pageSize = 10, sort = "recent", keyword = "" }) {
  page = parseInt(page);
  pageSize = parseInt(pageSize);

  if (page < 1) {
    page = 1;
  }
  const skip = (page - 1) * pageSize;
  const take = pageSize;

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

  const { products: list, totalCount } = await productRepository.getProducts({ skip, take, orderBy, where: query });

  return {
    list,
    totalCount
  };
}

async function getById(id) {
  return await productRepository.getById(id);
}

async function create(product) {
  return await productRepository.save(product);
}

export default {
  getProducts,
  getById,
  create,
};
