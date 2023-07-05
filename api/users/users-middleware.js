const { getById } = require("./users-model.js");

const userController = async (req, res, next) => {
  try {
    let query = await getById(req.params.id);
    if (query) {
      req.user = query;
      next();
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { userController };
