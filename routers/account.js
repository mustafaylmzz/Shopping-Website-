const express = require("express");
const router = express.Router();
const accountControllers = require("../controllers/account");
const csrf=require("../middleware/csrf")

router.get("/login",csrf,accountControllers.getLogin)
router.post("/login",csrf,accountControllers.postLogin)

router.get("/logout",csrf,accountControllers.getLogout)

router.get("/register",csrf,accountControllers.getRegister)
router.post("/register",csrf,accountControllers.postRegister)

router.get("/reset-password",csrf,accountControllers.getResetPassword)
router.post("/reset-password",csrf,accountControllers.postResetPassword)

router.get("/reset-password/:token",csrf,accountControllers.getNewPassword)
router.post("/new-password",csrf,accountControllers.postNewPassword)

module.exports=router;
