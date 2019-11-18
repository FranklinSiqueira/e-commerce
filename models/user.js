/*jshint esversion: 6 */
// MongoDB with Crypto
const mongoose = require("mongoose");
const crypto = require("crypto");
// Package v.3.3.3 - installed using npm i uuid
const uuidv1 = require("uuid/v1");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true,
		maxlength: 32
	},
	email: {
		type: String,
		trim: true,
		required: true,
		unique: true,
		maxlength: 64
	},
	hashed_password: {
		type: String,
		required: true,
	},
	about: {
		type: String,
		trim: true,
	},
	role: {
		type: Number,
		default: 0
	},
	history: {
		type: Array,
		default: []
	},
	salt:  String},
	{ timestamps: true
	}
);

// Creating a virtual field for password
userSchema.virtual("password")
	// set and get
	.set(function(password){
		this._password = password;
		this.salt = uuidv1();
		this.hashed_password = this.encryptPassword(password);
		})
	.get(function(){
		return this._password;
		});

// Methods
userSchema.methods = {
		// Authentication method
		authenticate: function(plainText){
			return this.encryptPassword(plainText) === this.hashed_password;
		},
		// EncryptPassword method
		encryptPassword: function(password){
			if(!password) return "";
			try {
				return crypto
					.createHmac("sha1", this.salt)
					.update(password)
					.digest("hex");
				} catch(err){
					return "";
					}
				}
			};
//
module.exports = mongoose.model("User", userSchema);
