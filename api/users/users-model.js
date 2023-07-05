const crypto = require("crypto");
const db = require("../../data/db-config.js");

const getAll = () => {
  return db.select("user_id", "username", "permission").from("users");
};

const getById = (user_id) => {
  return db.select("user_id", "username", "permission").from("users").where("user_id", user_id).first();
};

const getByUserName = (username) => {
  return db("users").where("username", username).first();
};

const createUser = (user) => {
  return db("users").insert(user).returning(["user_id", "username", "permission"]);
};

const createToken = async (user_id) => {
  const token = crypto.randomBytes(32).toString("hex"),
    tokenExists = await db("tokens").where("user_id", user_id).first();

  return tokenExists ? db("tokens").where("user_id", user_id).update({ token }).returning("token") : db("tokens").insert({ user_id, token }).returning("token");
};

const getToken = (token) => {
  return db("tokens").where("token", token).first();
};

module.exports = { getAll, getById, getByUserName, createUser, createToken, getToken };
