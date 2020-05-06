const express = require("express");
const hubsRouter = require("./hubs/hubs-router.js");
const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.json({ query: req.query, params: req.params, headers: req.headers });
});

server.use("/api/posts", hubsRouter);

server.listen(4000, () => {
  console.log("\n server is running on port 4000 \n");
});
