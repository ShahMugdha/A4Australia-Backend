import User from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

export const signUp = async(req, res) => {
  try {
    const {firstName, lastName, email, mobile, role, password} = req.body;
    const alreadyExists = await User.findOne({email: email});
    if (alreadyExists) {
      return res.status(403).json({success: false, message: 'This email id already exists!'});
    } 
    const passwordSalt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(password, passwordSalt);
    const name = firstName + " " + lastName
    const user = await User.create({
      firstName,
      lastName,
      name,
      role,
      mobile,
      email,
      password: pass
    });
    if(!user) {
      return res.status(404).json({success: false, message: "user not created"});
    }
    console.log(user)
    return res.status(201).json({success: true, message: "user created", result: user});  
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
}

export const login = async(req, res) => {
  try {
    const {email, password, role} = req.body
    const getUserAccount = await User.find({
      email: email,
      role: role,
    }).select('+password') 
    console.log(getUserAccount)
    if (!getUserAccount) {
      return res.status(404).json({success: false, message: 'user Not Found '});
    }
    const checkPassword = await bcrypt.compare(password, getUserAccount[0].password);
    if (!checkPassword) {
      return res.status(403).json({success: false, message: 'Password did not match '});
    }
    const token = jwt.sign(JSON.stringify(getUserAccount[0]), process.env.JWT_AUTH_TOKEN);
    const sendData = {userData: getUserAccount, token: token};
    return res.status(200).json({success: true, message: 'Login SuccessFull', result: sendData});
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
}
