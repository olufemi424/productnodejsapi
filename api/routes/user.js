const express = require("express");
const router = express.Router();

//check authorization
const checkAuth = require("../middleware/check-auth");

//User controller
const UserController = require("../controllers/user");

// User end point
// GET @ localhost:PORT/
router.get("/", UserController.user_get_all_user);

// User end point
// POST @ localhost:PORT/user
router.post("/signup", UserController.user_signup);

// User end point
// POST @ localhost:PORT/user/login
router.post("/login", UserController.user_login);

// User end point
// DELETE @ localhost:PORT/user/{id}
router.delete("/:userId", checkAuth, UserController.user_delete);

module.exports = router;
