const mongoose = require('mongoose');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

exports.createTransaction = async (req, res) => {
    const { senderId, receiverId, amount, category } = req.body;

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
            sender,
            receiver,
            amount,
            category
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
};
