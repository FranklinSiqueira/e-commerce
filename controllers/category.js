/*jshint esversion: 6 */
//
const Category = require("../models/category");
const { errorHandler } = require("../helpers/dbErrorHandler");
//
exports.create = (req, res) => {
  const category = new Category(req.body);
  // Method for Saving New Category Object Instance
  category.save((err, data) => {
		if (err){
			return res.status(400).json({ error: errorHandler(err) });
		}
		//
		res.json({ data });
	});
};
//
exports.categoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category){
      return res.status(400).json({error: "Category not found..."});
    }
    //
    req.category = category;
    next();
  });
};
//
exports.read = (req, res) => {
  return res.json(req.category);
};
//
exports.update = (req, res) => {
  const category = req.category;
  category.name = req.body.name;
  // Method for Updating Category Object Instance
  category.save((err, data) => {
		if (err){
			return res.status(400).json({ error: errorHandler(err) });
		}
		//
		res.json({ data, message: "Category updated..." });
	});
};
//
exports.remove = (req, res) => {
  const category = req.category;
  // Method for Deleting Category Object Instance
  category.remove((err, data) => {
		if (err){
			return res.status(400).json({ error: errorHandler(err) });
		}
		//
		res.json({ data, message: "Category removed..." });
	});
};
//
exports.list = (req, res) => {
  Category.find().exec((err, data) => {
    if (err){
      return res.status(400).json({ error: errorHandler(err) });
    }
    //
    res.json(data);
  });
};
