const { getToken } = require("./users/users-model");

const errHandler = (err, req, res, next) => {
  res.headersSent ? next(err) : res.status(err.status || 500).json({ message: err.message || "internal server error." });
};

const tokenController = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    let tokenExists = await getToken(token);
    if (tokenExists) {
      next();
    } else {
      next({ status: 401, message: "invalid token" });
    }
  } else {
    next({ status: 403, message: "token required" });
  }
};

module.exports = { errHandler, tokenController };
