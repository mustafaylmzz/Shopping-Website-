const express=require("express")
const router=express.Router()
const shopControllers =require("../controllers/shop.js")
const isAuth=require("../middleware/authentication")
const csrf=require("../middleware/csrf")

router.get("/",csrf,shopControllers.getIndex)
router.get("/products",csrf,shopControllers.getProducts)
router.get("/products/:id",csrf,shopControllers.getProduct)
router.get("/categories/:categoryid",csrf,shopControllers.getProductsByCategoryId)
router.get("/cart",csrf,isAuth,shopControllers.getCart)
router.post("/cart",csrf,isAuth,shopControllers.postCart)
router.post("/delete-cartitem",csrf,isAuth,shopControllers.postCartItemDelete)
router.get("/orders",csrf,isAuth,shopControllers.getOrders)
router.post("/create-order",csrf,isAuth,shopControllers.postOrder)




module.exports=router