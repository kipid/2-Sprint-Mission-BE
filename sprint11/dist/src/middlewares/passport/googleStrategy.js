"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_google_oauth20_1 = require("passport-google-oauth20");
const userService_1 = __importDefault(require("../../services/userService"));
const node_process_1 = __importDefault(require("node:process"));
const googleStrategyOptions = {
    clientID: node_process_1.default.env.GOOGLE_CLIENT_ID,
    clientSecret: node_process_1.default.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/account/auth/google/callback",
    passReqToCallback: false,
};
async function verify(_accessToken, _refreshToken, profile, done) {
    try {
        const user = await userService_1.default.oauthCreateOrUpdate(profile.provider, profile.id, profile.displayName, profile.emails?.[0]?.value);
        done(null, user);
    }
    catch (err) {
        done(err, false);
    }
}
const googleStrategy = new passport_google_oauth20_1.Strategy(googleStrategyOptions, verify);
exports.default = googleStrategy;
