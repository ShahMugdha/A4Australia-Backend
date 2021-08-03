import env from 'dotenv';
env.config({path: '../../'});
import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
  try {
    const {authorization} = req.headers;
    if (authorization) {
      jwt.verify(authorization, process.env.JWT_AUTH_TOKEN, async (err, result) => {
        if (err) {
          return res.status(401).json({success: false, message: 'You Are Not Authorized', result: err});
        } else {
          req.userData = result;
          next();
        }
      });
    }
  } catch (e) {
    res.status(403).json({success: false, result: e});
  }
};

export const verifyAdmin = async (req, res, next) => {
  try {
    const user = req.userData
    if(user.role !== 'ADMIN') {
      return res.status(401).json({success: false, message: 'You dont have admin rights', result: err});
    }
    next()
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
}