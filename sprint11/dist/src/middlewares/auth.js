"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_jwt_1 = require("express-jwt");
const reviewRepository_js_1 = __importDefault(require("../repositories/reviewRepository.js"));
const productCommentRepository_js_1 = __importDefault(require("../repositories/productCommentRepository.js"));
const productRepository_js_1 = __importDefault(require("../repositories/productRepository.js"));
const articleCommentRepository_js_1 = __importDefault(require("../repositories/articleCommentRepository.js"));
const articleRepository_js_1 = __importDefault(require("../repositories/articleRepository.js"));
const types_js_1 = require("../types/types.js");
const httpStatus_js_1 = __importDefault(require("../httpStatus.js"));
// function throwUnauthorizedError() {
//   // 인증되지 않은 경우 401 에러를 발생시키는 함수
//   const error = new Error('Unauthorized');
//   error.code = 401;
//   throw error;
// }
const verifyAccessToken = (0, express_jwt_1.expressjwt)({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    requestProperty: 'user'
});
const verifyRefreshToken = (0, express_jwt_1.expressjwt)({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    getToken: (req) => req.cookies.refreshToken,
});
async function verifyReviewAuth(req, res, next) {
    const { id: reviewId } = req.params;
    try {
        const review = await reviewRepository_js_1.default.getById(reviewId);
        if (!review) {
            throw new types_js_1.CustomError('Review not found', httpStatus_js_1.default.NOT_FOUND);
        }
        if ((req.user?.id)
            && review.authorId !== req.user?.id) {
            const error = new Error('Forbidden');
            error.code = 403;
            throw error;
        }
        return next();
    }
    catch (error) {
        return next(error);
    }
}
async function verifyProductCommentAuth(req, res, next) {
    const { commentId } = req.params;
    try {
        const comment = await productCommentRepository_js_1.default.getById(commentId);
        if (!comment) {
            const error = new Error('Product-Comment not found');
            error.code = 404;
            throw error;
        }
        if (comment.commenterId !== req.user.id) {
            const error = new Error('Forbidden');
            error.code = 403;
            throw error;
        }
        return next();
    }
    catch (error) {
        return next(error);
    }
}
async function verifyProductAuth(req, res, next) {
    const { productId } = req.params;
    try {
        const product = await productRepository_js_1.default.getById(productId);
        if (!product) {
            const error = new Error('Product not found');
            error.code = 404;
            throw error;
        }
        if (product.ownerId !== req.user.id) {
            const error = new Error('Forbidden');
            error.code = 403;
            throw error;
        }
        return next();
    }
    catch (error) {
        return next(error);
    }
}
async function verifyArticleCommentAuth(req, res, next) {
    const { commentId } = req.params;
    try {
        const comment = await articleCommentRepository_js_1.default.getById(commentId);
        if (!comment) {
            const error = new Error('Article-Comment not found');
            error.code = 404;
            throw error;
        }
        if (comment.commenter.id !== req.user.id) {
            const error = new Error('Forbidden');
            error.code = 403;
            throw error;
        }
        return next();
    }
    catch (error) {
        return next(error);
    }
}
async function verifyArticleAuth(req, res, next) {
    const { articleId } = req.params;
    try {
        const article = await articleRepository_js_1.default.getById(articleId);
        if (!article) {
            const error = new Error('Article not found');
            error.code = 404;
            throw error;
        }
        if (article.authorId !== req.user.id) {
            const error = new Error('Forbidden');
            error.code = 403;
            throw error;
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
    verifyReviewAuth,
    verifyProductCommentAuth,
    verifyProductAuth,
    verifyArticleCommentAuth,
    verifyArticleAuth,
};
