import Joi from "joi";

export const profileValidation = async (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().lowercase().required(),
      mobile: Joi.number().integer().required(),
      addressLine1: Joi.string().required(),
      addressLine2: Joi.string().allow("").required(),
      postalCode: Joi.number().integer(),
      city: Joi.string().required(),
      country: Joi.string().required(),
      state: Joi.string().required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 422));
    }
    next();
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
};