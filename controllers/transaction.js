import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const paymentIntentsList = async(req, res) => {
  try {
    const paymentIntents = await stripe.paymentIntents.list();
    if(paymentIntents) {
      return res.status(200).json({success: true, message: "payment intent list retreived", result: paymentIntents});
    }
    return res.status(200).json({error: 'payment intent list not found'});
  }
  catch (err) {
    return res.status(200).json({success: false, message: "something went wrong", result: err});
  }
}

export const paymentIntentById = async(req, res) => {
  try {
    const {paymentIntentId} = req.params
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if(paymentIntent) {
      return res.status(200).json({success: true, message: "payment intent found", result: paymentIntent});
    }
    return res.status(200).json({error: 'payment intent not found'});
  }
  catch (err) {
    return res.status(200).json({success: false, message: "something went wrong", result: err});
  }
}