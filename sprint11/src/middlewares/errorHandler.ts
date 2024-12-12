import { ErrorRequestHandler } from "express";
import HttpStatus from "../httpStatus.js";
import { Prisma } from "../../node_modules/.prisma/client/index.js";

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let status = error?.code | error?.status;
  if (status === 0) {
    status = 500;
  }
  console.log(error.name);
  console.log(error.message);
  if (error.name === 'StructError' || error instanceof Prisma.PrismaClientValidationError) {
    res.status(HttpStatus.BAD_REQUEST).send({ name: error.name, message: error.message });
    return;
  }
  else if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
    res.status(HttpStatus.NOT_FOUND).send({ name: error.name, message: error.message });
    return;
  }
  res.status(status).json({
    path: req.path,
    method: req.method,
    message: error.message ?? 'Internal Server Error',
    data: error.data ?? undefined,
    date: new Date(),
  });
}

export default errorHandler;
