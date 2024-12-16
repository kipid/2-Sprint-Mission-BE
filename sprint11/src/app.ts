import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userController from "./controllers/userController.ts";
import productController from "./controllers/productController.ts";
import articleController from "./controllers/articleController.ts";
import errorHandler from "./middlewares/errorHandler.ts";
import morgan from "morgan";
import path from "node:path";
import process from "node:process";

const app = express();
app.use(cors({
  origin: "http://localhost:3000", // Front-End 단 주소.
  credentials: true, // 쿠키를 받기 위한 설정.
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/account", userController);
app.use("/products", productController);
app.use("/articles", articleController);

app.use(errorHandler);

const port = process.env.PORT || 3100;
app.listen(port, () => console.log(`Server on port: ${port}`));
