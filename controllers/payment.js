import Stripe from 'stripe';
import Cart from '../models/cart.js';
import Address from '../models/address.js';

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
    console.log(intent.id, "intent result")
    return {
      success: true, paymentIntentId: intent.id
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
    const address = await Address.findOne({user: {_id: userId}})
    const count = address.addresses.length
    const orderAddress = address.addresses[count-1] 
    let intent;
    if (req.body.payment_method_id) {
      intent = await stripe.paymentIntents.create({
        payment_method: req.body.payment_method_id,
        amount: cart.totalPrice * 100,
        currency: 'inr',
        shipping: {
          address: {
            city: orderAddress.city,
            //country: orderAddress.country,
            line1: orderAddress.addressLine1,
            line2: orderAddress.addressLine2,
            postal_code: orderAddress.postalCode,
            state: orderAddress.state
          },
          //email: cart && cart.user ? cart.user.email: null,
          name: cart && cart.user ? cart.user.name: null,
          phone: cart && cart.user ? cart.user.mobile: null
        },
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
