import { Prisma, Product } from "@prisma/client";
import productRepository from "../repositories/productRepository";

async function getProducts(
  { page = 1, pageSize = 10, sort = "recent", keyword = "" }: {
    page: number;
    pageSize: number;
    sort: string;
    keyword: string;
  },
) {
  if (page < 1) {
    page = 1;
  }
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const query = keyword
    ? {
      OR: [{
        name: { contains: keyword },
      }, {
        description: { contains: keyword },
      }],
    }
    : {};
  let orderBy;
  switch (sort) {
    case "favorite":
      orderBy = { favoriteCount: "desc" as const };
      break;
    case "oldest":
      orderBy = { createdAt: "asc" as const };
      break;
    case "recent":
    default:
      orderBy = { createdAt: "desc" as const };
  }

  const { products: list, totalCount } = await productRepository.getProducts({
    skip,
    take,
    orderBy,
    where: query,
  });

  return {
    list,
    totalCount,
  };
}

async function getById(id: string, userId: number) {
  const product = await productRepository.getById(id);
  if (!product) {
    throw new Error("Product not found");
  }
  const favorite = await productRepository.getProductFavorite(id, userId);
  return { ...product, isFavorite: favorite !== null };
}

async function updateById(id: string, product: Partial<Product>) {
  return await productRepository.updateById(id, product);
}

async function create(
  product: Prisma.XOR<
    Prisma.ProductCreateInput,
    Prisma.ProductUncheckedCreateInput
  >,
) {
  return await productRepository.save(product);
}

async function deleteById(id: string) {
  return await productRepository.deleteById(id);
}

async function favorite(productId: string, userId: number) {
  return await productRepository.likeProduct(productId, userId);
}

async function unfavorite(productId: string, userId: number) {
  return await productRepository.unlikeProduct(productId, userId);
}

export default {
  getProducts,
  getById,
  updateById,
  create,
  deleteById,
  favorite,
  unfavorite,
};
