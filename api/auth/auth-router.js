const express = require("express");
const bcryptjs = require("bcryptjs");
const { bodyController } = require("./auth-middleware");
const { getByUserName, createToken, createUser } = require("../users/users-model");
const router = express.Router();

router.post("/register", bodyController, async (req, res, next) => {
  try {
    const { username, password, permission } = req.body,
      userExists = await getByUserName(username);
    if (userExists) {
      next({ status: 409, message: "username taken" });
    } else {
      const hash = await bcryptjs.hash(password, 8),
        newPerm = permission ? permission : 0,
        newUser = await createUser({ username, password: hash, permission: newPerm });
      res.status(201).json(newUser[0]);
    }
  } catch (err) {
    next(err);
  }
});

router.post("/login", bodyController, async (req, res, next) => {
  try {
    const { username, password } = req.body,
      user = await getByUserName(username),
      compare = user ? await bcryptjs.compare(password, user.password) : false;
    if (user && compare) {
      let token = await createToken(user.user_id);
      res.status(200).json({ message: `welcome, ${user.username}. Your token is: ${token[0].token}` });
    } else {
      next({ status: 401, message: "invalid credentials" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
