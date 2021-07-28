import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  addresses: [{
    state: {
      type: String
    },
    city: {
      type: String
    },
    subUrb: {
      type: String
    },
    addressLine1: {
      type: String
    },
    addressLine2: {
      type: String
    },
    postalCode: {
      type: Number
    },
    mobile: {
      type: Number
    }
  }, {
    timestamps: true,
  }]
})

const Address = mongoose.model('address', addressSchema);
export default Address;