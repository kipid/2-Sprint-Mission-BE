"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userService_1 = __importDefault(require("../services/userService"));
const passport_1 = __importDefault(require("../config/passport"));
const httpStatus_1 = __importDefault(require("../httpStatus"));
const RENEW_TOKEN_PATH = "/renew-token";
const userController = express_1.default.Router();
const setRefreshTokenCookie = (res, refreshToken) => {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: false, // TODO: must be secure!
        // domain: 'localhost',
        path: `/account${RENEW_TOKEN_PATH}`,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};
userController.post("/users", async (req, res, next) => {
    try {
        const user = await userService_1.default.createUser(req.body);
        const accessToken = userService_1.default.createToken(user.id, "access");
        const refreshToken = userService_1.default.createToken(user.id, "refresh");
        await userService_1.default.updateUser(user.id, { refreshToken });
        setRefreshTokenCookie(res, refreshToken);
        res.status(httpStatus_1.default.CREATED).json({ accessToken, user });
    }
    catch (error) {
        next(error);
    }
});
// 토큰 기반
userController.post("/login", async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await userService_1.default.getUser(email, password);
        const accessToken = userService_1.default.createToken(user.id, "access");
        const refreshToken = userService_1.default.createToken(user.id, "refresh");
        await userService_1.default.updateUser(user.id, { refreshToken });
        setRefreshTokenCookie(res, refreshToken);
        res.json({ accessToken, user }); // filter 된 user 정보
    }
    catch (error) {
        next(error);
    }
});
userController.get("/auth/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
userController.get("/auth/google/callback", passport_1.default.authenticate("google"), (req, res, next) => {
    try {
        const { id: userId } = req.user;
        const accessToken = userService_1.default.createToken(userId, "access");
        const refreshToken = userService_1.default.createToken(userId, "refresh");
        setRefreshTokenCookie(res, refreshToken);
        res.json({ accessToken, user: req.user });
    }
    catch (err) {
        next(err);
    }
});
userController.post(RENEW_TOKEN_PATH, passport_1.default.authenticate("refresh-token", { session: false }), async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        const { id: userId } = req.user;
        const { accessToken, newRefreshToken } = await userService_1.default.refreshToken(userId, refreshToken);
        await userService_1.default.updateUser(userId, { refreshToken: newRefreshToken }); // 추가
        setRefreshTokenCookie(res, newRefreshToken);
        res.json({ accessToken });
    }
    catch (err) {
        next(err);
    }
});
// 세션 기반
// userController.post('/session-login',
//   passport.authenticate('local'),
//   async (req, res, next) => {
//     const user = req.user;
//     return res.json(user);
//   });
// userController.post('/token/refresh',
//   auth.verifyRefreshToken,
//   async (req, res, next) => {
//     try {
//       const { refreshToken } = req.cookies;
//       const { userId } = req.auth;
//       const { accessToken, newRefreshToken } = await userService.refreshToken(userId, refreshToken);
//       await userService.updateUser(userId, { refreshToken: newRefreshToken }); // 추가
//       res.cookie('refreshToken', newRefreshToken, { // 추가
//         httpOnly: true,
//         sameSite: 'none',
//         secure: true,
//         path: '/token/refresh',
//       });
//       return res.json({ accessToken });
//     } catch (error) {
//       return next(error);
//     }
//   });
// userController.post('/session-login', async (req, res, next) => {
//   const { email, password } = req.body
//   try {
//     const user = await userService.getUser(email, password);
//     req.session.userId = user.id;
//     return res.json(user);
//   } catch (error) {
//     next(error);
//   }
// });
/////////////////////////////////////////////////////
// Users
/////////////////////////////////////////////////////
// userController.patch("/users/:id", async (req, res) => {
// 	assert(req.body, PatchUser);
// 	const { id } = req.params;
// 	const user = await prisma.user.update({
// 		where: { id },
// 		data: req.body,
// 	});
// 	res.send(user);
// });
// userController.get("/users", async (req, res) => {
// 	const { offset = 0, limit = 10, sort = "recent", keyword = "" } = req.query;
// 	const query = keyword ? {
// 		OR: [{
// 				email: { contains: keyword }
// 			},
// 			{
// 				nickname: { contains: keyword }
// 			}]
// 		}
// 	: {};
// 	let orderBy;
// 	switch (orderBy) {
// 		case "oldest":
// 			orderBy = { createdAt: "asc" };
// 			break;
// 		case "recent":
// 		default:
// 			orderBy = { createdAt: "desc" };
// 	}
// 	const totalCount = await prisma.user.count({
// 		where: query,
// 	});
// 	const users = await prisma.user.findMany({
// 		where: query,
// 		orderBy,
// 		skip: parseInt(offset),
// 		take: parseInt(limit),
// 	});
// 	res.send({ list: users, totalCount });
// });
// userController.get("/users/:id", async (req, res) => {
// 	const { id } = req.params;
// 	const user = await prisma.user.findUniqueOrThrow({
// 		where: { id },
// 	});
// 	res.send(user);
// });
// userController.get("/users/:userId/productComments", async (req, res) => {
// 	const { userId } = req.params;
// 	const { cursor, limit = 10, sort = "recent" } = req.query;
// 	let orderBy;
// 	switch (sort) {
// 		case "oldest":
// 			orderBy = { updatedAt: "asc" };
// 			break;
// 		case "recent":
// 		default:
// 			orderBy = { updatedAt: "desc" };
// 	}
// 	const productComments = await prisma.productComment.findMany({
// 		orderBy,
// 		where: {
// 			commenterId: userId,
// 		},
// 		cursor: cursor ? {
// 			id: cursor,
// 		}: undefined,
// 		skip: cursor ? 1 : 0,
// 		take: parseInt(limit),
// 		select: {
// 			id: true,
// 			content: true,
// 			createdAt: true,
// 			updatedAt: true,
// 		},
// 	});
// 	res.send(productComments);
// });
// userController.get("/users/:userId/articleComments", async (req, res) => {
// 	const { userId } = req.params;
// 	const { cursor, limit = 10, sort = "recent" } = req.query;
// 	let orderBy;
// 	switch (sort) {
// 		case "oldest":
// 			orderBy = { updatedAt: "asc" };
// 			break;
// 		case "recent":
// 		default:
// 			orderBy = { updatedAt: "desc" };
// 	}
// 	const articleComments = await prisma.articleComment.findMany({
// 		orderBy,
// 		where: {
// 			commenterId: userId,
// 		},
// 		cursor: cursor ? {
// 			id: cursor,
// 		} : undefined,
// 		skip: cursor ? 1 : 0,
// 		take: parseInt(limit),
// 		select: {
// 			id: true,
// 			content: true,
// 			createdAt: true,
// 			updatedAt: true,
// 		},
// 	});
// 	res.send(articleComments);
// });
// userController.delete("/users/:id", async (req, res) => {
// 	const { id } = req.params;
// 	const user = await prisma.user.delete({
// 		where: { id },
// 	});
// 	res.status(HttpStatus.NO_CONTENT).send(user);
// });
exports.default = userController;
