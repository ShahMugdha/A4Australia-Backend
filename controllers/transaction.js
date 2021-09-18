import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const paymentIntentsList = async(req, res) => {
  try {
    const paymentIntents = await stripe.paymentIntents.list();
    if(paymentIntents) {
      return res.status(200).json({success: true, message: "success", result: paymentIntents});
    }
    return res.status(400).json({error: 'Your request could not be processed. Please try again.'});
  }
  catch (err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
}

export const paymentIntentById = async(req, res) => {
  try {
    const {paymentIntentId} = req.params
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if(paymentIntent) {
      return res.status(200).json({success: true, message: "success", result: paymentIntent});
    }
    return res.status(400).json({error: 'Your request could not be processed. Please try again.'});
  }
  catch (err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
}