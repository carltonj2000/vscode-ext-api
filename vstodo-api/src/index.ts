import express from "express";

const PORT = process.env.PORT || 3002;

const main = async () => {
  const app = express();

  app.get("/", (_req, res) => res.send("hi"));

  app.listen(PORT, () => console.log("server listening on port", PORT));
};

main();
