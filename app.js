const express = require("express");
const app = new express();
const port = 8081;
const mongoose = require("mongoose");
const router = require("./routes/user-routes");
const blogrouter =  require('./routes/blog-routes');
app.use(express.json());

app.use("/api/user" ,router);
app.use("/api/blog" ,blogrouter);

const mongourl =
  "mongodb+srv://root:<mongopassword>@cluster0.36kaym2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(mongourl)
  .then(() => app.listen(port))
  .then(() => console.log("connected to db"))
  .catch((error)=> console.log(error));
