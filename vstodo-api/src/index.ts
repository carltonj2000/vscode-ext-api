import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import { __prod__ } from "./constants";
import { join } from "path";
import { User } from "./entities/Users";
import { Strategy as GitHubStrategy } from "passport-github";
import passport from "passport";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || "big secret";
const CLIENT_ID = process.env.CLIENT_ID || "default id";
const CLIENT_SECRET = process.env.CLIENT_SECRET || "default secret";

const main = async () => {
  await createConnection({
    type: "postgres",
    database: "vstodo",
    username: "postgres",
    password: "example",
    logging: !__prod__,
    synchronize: !__prod__,
    entities: [join(__dirname, "./entities/*.*")],
  });

  //  const user = await User.create({ name: "bob" }).save();

  const app = express();
  app.use(cors({ origin: "*" }));
  app.use(passport.initialize());

  passport.use(
    new GitHubStrategy(
      {
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: "http://renderws:3002/auth/github/callback",
      },
      async (_accessToken: any, _refreshToken: any, profile: any, cb: any) => {
        console.log(profile);
        let user = await User.findOne({ where: { githubId: profile.id } });
        if (user) {
          user.name = profile.displayName;
          await user.save();
        } else {
          user = await User.create({
            name: profile.displayName,
            githubId: profile.id,
          }).save();
        }
        cb(null, {
          accessToken: jwt.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: "1yr",
          }),
        });
      }
    )
  );

  passport.serializeUser((user: any, done) => done(null, user.accessToken));

  app.get("/", (_req, res) => res.send("hi"));

  app.get("/auth/github", passport.authenticate("github", { session: false }));
  app.get(
    "/auth/github/callback",
    passport.authenticate("github"),
    (req: any, res) => {
      res.redirect(`http://renderws:54321/auth/${req.user.accessToken}`);
    }
  );

  app.get("/me", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.send({ user: null });

    const token = authHeader.split(" ")[1];
    if (!token) return res.send({ user: null });

    let userId = "";

    try {
      const payload: any = jwt.verify(token, JWT_SECRET);
      userId = payload.userId;
    } catch (err) {
      res.send({ user: null });
      return console.log("JWT token did not verify.");
    }
    const user = await User.findOne(userId);
    if (!user) return res.send({ user: null });
    res.send({ user });
  });

  app.listen(PORT, () => console.log("server listening on port", PORT));
};

main();
