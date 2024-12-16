import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import userService, { FilteredUser } from "../../services/userService.ts";
import { Request } from "express";
import process from "node:process";

const accessTokenOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
  // issuer: 'enter issuer here',
  // audience: 'enter audience here',
};

const cookieExtractor = function (req: Request) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["refreshToken"];
  }
  return token;
};

const refreshTokenOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET as string,
};

async function jwtVerify(
  payload: { userId: number },
  done: (error: unknown, user: false | FilteredUser) => void,
) {
  try {
    const user = await userService.getUserById(payload.userId);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error: unknown) {
    return done(error, false);
  }
}

const accessTokenStrategy = new JwtStrategy(accessTokenOptions, jwtVerify);
const refreshTokenStrategy = new JwtStrategy(refreshTokenOptions, jwtVerify);

export { accessTokenStrategy, refreshTokenStrategy };
