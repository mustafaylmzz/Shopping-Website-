const express = require("express");
const router = express.Router();
const adminControllers = require("../controllers/admin");

const csrf=require("../middleware/csrf")
const isAdmin=require("../middleware/isAdmin")
router.get("/products",csrf,isAdmin,adminControllers.getProducts);
router.get("/add-product",csrf,isAdmin,adminControllers.getAddProduct);
router.post("/add-product",csrf,isAdmin ,adminControllers.postAddProduct);
router.get("/products/:id",csrf,isAdmin ,adminControllers.getEditProduct);
router.post("/products",csrf,isAdmin,adminControllers.postEditProduct);
router.post("/delete-product",csrf,isAdmin,adminControllers.postDeleteProduct);
router.get("/categories",csrf,isAdmin,adminControllers.getCategories);
router.get("/add-category",csrf,isAdmin,adminControllers.getAddCategory);
router.post("/add-category",csrf,isAdmin ,adminControllers.postAddCategory);
router.get("/categories/:id",csrf,isAdmin ,adminControllers.getEditCategories);
router.post("/categories",csrf,isAdmin,adminControllers.postEditCategories);
router.get("/delete-category/:id",csrf,isAdmin,adminControllers.getDeleteCategory);
router.post("/delete-category",csrf,isAdmin,adminControllers.postDeleteCategory);
module.exports = router;
