/*jshint esversion: 6 */
//
const User = require("../models/user");
//
const jwt = require("jsonwebtoken");       // used to generate connected/signed-in token...
//
const expressJwt = require("express-jwt"); // used for authorization purposes...
//
const { errorHandler } = require("../helpers/dbErrorHandler");
//
//                               Methods...
//
exports.signup = (req, res) => {
	// console.log("req.body", req.body);
	const user = new User(req.body);
	user.save((err, user) => {
		if(err){
			return res.status(400).json({ err: errorHandler(err) });
		}
		// Hiding salt and hashed password
		user.salt = undefined;
		user.hashed_password = undefined;
		res.json({ user });
	});
	//res.json({message: "Hello from controllers/user.js res.json"});
};
//
exports.signin = (req, res) => {
	// Find user by e-mail
	const { email, password } = req.body;
	User.findOne({ email }, (err, user) => {
		if (err || !user){
			return res.status(400).json({
				error: "E-mail not found! Please, try signing up..."
			});
		}
		// User found! checking password...
		// Checks e-mail/password with authenticate method in the user model
		if (!user.authenticate(password)){
			return res.status(401).json({
				error: "E-mail and password don't match!"
			});
		}
		// Generate a connected token with user id and secret
		const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
		// Persist token as "t" (randomly created name) in cookie with expiration date
		res.cookie("t", token, {expire: new Date() + 9999});
		// Return response with user and token to frontend client
		const {_id, name, email, role} = user;
		return res.json({token, user: {_id, name, email, role}});
	});
};
//
exports.signout = (req, res) => {
	res.clearCookie("t");
	res.json({ message: "Signed Out Successfully!"});
};
//
exports.requireSignin = expressJwt({
	secret: process.env.JWT_SECRET,
	userProperty: "auth"
});
//
exports.isAdmin = (req, res, next) => {
	//let user = req.profile && req.auth && req.profile._id == req.auth._id;
	// Regular user -> role = 0
	// Administrator -> role = 1
	if (req.profile.role === 0){
		return res.status(403).json({ error: "Access denied! (Admin only area)"});
	}
	next();
};
//
exports.isAuth = (req, res, next) => {
	let user = req.profile && req.auth && req.profile._id == req.auth._id;
	if (!user){
		return res.status(403).json({ error: "Access denied!"});
	}
	next();
};
