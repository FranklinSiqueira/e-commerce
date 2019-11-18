/*jshint esversion: 6 */
// MongoDB Products Schema
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
//
const salesSchema = new mongoose.Schema({
    product: {
  		type: ObjectId,
      ref: "Product",
  		required: true,
  	},
    category: {
  		type: ObjectId,
  		ref: "Category",
  		required: true,
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
	},
	{ timestamps: true }
);
//
module.exports = mongoose.model("Sales", salesSchema);
