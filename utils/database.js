import mongoose from 'mongoose';
//import Accounts from '../models/Account.model.js';

import bcrypt from 'bcrypt';
const saltRounds = 10;

const connectDB = async () => {
  const conn = await mongoose
    .connect(
      `mongodb+srv://MugdhaShah:mugdha123@cluster0-ms17e.mongodb.net/Ecommerce`,
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true,
      },
    )
    .then(
      console.log("connected to database")
    );
};

const addAdminData = async () => {
  /* const checkAdminData = await Accounts.findOne({role: 'ADMIN'});
  if (!checkAdminData) {
    const password = 'hello';
    const passwordSalt = await bcrypt.genSalt(saltRounds);
    const pass = await bcrypt.hash(password, passwordSalt);

    await Accounts.create({
      email: 'admin@ryzen.com',
      role: 'ADMIN',
      password: pass,
      jobTitle: 'Owner',
      isVerified: true,
    });
  } */
};

export {connectDB};
