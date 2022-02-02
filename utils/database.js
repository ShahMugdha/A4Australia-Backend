import mongoose from 'mongoose';
import env from 'dotenv';
env.config();

const connectDB = async () => {
  const conn = await mongoose
    .connect(
      process.env.MONGODB_URI,
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
