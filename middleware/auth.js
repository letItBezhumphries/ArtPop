const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function(req, res, next) {
  //Get the token from the header

  const token = req.header("x-auth-token");

  //check if there is no token present
  if (!token) {
    return res.status(401).json({
      msg: "No token, authorization denied"
    });
  }

  //token is present, verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({
      msg: "token is no longer valid"
    });
  }
};
