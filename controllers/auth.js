import User from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {sendMail} from '../utils/sendGrid.js'
import dotenv from 'dotenv';
dotenv.config();

export const signUp = async(req, res) => {
  try {
    const {firstName, lastName, email, mobile, role, password} = req.body;
    const alreadyExists = await User.findOne({email: email, mobile: mobile});
    if (alreadyExists) {
      return res.status(200).json({success: false, message: 'This email id or mobile number already exists!'});
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
      return res.status(200).json({success: false, message: "user not created"});
    }
    console.log(user, "created")
    const project = role === 'CUSTOMER' ? `http://localhost:3000/` : `http://localhost:3000/admin/`;
    const verifyLink = `http://localhost:3000/verify-email/${user._id}`;
    await sendMail(email, `<div>Please click on the link below link to verify your account</div><p>${verifyLink}</p>`); 
    return res.status(201).json({success: true, message: "user created", result: user});  
  }
  catch(err) {
    return res.status(200).json({success: false, message: "something went wrong", result: err});
  }
}

export const verifyEmail = async(req, res) => {
  try {
    const {userId} = req.params
    const verifyUser = await User.findOneAndUpdate(
      {_id: userId},
      {$set: {isVerified: true}}
    )
    if(!verifyUser) {
      return res.status(200).json({success: false, message: "user not verified"});
    }  
    return res.status(200).json({success: true, message: "user verified", result: verifyUser});
  }
  catch(err) {
    return res.status(200).json({success: false, message: "something went wrong", result: err});
  }
}

export const login = async(req, res) => {
  try {
    const {email, password, role} = req.body
    const getUserAccount = await User.findOne({
      email: email,
      role: role,
    }).select('+password') 
    if (!getUserAccount) {
      return res.status(200).json({success: false, message: 'user Not Found '});
    }
    const checkPassword = await bcrypt.compare(password, getUserAccount.password);
    if (getUserAccount && !checkPassword) {
      return res.status(200).json({success: false, message: 'Wrong Password!'});
    }
    if (getUserAccount.isVerified === false) {
      return res.status(200).json({success: false, message: 'Please verify your account first'});
    }
    const token = jwt.sign(JSON.stringify(getUserAccount), process.env.JWT_AUTH_TOKEN);
    const sendData = {userData: getUserAccount, token: token};
    return res.status(200).json({success: true, message: 'Login SuccessFull', result: sendData});
  }
  catch(err) {
    return res.status(200).json({success: false, message: "something went wrong", result: err});
  }
}

export const ForgotPassword = async (req, res) => {
  try {
    const {email} = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expTime = Date.now() + 3600000;

    const updateUserData = await User.findOneAndUpdate({email: email}, {otp: otp, otpExpires: expTime}, {new: true});
    if (!updateUserData) {
      return res.status(200).json({success: false, message: 'Email not Found'});
    }
    await sendMail(email, `<p>Your otp is : ${otp}</p>`);
    return res.status(200).json({
      success: true,
      result: updateUserData,
      message: `Otp Sent to email id ${email}`,
    });
  }
  catch(err) {
    return res.status(200).json({success: false, message: "something went wrong", result: err});
  }
};
// verify Otp for forgot password
export const verifyOtp = async (req, res, next) => {
  try {
    const {email, otp} = req.body;
    console.log(email, otp, "email otp")
    const currentTime = Date.now();

    const updateUserData = await User.findOne({
      email: email,
      otp: otp,
      otpExpires: {$gt: currentTime},
    });

    if (!updateUserData) {
      return res.status(200).json({success: false, message: 'Otp expired or does not match'});
    }
    return res.status(200).json({
      success: true,
      result: updateUserData,
      message: 'otp verified Successfully',
    });
  }
  catch(err) {
    return res.status(200).json({success: false, message: "something went wrong", result: err});
  }
};
// change password in forgot password
export const changePassword = async (req, res) => {
  try {
    const {email, password} = req.body;
    const passwordSalt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(password, passwordSalt);
    const updateUserData = await User.findOneAndUpdate({email: email}, {$set: {password: pass, otp: 0}}, {new: true});
    console.log(updateUserData, "change pass")
    if (!updateUserData) {
      return res.status(200).json({success: false, message: 'Error while changing your password, try again'});
    }
    return res.status(200).json({success: true, message: 'Password Changed Successfully', result: true});
  }
  catch(err) {
    return res.status(200).json({success: false, message: "something went wrong", result: err});
  }
};
