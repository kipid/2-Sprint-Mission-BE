"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_jwt_1 = require("express-jwt");
// import reviewRepository from "../repositories/reviewRepository";
const productCommentRepository_1 = __importDefault(require("../repositories/productCommentRepository"));
const productRepository_1 = __importDefault(require("../repositories/productRepository"));
const articleCommentRepository_1 = __importDefault(require("../repositories/articleCommentRepository"));
const articleRepository_1 = __importDefault(require("../repositories/articleRepository"));
const types_1 = require("../types/types");
const httpStatus_1 = __importDefault(require("../httpStatus"));
const node_process_1 = __importDefault(require("node:process"));
const verifyAccessToken = (0, express_jwt_1.expressjwt)({
    secret: node_process_1.default.env.JWT_SECRET,
    algorithms: ["HS256"],
    requestProperty: "user",
});
const verifyRefreshToken = (0, express_jwt_1.expressjwt)({
    secret: node_process_1.default.env.JWT_SECRET,
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
async function verifyProductCommentAuth(req, _res, next) {
    const { commentId } = req.params;
    try {
        const comment = await productCommentRepository_1.default.getById(commentId);
        if (!comment) {
            throw new types_1.CustomError("Product-Comment not found", httpStatus_1.default.NOT_FOUND);
        }
        const { id: userId } = req.user;
        if (comment.commenterId !== userId) {
            throw new types_1.CustomError("Forbidden", httpStatus_1.default.FORBIDDEN);
        }
        return next();
    }
    catch (error) {
        return next(error);
    }
}
async function verifyProductAuth(req, _res, next) {
    const { productId } = req.params;
    try {
        const product = await productRepository_1.default.getById(productId);
        if (!product) {
            throw new types_1.CustomError("Product not found", httpStatus_1.default.NOT_FOUND);
        }
        const { id: userId } = req.user;
        if (product.ownerId !== userId) {
            throw new types_1.CustomError("Forbidden", httpStatus_1.default.FORBIDDEN);
        }
        return next();
    }
    catch (error) {
        return next(error);
    }
}
async function verifyArticleCommentAuth(req, _res, next) {
    const { commentId } = req.params;
    try {
        const comment = await articleCommentRepository_1.default.getById(commentId);
        if (!comment) {
            throw new types_1.CustomError("Article-Comment not found", httpStatus_1.default.NOT_FOUND);
        }
        const { id: userId } = req.user;
        if (comment.commenter?.id !== userId) {
            throw new types_1.CustomError("Forbidden", httpStatus_1.default.FORBIDDEN);
        }
        return next();
    }
    catch (error) {
        return next(error);
    }
}
async function verifyArticleAuth(req, _res, next) {
    const { articleId } = req.params;
    try {
        const article = await articleRepository_1.default.getById(articleId);
        if (!article) {
            throw new types_1.CustomError("Article not found", httpStatus_1.default.NOT_FOUND);
        }
        const { id: userId } = req.user;
        if (article.authorId !== userId) {
            throw new types_1.CustomError("Forbidden", httpStatus_1.default.FORBIDDEN);
        }
        return next();
    }
    catch (error) {
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
exports.default = {
    verifyAccessToken,
    verifyRefreshToken,
    // verifyReviewAuth,
    verifyProductCommentAuth,
    verifyProductAuth,
    verifyArticleCommentAuth,
    verifyArticleAuth,
};
