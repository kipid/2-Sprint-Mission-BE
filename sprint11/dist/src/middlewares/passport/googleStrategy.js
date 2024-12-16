"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_google_oauth20_1 = require("passport-google-oauth20");
const userService_js_1 = __importDefault(require("../../services/userService.js"));
const googleStrategyOptions = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/account/auth/google/callback',
    passReqToCallback: false,
};
async function verify(accessToken, refreshToken, profile, done) {
    try {
        const user = await userService_js_1.default.oauthCreateOrUpdate(profile.provider, profile.id, profile.displayName, profile.emails?.[0]?.value);
        done(null, user);
    }
    catch (err) {
        done(err, false);
    }
}
const googleStrategy = new passport_google_oauth20_1.Strategy(googleStrategyOptions, verify);
exports.default = googleStrategy;
