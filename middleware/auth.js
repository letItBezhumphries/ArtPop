const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

module.exports = function (req, res, next) {
  //Get the token from the header

  const token = req.header("x-auth-token");

  //check if there is no token present
  if (!token) {
    return res.status(401).json({
      msg: "No token, authorization denied",
    });
  }

  //token is present, verify token
  try {
    const decoded = jwt.verify(token, keys.jwtSecret);

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({
      msg: "token is no longer valid",
    });
  }
};
