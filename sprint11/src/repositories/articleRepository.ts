import prisma from "../config/prisma.ts";
import { Article, ArticleFavorite, Prisma } from "@prisma/client";

export interface IArticleRepository {
  getArticles: ({ skip, take, orderBy, where }: {
    skip: number;
    take: number;
    orderBy: {
      [key: string]: "asc" | "desc";
    };
    where: {
      OR: ({
        title: {
          contains: string;
        };
        content?: undefined;
      } | {
        content: {
          contains: string;
        };
        title?: undefined;
      })[];
    } | {
      OR?: undefined;
    };
  }) => Promise<{
    list: (Article & { author: { id: number; nickname: string | null; } | null })[];
    totalCount: number;
  }>;
  create: (
    data: Prisma.XOR<
      Prisma.ArticleCreateInput,
      Prisma.ArticleUncheckedCreateInput
    >,
  ) => Promise<Article>;
  updateById: (id: string, data: Article) => Promise<Article>;
  deleteById: (id: string) => Promise<Article>;
  getById: (
    id: string,
  ) => Promise<
    (Article & { author: { id: number; nickname: string | null } | null }) | null
  >;
  likeArticle: (
    articleId: string,
    userId: number,
  ) => Promise<[ArticleFavorite, Article]>;
  unlikeArticle: (
    articleId: string,
    userId: number,
  ) => Promise<[ArticleFavorite, Article]>;
  getArticleFavorite: (
    articleId: string,
    userId: number,
  ) => Promise<ArticleFavorite | null>;
}

class ArticleRepository implements IArticleRepository {
  async getArticles({ skip, take, orderBy, where }: {
    skip: number;
    take: number;
    orderBy: {
      [key: string]: "asc" | "desc";
    };
    where: {
      OR: ({
        title: {
          contains: string;
        };
        content?: undefined;
      } | {
        content: {
          contains: string;
        };
        title?: undefined;
      })[];
    } | {
      OR?: undefined;
    };
  }) {
    const list = await prisma.article.findMany({
      skip,
      take,
      orderBy,
      where,
      include: {
        author: {
          select: {
						id: true,
            nickname: true,
          },
        },
      },
    });
    const totalCount = await prisma.article.count({
      where,
    });
    return { list, totalCount };
  }

  create(
    data: Prisma.XOR<
      Prisma.ArticleCreateInput,
      Prisma.ArticleUncheckedCreateInput
    >,
  ) {
    return prisma.article.create({
      data,
    });
  }

  updateById(id: string, data: Partial<Article>) {
    return prisma.article.update({
      where: {
        id,
      },
      data,
    });
  }

  deleteById(id: string) {
    return prisma.article.delete({
      where: {
        id,
      },
    });
  }

  getById(
    id: string,
  ): Promise<
    | (Article & { author: { id: number; nickname: string | null } | null })
    | null
  > {
    return prisma.article.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });
  }

  async likeArticle(articleId: string, userId: number) {
    return await prisma.$transaction([
      prisma.articleFavorite.create({
        data: {
          articleId,
          userId,
        },
      }),
      prisma.article.update({
        where: {
          id: articleId,
        },
        data: {
          favoriteCount: {
            increment: 1,
          },
        },
      }),
    ]);
  }

  async unlikeArticle(articleId: string, userId: number) {
    return await prisma.$transaction([
      prisma.articleFavorite.delete({
        where: {
          userId_articleId: {
            userId,
            articleId,
          },
        },
      }),
      prisma.article.update({
        where: {
          id: articleId,
        },
        data: {
          favoriteCount: {
            decrement: 1,
          },
        },
      }),
    ]);
  }

  getArticleFavorite(articleId: string, userId: number) {
    return prisma.articleFavorite.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });
  }
}

const articleRepository = new ArticleRepository();

export default articleRepository;
