/*jshint esversion: 9 */
/*
File: ../e-commerce/app.js


*/
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");                     // morgan@1.9.1
const bodyParser = require("body-parser");            // body-parser@1.19.0
const cookieParser = require("cookie-parser");        // cookie-parser@1.4.4
const expressValidator = require("express-validator");// express-validator@5.3.1
require("dotenv").config();
// import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const braintreeRoutes = require("./routes/braintree");
const orderRoutes = require("./routes/order");
// App related
const app = express();
// Database
mongoose
	.connect(process.env.DATABASE, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true
	})
	.then(() => console.log("DB Connected!"));

//const MongoClient = require('mongodb').MongoClient;
//const uri = "mongodb+srv://franklin:245353f10@M!@cluster0-yimlm.mongodb.net/test?retryWrites=true&w=majority";
//const client = new MongoClient(uri, { useNewUrlParser: true });
//client.connect(err => {
//  const collection = client.db("test").collection("devices");
//  // perform actions on the collection object
//  client.close();
//});

// Models middlewares
app.use(morgan("dev"));
// From suggestion to fix:
// PayloadTooLargeError: request entity too large
// Origin:
// OPTIONS /api/braintree/payment/5dc7bb3f10f5d855e32d6309 204 7.295 ms - 0
// POST /api/braintree/payment/5dc7bb3f10f5d855e32d6309 200 2074.651 ms - 3643
// OPTIONS /api/order/create/5dc7bb3f10f5d855e32d6309 204 8.389 ms - 0
// POST /api/order/create/5dc7bb3f10f5d855e32d6309 413 22.743 ms - 2251
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));
//
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
// Routes related middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", braintreeRoutes);
app.use("/api", orderRoutes);
//
const port = process.env.PORT || 8000;
//
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

// end...
