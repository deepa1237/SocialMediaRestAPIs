const express = require("express");
const userController =  require("../controllers/user-controller");
const router =  express.Router();

router.get("/", userController.getAllUsers);
router.post("/signup", userController.createUser);
router.post("/login", userController.login);


module.exports = router;