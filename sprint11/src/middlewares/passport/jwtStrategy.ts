import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import userService, { FilteredUser } from '../../services/userService.js'
import { Request } from 'express';

const accessTokenOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
  // issuer: 'enter issuer here',
  // audience: 'enter audience here',
};

const cookieExtractor = function(req: Request) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['refreshToken'];
  }
  return token;
};

const refreshTokenOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET as string,
}

async function jwtVerify(payload: { userId: number }, done: (error: Error | null, user: false | FilteredUser) => any) {
  try {
    const user = await userService.getUserById(payload.userId);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error: any) {
    return done(error, false);
  }
}

const accessTokenStrategy = new JwtStrategy(accessTokenOptions, jwtVerify);
const refreshTokenStrategy = new JwtStrategy(refreshTokenOptions, jwtVerify);

export {
  accessTokenStrategy,
  refreshTokenStrategy,
};
