const express = require("express");
const router =  express.Router();
const blogController = require("../controllers/blog-controller");

router.get("/", blogController.getAllBlogs );
router.post("/create", blogController.createBlog );
router.put("/update/:id", blogController.updateBlog );
router.delete("/delete/:id", blogController.deleteBlog );
router.get("/:id", blogController.getBlogById );
router.get("/user/:id", blogController.getBlogsByUserId );

module.exports =  router;