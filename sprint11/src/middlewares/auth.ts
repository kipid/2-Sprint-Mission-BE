import { expressjwt } from "express-jwt";
// import reviewRepository from "../repositories/reviewRepository.ts";
import productCommentRepository from "../repositories/productCommentRepository.ts";
import productRepository from "../repositories/productRepository.ts";
import articleCommentRepository from "../repositories/articleCommentRepository.ts";
import articleRepository from "../repositories/articleRepository.ts";
import { Secret } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { CustomError } from "../types/types.ts";
import HttpStatus from "../httpStatus.ts";
import { FilteredUser } from "../services/userService.ts";
import process from "node:process";

const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET as Secret,
  algorithms: ["HS256"],
  requestProperty: "user",
});

const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET as Secret,
  algorithms: ["HS256"],
  getToken: (req) => req.cookies.refreshToken,
});

// async function verifyReviewAuth(
//   req: Request,
//   _res: Response,
//   next: NextFunction,
// ) {
//   const { id: reviewId } = req.params;
//   try {
//     const review = await reviewRepository.getById(reviewId);

//     if (!review) {
//       throw new CustomError("Review not found", HttpStatus.NOT_FOUND);
//     }

//     const { id: userId } = req.user as FilteredUser;

//     if (review.authorId !== user?.id) {
//       throw new CustomError("Forbidden", HttpStatus.FORBIDDEN);
//     }

//     return next();
//   } catch (error) {
//     return next(error);
//   }
// }

async function verifyProductCommentAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { commentId } = req.params;
  try {
    const comment = await productCommentRepository.getById(commentId);

    if (!comment) {
      throw new CustomError("Product-Comment not found", HttpStatus.NOT_FOUND);
    }

    const { id: userId } = req.user as FilteredUser;
    if (comment.commenterId !== userId) {
      throw new CustomError("Forbidden", HttpStatus.FORBIDDEN);
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

async function verifyProductAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { productId } = req.params;
  try {
    const product = await productRepository.getById(productId);

    if (!product) {
      throw new CustomError("Product not found", HttpStatus.NOT_FOUND);
    }

    const { id: userId } = req.user as FilteredUser;
    if (product.ownerId !== userId) {
      throw new CustomError("Forbidden", HttpStatus.FORBIDDEN);
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

async function verifyArticleCommentAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { commentId } = req.params;
  try {
    const comment = await articleCommentRepository.getById(commentId);

    if (!comment) {
      throw new CustomError("Article-Comment not found", HttpStatus.NOT_FOUND);
    }

    const { id: userId } = req.user as FilteredUser;
    if (comment.commenter?.id !== userId) {
      throw new CustomError("Forbidden", HttpStatus.FORBIDDEN);
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

async function verifyArticleAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { articleId } = req.params;
  try {
    const article = await articleRepository.getById(articleId);

    if (!article) {
      throw new CustomError("Article not found", HttpStatus.NOT_FOUND);
    }

    const { id: userId } = req.user as FilteredUser;
    if (article.authorId !== userId) {
      throw new CustomError("Forbidden", HttpStatus.FORBIDDEN);
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

// async function verifySessionLogin(req: Request, res: Response, next: NextFunction) {
//   // 세션에서 사용자 정보를 읽어옴
//   try {
//     const { userId } = req.session;

//     if (!userId) {
//       // 로그인되어있지 않으면 인증 실패
//       throwUnauthorizedError();
//     }

//     const user = await userRepository.findById(req.session.userId);

//     if (!user) {
//       throwUnauthorizedError();
//     }

//     // 이후 편리성을 위한 유저 정보 전달
//     req.user = {
//       id: req.session.userId,
//       email: user.email,
//       name: user.name,
//       provider: user.provider,
//       providerId: user.providerId,
//     };
//     // 사용자가 로그인되어 있다면 다음 미들웨어 처리
//     next();
//   } catch (error) {
//     next(error);
//   }
// }

// function passportAuthenticateSession(req: Request, res: Response, next: NextFunction) {
//   if (!req.isAuthenticated()) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
//   return next();
// }

export default {
  verifyAccessToken,
  verifyRefreshToken,
  // verifyReviewAuth,
  verifyProductCommentAuth,
  verifyProductAuth,
  verifyArticleCommentAuth,
  verifyArticleAuth,
};
