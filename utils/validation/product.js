import Joi from "joi";

export const productValidation = async (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      title: Joi.string().required(),
      category: Joi.string().required(),
      subCategory: Joi.string().email().lowercase().required(),
      description: Joi.string().integer().required(),
      price: Joi.number().required(),
      image: Joi.string().allow("").required(),
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