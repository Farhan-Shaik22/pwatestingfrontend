const express = require('express')
const mongoose = require('mongoose');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Coupon = require('./models/Coupon');


require('dotenv').config();
const app = express();

app.use(express.json());

app.post('/', function (req, res) {
    res.send(req.body);
});

app.post('/api/createUser', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(200).json(user);
    }
    catch(error) {
        res.status(500).json({message: error.message});
    }
});

app.post('/api/createCoupon', async (req, res) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.status(200).json(coupon);
    }
    catch(error) {
        res.status(500).json({message: error.message});
    }
});

app.post('/api/createTransaction', async(req, res) => {
    const {senderId, receiverId, amount, category} = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        
        const sender = await User.findOne({ userId: senderId }).session(session);
        const receiver = await User.findOne({ userId: receiverId }).session(session);
    
        if (!sender || !receiver) {
          throw new Error('Sender or Receiver not found.');
        }
    
        if (sender.balance < amount) {
          throw new Error('Insufficient balance.');
        }
    
        sender.balance -= amount;
        receiver.balance += amount;
    
        await sender.save({ session });
        await receiver.save({ session });
    
        const transaction = new Transaction({
          sender: sender,
          receiver: receiver,
          amount: amount,
          category: category,
        });
    
        await transaction.save({ session });

        await session.commitTransaction();
        session.endSession();
    
        res.status(200).send({ message: 'Transaction successful.' });
      } catch (error) {
        
        await session.abortTransaction();
        session.endSession();
    
        res.status(500).send({ error: error.message });
      }
});

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log('Connected to MongoDB KampusPay_Test');
    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
})
.catch(() => {
    console.log('Connection failed');
})
