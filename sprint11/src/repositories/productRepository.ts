import prisma from "../config/prisma.ts";
import { Prisma, Product, ProductFavorite } from "@prisma/client";

export interface IProductRepository {
  getProducts(params: {
    skip: number;
    take: number;
    orderBy: {
      [key: string]: "asc" | "desc";
    };
    where: {
      OR: ({
        name: {
          contains: string;
        };
        description?: undefined;
      } | {
        description: {
          contains: string;
        };
        name?: undefined;
      })[];
    } | {
      OR?: undefined;
    };
  }): Promise<{
    products: (Product & { owner: { id: number; nickname: string | null; } })[];
    totalCount: number;
  }>;
  getById(
    id: string,
  ): Promise<
    Product & { owner: { id: number; nickname: string | null } } | null
  >;
  updateById(id: string, product: Partial<Product>): Promise<Product>;
  save(product: Product): Promise<Product>;
  deleteById(id: string): Promise<Product>;
  likeProduct(
    productId: string,
    userId: number,
  ): Promise<[ProductFavorite, Product]>;
  unlikeProduct(
    productId: string,
    userId: number,
  ): Promise<[ProductFavorite, Product]>;
  getProductFavorite(
    productId: string,
    userId: number,
  ): Promise<ProductFavorite | null>;
}

class ProductRepository implements IProductRepository {
  async getProducts({ skip, take, orderBy, where }: {
    skip: number;
    take: number;
    orderBy: {
      [key: string]: "asc" | "desc";
    };
    where: {
      OR: ({
        name: {
          contains: string;
        };
        description?: undefined;
      } | {
        description: {
          contains: string;
        };
        name?: undefined;
      })[];
    } | {
      OR?: undefined;
    };
  }): Promise<{ products: (Product & { owner: { id: number; nickname: string | null; } })[]; totalCount: number }> {
    const products = await prisma.product.findMany({
      skip,
      take,
      orderBy,
      where,
      include: {
        owner: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });
    const totalCount = await prisma.product.count({
      where,
    });
    return { products, totalCount };
  }

  getById(
    id: string,
  ): Promise<
    | (Product & { owner: { id: number; nickname: string | null } })
    | null
  > {
    return prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        owner: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });
  }

  updateById(id: string, product: Partial<Product>): Promise<Product> {
    return prisma.product.update({
      where: {
        id,
      },
      data: {
        ...product,
      },
    });
  }

  save(
    product: Prisma.XOR<
      Prisma.ProductCreateInput,
      Prisma.ProductUncheckedCreateInput
    >,
  ): Promise<Product> {
    return prisma.product.create({
      data: product,
    });
  }

  deleteById(id: string): Promise<Product> {
    return prisma.product.delete({
      where: {
        id,
      },
    });
  }

  likeProduct(
    productId: string,
    userId: number,
  ): Promise<[ProductFavorite, Product]> {
    return prisma.$transaction([
      prisma.productFavorite.create({
        data: {
          productId,
          userId,
        },
      }),
      prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          favoriteCount: {
            increment: 1,
          },
        },
      }),
    ]);
  }

  unlikeProduct(
    productId: string,
    userId: number,
  ): Promise<[ProductFavorite, Product]> {
    return prisma.$transaction([
      prisma.productFavorite.delete({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      }),
      prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          favoriteCount: {
            decrement: 1,
          },
        },
      }),
    ]);
  }

  getProductFavorite(
    productId: string,
    userId: number,
  ): Promise<ProductFavorite | null> {
    return prisma.productFavorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }
}

const productRepository = new ProductRepository();

export default productRepository;
