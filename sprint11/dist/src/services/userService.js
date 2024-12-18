"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const httpStatus_1 = __importDefault(require("../httpStatus"));
const types_1 = require("../types/types");
const node_process_1 = __importDefault(require("node:process"));
function hashingPassword(password) {
    return bcrypt_1.default.hash(password, 10); // 2^10 번 hash
}
function createToken(userId, type) {
    const payload = { userId };
    const options = {
        expiresIn: type === "refresh" ? "1w" : "1d",
    };
    return jsonwebtoken_1.default.sign(payload, node_process_1.default.env.JWT_SECRET, options);
}
function filterSensitiveUserData(user) {
    const { password, encryptedPassword, refreshToken, ...rest } = user;
    return rest;
}
async function createUser(user) {
    const existedUser = await userRepository_1.default.findByEmail(user.email);
    if (existedUser) {
        const error = new Error("User already exists");
        throw error;
    }
    const hashedPassword = await hashingPassword(user.password); // 해싱 과정 추가
    const createdUser = await userRepository_1.default.save({
        ...user,
        encryptedPassword: hashedPassword,
    }); // password 추가
    return filterSensitiveUserData(createdUser);
}
async function verifyPassword(inputPassword, savedPassword) {
    if (savedPassword === null) {
        const error = new types_1.CustomError("Unauthorized: Wrong password!", httpStatus_1.default.UNAUTHORIZED);
        throw error;
    }
    const isValid = await bcrypt_1.default.compare(inputPassword, savedPassword);
    if (!isValid) {
        const error = new types_1.CustomError("Unauthorized: Wrong password!", httpStatus_1.default.UNAUTHORIZED);
        throw error;
    }
}
async function getUser(email, password) {
    const user = await userRepository_1.default.findByEmail(email);
    if (!user) {
        const error = new types_1.CustomError("User not found.", httpStatus_1.default.NOT_FOUND);
        throw error;
    }
    verifyPassword(password, user.encryptedPassword);
    return filterSensitiveUserData(user);
}
async function getUserById(id) {
    const user = await userRepository_1.default.findById(id);
    if (!user) {
        const error = new types_1.CustomError("User not found.", httpStatus_1.default.NOT_FOUND);
        throw error;
    }
    return filterSensitiveUserData(user);
}
async function updateUser(id, data) {
    return await userRepository_1.default.update(id, data);
}
async function refreshToken(userId, refreshToken) {
    const user = await userRepository_1.default.findById(userId);
    if (!user || user.refreshToken !== refreshToken) {
        const error = new types_1.CustomError("Unauthorized", httpStatus_1.default.UNAUTHORIZED);
        throw error;
    }
    const accessToken = createToken(user.id, "access"); // 변경
    const newRefreshToken = createToken(user.id, "refresh"); // 추가
    return { accessToken, newRefreshToken };
}
async function oauthCreateOrUpdate(provider, providerId, nickname, email) {
    if (!email) {
        throw new types_1.CustomError("Email is required!", httpStatus_1.default.BAD_REQUEST);
    }
    const user = await userRepository_1.default.createOrUpdate(provider, providerId, email, nickname);
    return filterSensitiveUserData(user);
}
exports.default = {
    hashingPassword,
    createUser,
    getUser,
    createToken,
    updateUser,
    refreshToken,
    getUserById,
    oauthCreateOrUpdate,
};
