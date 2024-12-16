"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reviewService_js_1 = __importDefault(require("../services/reviewService.js"));
const auth_js_1 = __importDefault(require("../middlewares/auth.js"));
const passport_js_1 = __importDefault(require("../config/passport.js"));
const reviewController = express_1.default.Router();
reviewController.post('/', 
// auth.verifyAccessToken, 
passport_js_1.default.authenticate('access-token', { session: false }), async (req, res, next) => {
    console.log(req.user);
    const { id: userId } = req.user; // req.user.userId
    try {
        const createdReview = await reviewService_js_1.default.create({
            ...req.body,
            authorId: userId,
        });
        return res.status(201).json(createdReview);
    }
    catch (error) {
        return next(error);
    }
});
reviewController.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const review = await reviewService_js_1.default.getById(id);
        return res.json(review);
    }
    catch (error) {
        return next(error);
    }
});
reviewController.get('/', async (req, res, next) => {
    try {
        const reviews = await reviewService_js_1.default.getAll();
        return res.json(reviews);
    }
    catch (error) {
        return next(error);
    }
});
reviewController.put('/:id', 
// auth.verifyAccessToken, 
passport_js_1.default.authenticate('access-token', { session: false }), auth_js_1.default.verifyReviewAuth, async (req, res, next) => {
    try {
        const updatedReview = await reviewService_js_1.default.update(req.params.id, req.body);
        return res.json(updatedReview);
    }
    catch (error) {
        return next(error);
    }
});
reviewController.delete('/:id', 
// auth.verifyAccessToken, 
passport_js_1.default.authenticate('access-token', { session: false }), auth_js_1.default.verifyReviewAuth, async (req, res, next) => {
    try {
        const deletedReview = await reviewService_js_1.default.deleteById(req.params.id);
        return res.status(204).json(deletedReview);
    }
    catch (error) {
        return next(error);
    }
});
exports.default = reviewController;
