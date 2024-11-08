import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import cors from 'cors';
import errorHandler from "./middlewares/errorHandler.js";
import articleController from "./controllers/articleController.js";
import userController from "./controllers/userController.js";
import productController from "./controllers/productController.js";

const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

app.use('', userController);
app.use('/products', productController);
app.use('/articles', articleController);

app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => console.log("Server on"));
