import isEmail from 'is-email';
import isUuid from 'is-uuid';
import { array, define, integer, min, number, object, partial, size, string } from '../node_modules/superstruct/dist/index';

const Uuid = define('Uuid', (value) => isUuid.v4(value as string));
const email = define('email', (value) => isEmail(value as string));

export const CreateUser = object({
	email: email,
	nickname: size(string(), 1, 20),
	password: string()
});
export const PatchUser = partial(CreateUser);
	// * User id 는 따로 받아야 함.

export const CreateProduct = object({
	name: size(string(), 1, 10),
	description: size(string(), 10, 100),
	price: min(number(), 0),
	tags: size(array(string()), 0, 15),
	images: size(array(string()), 0, 3),
	ownerId: integer(),
	// favoriteCount: min(integer(), 0),
});
export const PatchProduct = partial(CreateProduct);
	// * Product id 는 따로 받아야 함.

export const CreateArticle = object({
	title: size(string(), 1, 50),
	authorId: integer(),
	content: size(string(), 10, 500),
});
export const PatchArticle = partial(CreateArticle);
	// * Article id 는 따로 받아야 함.

export const CreateProductComment = object({
	commenterId: integer(),
	content: size(string(), 1, 255),
});
	// * Patch 는 위 데이터에 id 추가.

export const CreateArticleComment = object({
	commenterId: integer(),
	content: size(string(), 1, 255),
});
	// * Patch 는 위 데이터에 id 추가.
