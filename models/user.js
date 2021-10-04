import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    mobile:{
      type: Number
    },
    email: {
      type: String,
      require: true,
      unique: true
    },
    password: {
      type: String,
      require: true,
      select: false
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    name: {
      type: String
    },
    role: {
      type: String,
      enum: ['ADMIN', 'CUSTOMER'],
      default: 'CUSTOMER',
      require: true,
    },
    otp: {type: Number},
    otpExpires: {type: Date},
    isVerified: {type: Boolean, default: false, require: true},
  }, {
  timestamps: true
});

const User = mongoose.model('user', userSchema);
export default User;