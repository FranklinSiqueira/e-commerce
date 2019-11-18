/*jshint esversion: 9 */
/*
File: ../e-commerce/controllers/user.js

*/
const User = require("../models/user");
const { Order } = require("../models/order");
const { errorHandler } = require("../helpers/dbErrorHandler");
//
exports.userById = (req, res, next, id) => {
	User.findById(id).exec((err, user) => {
		if (err || !user){
			return res.status(400).json({error: "User not found..."});
		}
		//
		req.profile = user;
		next();
	});
};
//
exports.read = (req, res) => {
	req.profile.hashed_password = undefined;
	req.profile.salt = undefined;
	return res.json(req.profile);
};
//
exports.update = (req, res) => {
	User.findOneAndUpdate(
		{_id: req.profile._id},
		{$set: req.body},
		{new: true},
		(err, user) => {
			if (err){
				return res.status(400).json({error: "Authorization required..."});
			}
			//
			user.hashed_password = undefined;
			user.salt = undefined;
			res.json(user);
		});
};
//
exports.addOrderToUserHistory = (req, res, next) =>  {
	let history = [];
	// Push each order's items to user's history
	history.push({
					transaction_id: req.body.order.transaction_id,
					amount: req.body.order.amount,
					address: req.body.order.address
				});
	// req.body.order.products.forEach((item) => {
	// 	history.push({
	// 					_id: item._id,
	// 					name: item.name,
	// 					description: item.description,
	// 					category: item.category,
	// 					quantity: item.count,
	// 					transaction_id: item.transaction_id,
	// 					// transaction_id: item.body.order.transaction_id,
	// 					amount: item.amount
	// 					// amount: req.body.order.amount
	// 	});
	// });
	// Update User's purchase history
	User
		.findOneAndUpdate(
			{_id: req.profile._id},
			{$push: {history: history}},
			{new: true},
			(error, data) => {
						if (error) {
								return res.status(400).json({
										error: "Couldn't Update User Purchase History..."
								});
						}
						next();
			}
		);
};
//
exports.shoppingHistory = (req, res) =>  {
	//
	Order
		.find({ user: req.profile._id })
		.populate("user", "_id name")
		.sort("-createdAt")
		.exec((error, orders) => {
			if (error) {
					return res.status(400).json({ error: errorHandler(error) });
			}
			res.json(orders);
		});
};




// end
