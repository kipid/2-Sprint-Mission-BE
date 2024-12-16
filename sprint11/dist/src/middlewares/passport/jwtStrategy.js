"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenStrategy = exports.accessTokenStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const userService_js_1 = __importDefault(require("../../services/userService.js"));
const accessTokenOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    // issuer: 'enter issuer here',
    // audience: 'enter audience here',
};
const cookieExtractor = function (req) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['refreshToken'];
    }
    return token;
};
const refreshTokenOptions = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET,
};
async function jwtVerify(payload, done) {
    try {
        const user = await userService_js_1.default.getUserById(payload.userId);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    }
    catch (error) {
        return done(error, false);
    }
}
const accessTokenStrategy = new passport_jwt_1.Strategy(accessTokenOptions, jwtVerify);
exports.accessTokenStrategy = accessTokenStrategy;
const refreshTokenStrategy = new passport_jwt_1.Strategy(refreshTokenOptions, jwtVerify);
exports.refreshTokenStrategy = refreshTokenStrategy;
