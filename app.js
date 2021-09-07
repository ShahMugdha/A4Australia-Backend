import express from 'express';
import {connectDB} from './utils/database.js';
import env from 'dotenv';
import cors from 'cors';
/* import path from 'path';
const __dirname = path.resolve(); */
env.config({path: './'});
// initialize
connectDB();
const app = express();
app.use(express.json());
app.use(cors());
// App started

// routers
import authRoute from './routes/auth.js'
import productRoute from './routes/product.js'
import cartRoute from './routes/cart.js'
import orderRoute from './routes/order.js'
import addressRoute from './routes/address.js'
import profileRoute from './routes/profile.js'
import wishListRoute from './routes/wishlist.js'
import inventoryRoute from './routes/inventory.js'
import paymentRoute from './routes/payment.js'

app.use(express.static('uploads'));

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/product', productRoute)
app.use('/api/v1/cart', cartRoute)
app.use('/api/v1/order', orderRoute)
app.use('/api/v1/address', addressRoute)
app.use('/api/v1/profile', profileRoute)
app.use('/api/v1/wishlist', wishListRoute)
app.use('/api/v1/inventory', inventoryRoute)
app.use('/', paymentRoute)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Application running on http://localhost:${PORT}`);
});