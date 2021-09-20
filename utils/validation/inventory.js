import Joi from "joi";

export const inventoryValidation = async (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      size: Joi.string().required(),
      quantity: Joi.number().required(),
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