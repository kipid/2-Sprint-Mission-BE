import { Prisma, ProductComment } from "@prisma/client";
import productCommentRepository from "../repositories/productCommentRepository";

async function create(
  data: Prisma.XOR<
    Prisma.ProductCommentCreateInput,
    Prisma.ProductCommentUncheckedCreateInput
  >,
) {
  try {
    const createdComment = await productCommentRepository.create(data);
    return createdComment;
  } catch (error) {
    throw error;
  }
}

async function findManyComments(productId: string) {
  try {
    const comments = await productCommentRepository.findManyComments(productId);

    return comments;
  } catch (error) {
    throw error;
  }
}

async function update(commentId: string, data: Partial<ProductComment>) {
  try {
    const updatedComment = await productCommentRepository.updateById(
      commentId,
      data,
    );

    return updatedComment;
  } catch (error) {
    throw error;
  }
}

async function deleteById(commentId: string) {
  try {
    const deletedComment = await productCommentRepository.deleteById(commentId);

    return deletedComment;
  } catch (error) {
    throw error;
  }
}

export default {
  create,
  findManyComments,
  update,
  deleteById,
};
