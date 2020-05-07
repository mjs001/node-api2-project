const express = require("express");
const hubsRouter = require("./hubs/hubs-router.js");
const server = express();
require("dotenv").config();
server.use(express.json());
const port = process.env.PORT || 500;
server.get("/", (req, res) => {
  res.json({ query: req.query, params: req.params, headers: req.headers });
});

server.use("/api/posts", hubsRouter);

server.listen(port, () => {
  console.log("\n server is running on port 4000 \n");
});
