import prisma from "../config/prisma.js";

async function getProducts({ skip, take, orderBy, where }) {
  const products = await prisma.product.findMany({
    skip,
    take,
    orderBy,
    where
  });
  const totalCount = await prisma.product.count({
		where,
	});
  return { products, totalCount };
}

async function getById(id) {
  return await prisma.product.findUnique({
    where: {
      id: parseInt(id, 10),
    },
  });
}

async function save(product) {
  return await prisma.product.create({
    data: {
      name: product.name,
      description: product.description,
      price: parseInt(product.price, 10),
    },
  });
}

export default {
  getProducts,
  getById,
  save,
};
