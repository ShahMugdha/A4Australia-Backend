import env from 'dotenv';
env.config({path: '../../'});
import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
  try {
    const {authorization} = req.headers;
    if (authorization) {
      jwt.verify(authorization, process.env.JWT_AUTH_TOKEN, async (err, result) => {
        if (err) {
          return res.status(401).json({success: false, message: 'wrong token passed', result: err});
        } else {
          req.userData = result;
          next();
        }
      });
    }
    else return res.status(401).json({success: false, message: 'You Are Not Authorized'});
  } catch (e) {
    res.status(403).json({success: false, result: e});
  }
};

export const verifyAdmin = async (req, res, next) => {
  try {
    const user = req.userData
    if (user.role === 'ADMIN') {
      next();
    }
    else {
      return res.status(403).json({success: false, message: 'You Are Not Authorized as an admin'});
      // var err = new Error('You are not authorized as an admin');
      // err.status = 403;
      // return next(err);
    }
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
}