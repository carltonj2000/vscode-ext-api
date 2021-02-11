import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import { __prod__ } from "./constants";
import { join } from "path";
import { User } from "./entities/Users";

const PORT = process.env.PORT || 3002;

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

  const user = await User.create({ name: "bob" }).save();
  console.log(user);

  const app = express();

  app.get("/", (_req, res) => res.send("hi"));

  app.listen(PORT, () => console.log("server listening on port", PORT));
};

main();
