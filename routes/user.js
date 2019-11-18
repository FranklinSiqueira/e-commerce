/*jshint esversion: 6 */
// MongoDB User Route
/*
File: .../e-commerce/routes/user.js

*/
const express = require("express");
const router = express.Router();
//
const {
	requireSignin,
	isAuth,
	isAdmin } = require("../controllers/auth");
const {
	userById,
	read,
	update,
	shoppingHistory } = require("../controllers/user");
//
router.get("/secret/:userId",
	requireSignin,
	isAuth,
	(req, res) => {
		res.json({ user: req.profile });
	}
);
//
router.get("/user/:userId", requireSignin, isAuth, read);
router.get("/orders/by/user/:userId", requireSignin, isAuth, shoppingHistory);
router.put("/user/:userId", requireSignin, isAuth, update);
//
router.param("userId", userById);
//
module.exports = router;
