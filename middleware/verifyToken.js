import env from 'dotenv';
env.config({path: '../../'});
import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
  try {
    const {authorization} = req.headers;
    if (authorization) {
      jwt.verify(authorization, process.env.JWT_AUTH_TOKEN, async (err, result) => {
        if (err) {
          res.status(401).json({success: false, message: 'You Are Not Authorized', result: err});
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