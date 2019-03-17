const jwt = require("jsonwebtoken");

// env variable
const secretKey = require("../../config/keys").secretOrKey;

module.exports = (req, res, next) => {
  //get the token from the body if there is any, and decode it
  //add it to request properties
  try {
    //take the token from the header and remove the Bearer
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed"
    });
  }
};
