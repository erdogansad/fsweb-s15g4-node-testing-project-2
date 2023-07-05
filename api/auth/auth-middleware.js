const bodyController = (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      next({ status: 400, message: "username and password required" });
    } else {
      next();
    }
  } catch (e) {
    next(e);
  }
};

module.exports = { bodyController };
