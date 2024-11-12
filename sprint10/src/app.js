import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from "multer";
import userController from "./controllers/userController.js";
import productController from "./controllers/productController.js";
import articleController from "./controllers/articleController.js";
import errorHandler from "./middlewares/errorHandler.js";
import morgan from "morgan";
import HttpStatus from "./httpStatus.js";

const app = express();
app.use(cors({
	origin: 'http://localhost:3000', // Front-End 단 주소.
	credentials: true // 쿠키를 받기 위한 설정.
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});
const upload = multer({ storage: storage });

app.post('/upload', upload.array('images', 3), (req, res) => {
	try {
		res.send({ status: 'success', files: req.files, });
	} catch (err) {
		res.status(HttpStatus.BAD_REQUEST).send({ status: 'fail', error: err.message, });
	}
});

app.use('/account', userController);
app.use('/products', productController);
app.use('/articles', articleController);

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server on port: ${port}`));
