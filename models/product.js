/*jshint esversion: 6 */
// MongoDB Products Schema
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
//
const productSchema = new mongoose.Schema({
    name: {
  		type: String,
  		trim: true,
  		required: true,
  		maxlength: 32
  	},
    category: {
  		type: ObjectId,
  		ref: "Category",
  		required: true,
  	},
    description: {
  		type: String,
  		trim: true,
  		required: true,
  		maxlength: 200
  	},
    image: {
  		data: Buffer,
  		contentType: String
  	},
    shipping: {         // Can be used with delivery options model
  		type: Boolean,
  		required: false
  	},
    cost: {
  		type: Number,
  		trim: true,
  		required: true,
  		maxlength: 32
  	},
    price: {
  		type: Number,
  		trim: true,
  		required: true,
  		maxlength: 32
  	},
    quantity: {
  		type: Number
  	},
    sold: {
  		type: Number,
      default: 0
  	},
	},
	{ timestamps: true }
);
//
module.exports = mongoose.model("Product", productSchema);
