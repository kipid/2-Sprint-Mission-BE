import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userController from "./controllers/userController.js";
import productController from "./controllers/productController.js";
import articleController from "./controllers/articleController.js";
import errorHandler from "./middlewares/errorHandler.js";
import morgan from "morgan";

const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/account', userController);
app.use('/products', productController);
app.use('/articles', articleController);

app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => console.log("Server on"));
