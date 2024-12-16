"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
// export interface User {
//   id: number;
//   email: string;
//   nickname?: string;
//   image?: string;
//   encryptedPassword?: string;
//   refreshToken?: string;
//   provider: string;
//   providerId?: string;
//   createdAt: Date;
//   updatedAt: Date;
// }
class CustomError extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}
exports.CustomError = CustomError;
