import {
  Profile,
  Strategy as GoogleStrategy,
  VerifyCallback,
} from "passport-google-oauth20";
import userService from "../../services/userService.ts";
import process from "node:process";

const googleStrategyOptions: {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  passReqToCallback: false;
} = {
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL: "/account/auth/google/callback",
  passReqToCallback: false,
};

async function verify(
  _accessToken: string,
  _refreshToken: string,
  profile: Profile,
  done: VerifyCallback,
) {
  try {
    const user = await userService.oauthCreateOrUpdate(
      profile.provider,
      profile.id,
      profile.displayName,
      profile.emails?.[0]?.value,
    );
    done(null, user);
  } catch (err) {
    done(err, false);
  }
}

const googleStrategy = new GoogleStrategy(googleStrategyOptions, verify);

export default googleStrategy;
