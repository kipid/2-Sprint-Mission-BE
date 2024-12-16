"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mock_js_1 = require("./mock.js");
const userService_js_1 = __importDefault(require("../src/services/userService.js"));
const index_js_1 = require("../node_modules/.prisma/client/index.js");
const prisma = new index_js_1.PrismaClient();
const getRandomInt = (len) => {
    return Math.floor(Math.random() * len);
};
async function main() {
    await prisma.product.deleteMany();
    await prisma.article.deleteMany();
    await prisma.user.deleteMany();
    let userId = 1;
    for (const user of mock_js_1.USER_DATA) {
        user.encryptedPassword = await userService_js_1.default.hashingPassword(user.password);
        const { password, ...rest } = user;
        await prisma.user.create({
            data: { ...rest, id: userId }
        });
        userId += 1;
    }
    const users = await prisma.user.findMany();
    console.log(users);
    const usersLength = users.length;
    mock_js_1.PRODUCT_DATA.forEach(async (product) => {
        product.ownerId = users[getRandomInt(usersLength)].id;
        await prisma.product.create({
            data: { ...product }
        });
    });
    mock_js_1.ARTICLE_DATA.forEach(async (article) => {
        article.authorId = users[getRandomInt(usersLength)].id;
        await prisma.article.create({
            data: { ...article }
        });
    });
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
