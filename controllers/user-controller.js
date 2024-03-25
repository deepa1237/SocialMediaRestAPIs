const userData = require("../models/User");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await userData.find();
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
  if (!users) {
    return res.status(404).json({ message: "No records found" });
  }
  return res.status(200).json({ users });
};

const createUser =  async(req, res, next) => {
    
    const {name, email, password} = req.body;
    let existinguser;
    try{
        existinguser =  await userData.findOne({email});
        console.log(existinguser);
    } catch(error) {
        console.log(error);
    }

    if(password.length < 6){
        return res.status(400).json({message: "password length should be more than 6"});
    }
    if(existinguser){
        return res.status(400).json({message: "User already exist. Login instead!"});
    }
    const hashpassword = bcrypt.hashSync(password,2);
    try { 
        const user  =  new userData({
            name,
            email, 
            password: hashpassword,
            blogs: []
        })
        await user.save();
        return res.status(201).json({message: "User created"});
    } catch(error){
        console.log(error);
    }
}

const login = async(req, res, next) => {
    const {email, password} =  req.body;
    let existinguser;
    try {
        existinguser =  await userData.findOne({email});
    } catch(error) {
        console.log(error);
    }

    if(!existinguser){
        return res.status(400).json({message: "User with this email id not exist"});
    }

    const isPasswordCorrect =  bcrypt.compareSync(password, existinguser.password);
    if(!isPasswordCorrect){
        return res.status(400).json({message: "Password is incorrect"});
    }
    return res.status(200).json({message: "Logged in successfully"});
}
module.exports = { getAllUsers, createUser, login };