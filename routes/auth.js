/*jshint esversion: 9 */
const express = require("express");
const router = express.Router();

// Import Method from "../controllers/user"
const { signup, signin, signout, requireSignin } = require("../controllers/auth");

// Import Method from "../validator"
const { userSignupValidator } = require("../validator/index");

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);

//router.get("/hello", requireSignin, (req, res) => {
//	res.send("Hello There!");
//});

module.exports = router;
