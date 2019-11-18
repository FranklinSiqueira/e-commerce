/*jshint esversion: 9 */
const User = require("../models/user");
const braintree = require("braintree");
require("dotenv").config();
//
// Data in the .env file
// BRAINTREE_MERCHANT_ID
// BRAINTREE_PUBLIC_KEY
// BRAINTREE_PRIVATE_KEY
//
const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY
});
//
exports.generateToken = (req, res) => {
  //
  gateway.clientToken.generate({}, function(error, response) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send(response);
    }
  });
};
//
exports.processPayment = (req, res) => {
  //
  let nonceFromClient = req.body.paymentMethodNonce;
  let amountFromClient = req.body.amount;
  //
  let newTransaction = gateway.transaction.sale({
    amount: amountFromClient,
    paymentMethodNonce: nonceFromClient,
    options: {
      submitForSettlement: true
    }
  }, (error, result) => {
      if (error) {
        res.status(500).json(error);
      } else {
        res.json(result);
      }
  });
};
// end
