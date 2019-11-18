/*jshint esversion: 6 */
// MongoDB Category of Products Route
const express = require("express");
const router = express.Router();
//
const {
  create,
  productById,
  read,
  remove,
  update,
  list,
  listRelated,
  listCategories,
  listBySearch,
  image,
  listSearch
  } = require("../controllers/product");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
// Product Specific Routes
router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, create);
router.get("/product/:productId", read);
router.delete("/product/:productId/:userId", requireSignin, isAuth, isAdmin, remove);
router.put("/product/:productId/:userId", requireSignin, isAuth, isAdmin, update);
// Queries
router.get("/products", list);
router.get("/products/search", listSearch);
router.get("/products/related/:productId", listRelated);
router.get("/products/categories", listCategories);
router.get("/products/image/:productId", image);
// route - make sure its post
router.post("/products/by/search", listBySearch);
// Other Routes
router.param("userId", userById);
router.param("productId", productById);
//
module.exports = router;
