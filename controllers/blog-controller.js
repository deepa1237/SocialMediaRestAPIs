const { default: mongoose } = require("mongoose");
const blogData = require("../models/Blog");
const userData = require("../models/User");

const getAllBlogs = async (req, res, next) => {
  let blogs;
  try {
    blogs = await blogData.find();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
  if (!blogs) {
    return res.status(404).json({ message: "No data found" });
  }
  return res.status(200).json({ blogs });
};

const createBlog = async (req, res, next) => {
  const { title, description, image, user } = req.body;
  let existinguser;
  try {
    existinguser = await userData.findById(user);
    console.log((1));
  } catch (error) {
    return console.log(error);
  }

  if (!existinguser) {
    return res.status(400).json({ message: "Unable to find user" });
  }

  const blog = new blogData({
    title,
    description,
    image,
    user,
  });
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await blog.save({ session });
    console.log(existinguser);
    existinguser.blogs.push(blog);
    await existinguser.save({ session });
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    return console.log(error);
  } finally {
    session.endSession();
  }
  return res.status(200).json({ message: "Blog saved successfully" });
};

const updateBlog = async (req, res, next) => {
  const id = req.params.id;
  const { title, description } = req.body;
  let blogs;
  try {
    blogs = await blogData.findByIdAndUpdate(id, {
      title,
      description,
    });
  } catch (error) {
    return console.log(error);
  }
  if (!blogs) {
    console.log(blogs);
    return res.status(404).json({ message: "Not found" });
  }
  return res.status(200).json({ message: "Blog updated successfully" });
};

const deleteBlog = async (req, res, next) => {
  const id = req.params.id;
  let blog;
  try {
    blog = await blogData.findByIdAndDelete(id);
    await userData.updateMany({ blogs: id }, { $pull: { blogs: id } })
  } catch (error) {
    return console.log(error);
  }
  if (!blog) {
    console.log(blog);
    return res.status(404).json({ message: "Not found" });
  }
  return res.status(200).json({ message: "Blog deleted successfully" });
};

const getBlogById = async (req, res, next) => {
  const id = req.params.id;
  let blogs;
  try {
    blogs = await blogData.findById(id);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
  if (!blogs) {
    return res.status(404).json({ message: "No data found" });
  }
  return res.status(200).json({ blogs });
};

const getBlogsByUserId =  async(req, res, next) => {
  const userId =  req.params.id;
  let userBlogs;
  try {
    userBlogs =  await userData.findById(userId).populate("blogs"); 
    console.log(userBlogs);
  } catch(error) {
    console.log(error);
  }
  if(!userBlogs){
    return res.status(404).json({message: "No Data Found"});
  }
  return res.status(200).json({blogs: userBlogs});
}
module.exports = {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogById,
  getBlogsByUserId
};
