import Joi from "joi";

export const loginValidation = async (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      role: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(422).json({ success: false, message: error.details[0].message });
    }
    next();
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
};

export const signupValidation = async (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      mobile: Joi.number().required(),
      role: Joi.string().required(),
      password: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(422).json({ success: false, message: error.details[0].message });
    }
    next();
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
};


export const forgotPasswordValidation = async (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(422).json({ success: false, message: error.details[0].message });
    }
    next();
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
};

export const verifyOtpValidation = async (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      otp: Joi.number().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(422).json({ success: false, message: error.details[0].message });
    }
    next();
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
};

export const changePasswordValidation = async (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      password: Joi.string().required(),
      email: Joi.string().email().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(422).json({ success: false, message: error.details[0].message });
    }
    next();
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
};