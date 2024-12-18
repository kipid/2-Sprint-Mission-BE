import { PRODUCT_DATA, USER_DATA, ARTICLE_DATA } from "./mock";
import userService from '../src/services/userService';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getRandomInt = (len: number) => {
	return Math.floor(Math.random()*len)
}

async function main() {
	await prisma.product.deleteMany();
	await prisma.article.deleteMany();
	await prisma.user.deleteMany();
	let userId = 1;
	for (const user of USER_DATA) {
		user.encryptedPassword = await userService.hashingPassword(user.password);
		const { password, ...rest } = user;
		await prisma.user.create({
			data: { ...rest, id: userId }
		});
		userId += 1;
	}
	const users = await prisma.user.findMany();
	console.log(users);
	const usersLength = users.length;
	PRODUCT_DATA.forEach(async product => {
		product.ownerId = users[getRandomInt(usersLength)].id;
		await prisma.product.create({
			data: { ...product }
		})
	});
	ARTICLE_DATA.forEach(async article => {
		article.authorId = users[getRandomInt(usersLength)].id;
		await prisma.article.create({
			data: { ...article }
		})
	})
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
