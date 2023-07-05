const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const server = express();
const users = require("./users/users-router.js");
const auth = require("./auth/auth-router.js");
const { errHandler, tokenController } = require("./server-middleware.js");

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(morgan("combined"));

server.use("/api/auth", auth);
server.use("/api/users", tokenController, users);
server.use(errHandler);

module.exports = server;
