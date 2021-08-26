import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  addresses: [{
    name: {
      type: String
    },
    city: {
      type: String
    },
    state: {
      type: String
    },
    country: {
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
    }
  }]
}, {
  timestamps: true
})

const Address = mongoose.model('address', addressSchema);
export default Address;