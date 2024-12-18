import { Prisma, ProductComment } from "@prisma/client";
import prisma from "../config/prisma";

export interface IProductCommentRepository {
  create: (
    data: Prisma.XOR<
      Prisma.ProductCommentCreateInput,
      Prisma.ProductCommentUncheckedCreateInput
    >,
  ) => Promise<unknown>;
  getById: (id: string) => Promise<ProductComment | null>;
  updateById: (
    id: string,
    data: Partial<ProductComment>,
  ) => Promise<ProductComment>;
  deleteById: (id: string) => Promise<ProductComment>;
  findManyComments: (productId: string) => Promise<unknown[]>;
}

class ProductCommentRepository implements IProductCommentRepository {
  create(
    data: Prisma.XOR<
      Prisma.ProductCommentCreateInput,
      Prisma.ProductCommentUncheckedCreateInput
    >,
  ) {
    return prisma.productComment.create({
      data,
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

  getById(id: string) {
    return prisma.productComment.findUnique({
      where: {
        id,
      },
    });
  }

  updateById(id: string, data: Partial<ProductComment>) {
    return prisma.productComment.update({
      where: {
        id,
      },
      data,
    });
  }

  deleteById(id: string) {
    return prisma.productComment.delete({
      where: {
        id,
      },
    });
  }

  findManyComments(productId: string) {
    return prisma.productComment.findMany({
      where: {
        productId,
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
}

const productCommentRepository = new ProductCommentRepository();

export default productCommentRepository;
