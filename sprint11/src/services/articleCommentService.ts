import articleCommentRepository from "../repositories/articleCommentRepository";

async function findManyComments(articleId: string) {
  return await articleCommentRepository.findManyComments(articleId);
}

async function create(articleId: string, userId: number, content: string) {
  return await articleCommentRepository.create({
    data: {
      articleId,
      commenterId: userId,
      content,
    },
  });
}

async function updateById(
  id: string,
  data: { content: string; articleId: string },
) {
  return await articleCommentRepository.updateById(id, data);
}

async function deleteById(id: string) {
  return await articleCommentRepository.deleteById(id);
}

export default {
  findManyComments,
  create,
  updateById,
  deleteById,
};
