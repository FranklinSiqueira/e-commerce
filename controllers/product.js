/*jshint esversion: 6 */
//
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Product = require("../models/product");
const { errorHandler } = require("../helpers/dbErrorHandler");
//
exports.productById = (req, res, next, id) => {
  Product
    .findById(id)
    .populate("category")
    .exec((err, product) => {
    if (err || !product){
      return res.status(400).json({ error: "Product unavailable..." });
    }
    //
    req.product = product;
    next(0);
  });
};
//
exports.read = (req, res) => {
  req.product.image = undefined;
  return res.json(req.product);
};
//
exports.remove = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err){
      return res.status(400).json({ error: errorHandler(err) });
    }
    // Try with product name or id...
    //res.json({deletedProduct.name, message: "Product deleted..."});
    res.json({message: "Product deleted..."});
  });
};
//
exports.update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    //
    if (err){
      return res.status(400).json({ error: "Couldn't upload image..." });
    }
    // check for all fields
    const {name, description, cost, price, category, quantity, shipping} = fields;
    //
    if (!name ||
        !description ||
        !cost ||
        !price ||
        !category ||
        !quantity ||
        !shipping) {
        return res.status(400).json({  error: "All fields are required"});
    }
    // Instantiate an Existing Product
    let product = req.product;
    // From "lodash" library
    product = _.extend(product, fields);
    // 1kb = 1000 and 1mb = 1000000
    if (files.image) {
        // console.log("FILES PHOTO: ", files.photo);
        if (files.image.size > 1000000) {
            return res.status(400).json({error: "Image should be less than 1mb in size"});
        }
        product.image.data = fs.readFileSync(files.image.path);
        product.image.contentType = files.image.type;
    }
    // Method for Saving New Product Object Instance
    product.save((err, result) => {
      if (err){
        return res.status(400).json({ error: errorHandler(err) });
      }
      // Success!!!
      res.json(result);
    });
  });
};
//
exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    //
    if (err){
      return res.status(400).json({ error: "Couldn't upload image..." });
    }
    // check for all fields
    const { name, description, cost, price, category, quantity, shipping } = fields;
    //
    if (!name ||
        !description ||
        !cost ||
        !price ||
        !category ||
        !quantity ||
        !shipping) {
        return res.status(400).json({  error: "All fields are required" });
    }
    // Instantiate a New Product
    let product = new Product(fields);
    // 1kb = 1000 and 1mb = 1000000
    if (files.image) {
        // console.log("FILES PHOTO: ", files.photo);
        if (files.image.size > 1000000) {
            return res.status(400).json({error: "Image should be less than 1mb in size"});
        }
        product.image.data = fs.readFileSync(files.image.path);
        product.image.contentType = files.image.type;
    }
    // Method for Saving New Product Object Instance
    product.save((err, result) => {
      if (err){
        return res.status(400).json({ error: errorHandler(err) });
      }
      // Success!!!
      res.json(result);
    });
  });
};
/**
*
* Query Parameters:
*
* If no parameters, all products are returned.
* 1) by sell = /products?sortBy=sold&order=desc&limit=4
* 2) by arrival = /products?sortBy=createdAt&order=desc&limit=4
*
*/
exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;
  //
  Product
    .find()
    .select("-image")
    .populate("category")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, products) => {
      if (err){
        return res.status(400).json({ error: "Product unavailable..." });
      }
      //
      res.json(products);
  });
};
// List Related Products Based on Category
exports.listRelated = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;
  // _id: {$ne: req.product} in MongoDB: NOT EQUAL TO req.product _id
  Product
    .find({_id: {$ne: req.product}, category: req.product.category})
    .limit(limit)
    .populate("category", "_id name")
    .exec((err, products) => {
      if (err){
        return res.status(400).json({ error: "Product unavailable..." });
      }
      //
      res.json(products);
  });
};
// listCategories
exports.listCategories = (req, res) => {
  // let limit = req.query.limit ? parseInt(req.query.limit) : 6;
  Product.distinct("category", {}, (err, categories) => {
      if (err){
        return res.status(400).json({ error: "Unavailable categories..." });
      }
      //
      res.json(categories);
  });
};
//
/**
 * List products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */
exports.listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};
  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);
  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
            $gte: req.body.filters[key][0],
            $lte: req.body.filters[key][1]
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }
  //
  Product
    .find(findArgs)
    .select("-image")
    .populate("category")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
          return res.status(400).json({ error: "Products not found" });
      }
      //
      res.json({ size: data.length, data });
  });
};
//
exports.image = (req, res, next) => {
  if (req.product.image.data){
    res.set("Content-Type", req.product.image.contentType);
    return res.send(req.product.image.data);
  }
  next();
};
//
exports.listSearch = (req, res) => {
  // Creates query object in order to hold "seach and category values"
  // required in Search.js
  const query = {};
  // Assign search value to query.name
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: "i" };
    // Assigns category value to query.Category
    if (req.query.category && req.query.category != "all") {
      query.category = req.query.category;
    }
    // Find the product based on query object with matching properties
    // (search and category)
    Product
      .find(query, (err, products) => {
        if (err) {
            return res.status(400).json({ error: errorHandler(err) });
        }
        //
        res.json(products);})
      .select("-image");
  }
};
//
exports.decreaseQuantity = (req, res, next) => {
  let bulkOps = req.body.order.products.map((item) => {
    return {
      updateOne: {
        filter: {_id: item._id},
        update: {$inc: {quantity: -item.count, sold: +item.count}}
      }
    }
  });
  //
  Product
    .bulkWrite(bulkOps, {}, (error, products) => {
      if (error) {
        return res.status(400).json({error: "Couldn't Update Product..."});
      }
      next();
    });
};



// end
