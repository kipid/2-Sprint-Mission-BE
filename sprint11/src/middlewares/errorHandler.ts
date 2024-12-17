import { ErrorRequestHandler } from "express";
import HttpStatus from "../httpStatus.ts";
import { Prisma } from "@prisma/client";

const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  let status = error?.code | error?.status;
  if (status === 0) {
    status = 500;
  }
  console.log(error.name);
  console.log(error.message);
  if (
    error.name === "StructError" ||
    error instanceof Prisma.PrismaClientValidationError
  ) {
    res.status(HttpStatus.BAD_REQUEST).send({
      name: error.name,
      message: error.message,
    });
    return;
  } else if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    res.status(HttpStatus.NOT_FOUND).send({
      name: error.name,
      message: error.message,
    });
    return;
  }
  res.status(status).json({
    path: req.path,
    method: req.method,
    code: error?.code,
    message: error.message ?? "Internal Server Error",
    data: error.data ?? undefined,
    date: new Date(),
  });
};

export default errorHandler;
