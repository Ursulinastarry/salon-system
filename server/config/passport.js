// * login with passprt local strategy
import passport from "passport";
import bcrypt from "bcrypt";
import User from "../models/user.js"; // User model
import LocalStrategy from "passport-local";

export const configurePassport = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await User.findUserByEmail(email);
          if (!user) {
            return done(null, false, { message: "Incorrect email." });
          }
          const match = await bcrypt.compare(password, user.password_hash);
          if (!match) {
            return done(null, false, { message: "Incorrect password." });
          }
        //   console.log(user);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // * serialize and deserialize user
  passport.serializeUser((user, done) => {
    done(null, user.user_id);
  });
  passport.deserializeUser(async (user_id, done) => {
    try {
      const user = await User.findUserById(user_id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};
