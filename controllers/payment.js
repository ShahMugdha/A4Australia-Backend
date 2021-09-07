import Stripe from 'stripe';
import Cart from '../models/cart.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const generateResponse = (intent) => {
  // Note that if your API version is before 2019-02-11, 'requires_action'
  // appears as 'requires_source_action'.
  if (
    intent.status === 'requires_action' &&
    intent.next_action.type === 'use_stripe_sdk'
  ) {
    // Tell the client to handle the action
    return {
      requires_action: true,
      //payment_intent_client_secret: intent.client_secret
      paymentMethodType: 'card'
    };
  } else if (intent.status === 'succeeded') {
    // The payment didn’t need any additional actions and completed!
    // Handle post-payment fulfillment
    return {
      success: true
    };
  } else {
    // Invalid status
    return {
      error: 'Invalid PaymentIntent status'
    }
  }
}

export const createPaymentIntent = async(req, res) => {
  try {
    const {userId} = req.params
    const cart = await Cart.findOne({user: {_id: userId}}).populate('user')
    let intent;
    if (req.body.payment_method_id) {
      // Create the PaymentIntent
      intent = await stripe.paymentIntents.create({
        payment_method: req.body.payment_method_id,
        amount: cart.totalPrice * 100,
        currency: 'inr',
        receipt_email: cart.user.email,
        confirmation_method: 'manual',
        confirm: true
      });
      console.log(intent, "intent")
    } else if (req.body.payment_intent_id) {
      intent = await stripe.paymentIntents.confirm(
        req.body.payment_intent_id
      );
    }
    // Send the response to the client
    res.send(generateResponse(intent));
  }
  catch (e) {
    // Display error on client
    return res.send({ error: e.message });
  }
}
