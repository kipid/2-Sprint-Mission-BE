import HttpStatus from "../httpStatus";

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

export class CustomError extends Error {
  code: HttpStatus;

  constructor(message: string, code: HttpStatus) {
    super(message);
    this.code = code;
  }
}
