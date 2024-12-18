import { Article, Prisma } from "@prisma/client";
import articleRepository from "../repositories/articleRepository";
import { CustomError } from "../types/types";
import HttpStatus from "../httpStatus";

async function getArticles(
  { page = 1, pageSize = 12, sort = "recent", keyword = "" }: {
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
        title: { contains: keyword as string },
      }, {
        content: { contains: keyword as string },
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

  const { list, totalCount } = await articleRepository.getArticles({
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

async function create(
  data: Prisma.XOR<
    Prisma.ArticleCreateInput,
    Prisma.ArticleUncheckedCreateInput
  >,
) {
  return await articleRepository.create(data);
}

async function updateById(id: string, data: Partial<Article>) {
  return await articleRepository.updateById(id, data);
}

async function deleteById(id: string) {
  return await articleRepository.deleteById(id);
}

async function getById(id: string, userId: number) {
  const article = await articleRepository.getById(id);
  if (!article) {
    throw new CustomError("Article not found", HttpStatus.NOT_FOUND);
  }
  const favorite = await articleRepository.getArticleFavorite(id, userId);
  return { ...article, isFavorite: favorite !== null };
}

async function favorite(articleId: string, userId: number) {
  return await articleRepository.likeArticle(articleId, userId);
}

async function unfavorite(articleId: string, userId: number) {
  return await articleRepository.unlikeArticle(articleId, userId);
}

export default {
  getArticles,
  create,
  updateById,
  deleteById,
  getById,
  favorite,
  unfavorite,
};
