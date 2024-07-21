const express = require("express");
const router = express.Router();
const { createUser, loginUser } = require("../controllers/UserControllers");

/* Available routes for user */

router.post("/signup", createUser);
router.post("/login", loginUser);

module.exports = router;
