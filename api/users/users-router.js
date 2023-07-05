const express = require("express");
const router = express.Router();
const { getAll } = require("./users-model.js");
const { userController } = require("./users-middleware.js");

router.get("/", async (req, res, next) => {
  try {
    let query = await getAll();
    res.status(200).json(query);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", userController, async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
