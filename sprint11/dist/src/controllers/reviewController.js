"use strict";
// import express from "express";
// import reviewService from "../services/reviewService.ts";
// import auth from "../middlewares/auth.ts";
// import passport from "../config/passport.ts";
// import { FilteredUser } from "../services/userService.ts";
// import { CustomError } from "../../dist/src/types/types.js";
// import HttpStatus from "../httpStatus.ts";
// const reviewController = express.Router();
// reviewController.post(
//   "/",
//   // auth.verifyAccessToken,
//   passport.authenticate("access-token", { session: false }),
//   async (req, res, next) => {
//     console.log(req.user);
//     const user: FilteredUser | null = req.user ?? null;
//     const userId = user?.id; // req.user.userId
//     if (!userId) {
//       next(new CustomError("Unauthorized", HttpStatus.UNAUTHORIZED));
//     }
//     try {
//       const createdReview = await reviewService.create({
//         ...req.body,
//         authorId: userId,
//       });
//       res.status(HttpStatus.CREATED).json(createdReview);
//       return;
//     } catch (error) {
//       return next(error);
//     }
//   },
// );
// reviewController.get("/:id", async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     const review = await reviewService.getById(id);
//     res.json(review);
//     return;
//   } catch (error) {
//     return next(error);
//   }
// });
// reviewController.get("/", async (_req, res, next) => {
//   try {
//     const reviews = await reviewService.getAll();
//     res.json(reviews);
//     return;
//   } catch (error) {
//     return next(error);
//   }
// });
// reviewController.put(
//   "/:id",
//   // auth.verifyAccessToken,
//   passport.authenticate("access-token", { session: false }),
//   auth.verifyReviewAuth,
//   async (req, res, next) => {
//     try {
//       const updatedReview = await reviewService.update(
//         req.params.id,
//         req.body,
//       );
//       res.json(updatedReview);
//       return;
//     } catch (error) {
//       return next(error);
//     }
//   },
// );
// reviewController.delete(
//   "/:id",
//   // auth.verifyAccessToken,
//   passport.authenticate("access-token", { session: false }),
//   auth.verifyReviewAuth,
//   async (req, res, next) => {
//     try {
//       const deletedReview = await reviewService.deleteById(req.params.id);
//       res.status(204).json(deletedReview);
//       return;
//     } catch (error) {
//       return next(error);
//     }
//   },
// );
// export default reviewController;
