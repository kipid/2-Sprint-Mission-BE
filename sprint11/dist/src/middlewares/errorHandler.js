"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatus_js_1 = __importDefault(require("../httpStatus.js"));
const index_js_1 = require("../../node_modules/.prisma/client/index.js");
const errorHandler = (error, req, res, next) => {
    let status = error?.code | error?.status;
    if (status === 0) {
        status = 500;
    }
    console.log(error.name);
    console.log(error.message);
    if (error.name === 'StructError' || error instanceof index_js_1.Prisma.PrismaClientValidationError) {
        res.status(httpStatus_js_1.default.BAD_REQUEST).send({ name: error.name, message: error.message });
        return;
    }
    else if (error instanceof index_js_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        res.status(httpStatus_js_1.default.NOT_FOUND).send({ name: error.name, message: error.message });
        return;
    }
    res.status(status).json({
        path: req.path,
        method: req.method,
        code: error?.code,
        message: error.message ?? 'Internal Server Error',
        data: error.data ?? undefined,
        date: new Date(),
    });
};
exports.default = errorHandler;
