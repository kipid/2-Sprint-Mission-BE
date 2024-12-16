"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorHandler_js_1 = __importDefault(require("./middlewares/errorHandler.js"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // Front-End 단 주소.
    credentials: true // 쿠키를 받기 위한 설정.
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)('dev'));
// const __dirname = path.dirname(__filename);
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// app.use('/account', userController);
// app.use('/products', productController);
// app.use('/articles', articleController);
app.use(errorHandler_js_1.default);
const port = process.env.PORT || 3100;
app.listen(port, () => console.log(`Server on port: ${port}`));
