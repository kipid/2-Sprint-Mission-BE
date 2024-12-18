import { ArticleComment, Prisma } from "@prisma/client";
import prisma from "../config/prisma";

export interface IArticleCommentRepository {
  findManyComments(articleId: string): Promise<unknown[]>;
  getById(id: string): Promise<unknown>;
  create(
    { data }: {
      data:
        & Prisma.Without<
          Prisma.ArticleCommentCreateInput,
          Prisma.ArticleCommentUncheckedCreateInput
        >
        & Prisma.ArticleCommentUncheckedCreateInput;
    },
  ): Promise<ArticleComment>;
  updateById(
    id: string,
    data: Partial<ArticleComment>,
  ): Promise<ArticleComment>;
  deleteById(id: string): Promise<ArticleComment>;
}

class ArticleCommentRepository implements IArticleCommentRepository {
  async findManyComments(articleId: string) {
    return await prisma.articleComment.findMany({
      where: {
        articleId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        commenter: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });
  }

  async getById(id: string) {
    return await prisma.articleComment.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        commenter: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });
  }

  async create(
    { data }: {
      data:
        & Prisma.Without<
          Prisma.ArticleCommentCreateInput,
          Prisma.ArticleCommentUncheckedCreateInput
        >
        & Prisma.ArticleCommentUncheckedCreateInput;
    },
  ) {
    return await prisma.articleComment.create({
      data,
    });
  }

  updateById(id: string, data: Partial<ArticleComment>) {
    return prisma.articleComment.update({
      where: {
        id,
      },
      data,
    });
  }

  deleteById(id: string) {
    return prisma.articleComment.delete({
      where: {
        id,
      },
    });
  }
}

const articleCommentRepository = new ArticleCommentRepository();

export default articleCommentRepository;
