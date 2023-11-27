const { HttpException } = require("../exceptions/http.exception")
const Transaction = require("../models/Transaction")
const User = require("../models/User")

//DEPOSIT INTO YOUR ACCOUNT
const depositService = async (userId, transactionData) => {
    const user = await User.findById(userId)
    if (!user) throw new HttpException(404, "A user with this userId does not exist")

    const data = {
        userId: userId,
        fromAccountNumber: transactionData.fromAccountNumber,
        amount: transactionData.amount,
        transactionType: transactionData.transactionType
    }
    if(transactionData.amount < 500) throw new HttpException(403, "You are only allowed to deposit a total of 500 Naira or more")
    user.balance += transactionData.amount
    const newTransaction = new Transaction(data)
    const createTransaction = await newTransaction.save();
    console.log(createTransaction);
    if (createTransaction) {
        await User.findByIdAndUpdate(
            userId,
            { $set: { balance: user.balance } },
            { new: true }
        )
    }
    return { createTransaction, user }
}

//WITHDRAWING FROM YOUR ACCOUNT
const WithdrawalService = async (userId, transactionData) => {
    const user = await User.findById(userId)
    if(!user) throw new HttpException(404, "A user with this userId does not exist")

    const data = {
        userId: userId,
        fromAccountNumber: transactionData.fromAccountNumber,
        amount: transactionData.amount,
        transactionType: transactionData.transactionType
    }
    if(transactionData.amount > user.balance) throw new HttpException("Your Account has Insufficient funds so you are not allowed to make this transaction")
    if(transactionData.amount < 1000) throw new HttpException(403, "You are not allowed to withdraw amount less than 1000 naira")
    user.balance -= transactionData.amount
    const newTransaction = new Transaction(data)
    const createTransaction = await newTransaction.save();
    if (createTransaction) {
        await User.findByIdAndUpdate(
            userId,
            { $set: { balance: user.balance } },
            { new: true }
        )
    }
    return { createTransaction, user }
}

const transferService = async (senderId, transactionData) => {
    const user = await User.findById(senderId)
    if(!user) throw new HttpException(404, "A user withthis userId does not exist")

    const data = {
        userId: senderId,
        fromAccountNumber: transactionData.fromAccountNumber,
        toAccountNumber: transactionData.toAccountNumber,
        amount: transactionData.amount,
        transactionType: transactionData.transactionType
    }
    const senderData = await User.findOne({ accountNumber: transactionData.fromAccountNumber })
    if(!senderData) throw new HttpException(404, "A User with this Account Number does not exist")
    const receiverData = await User.findOne({ accountNumber: transactionData.toAccountNumber })
    if(!receiverData) throw new HttpException(404, "A User with this account Number does not exist")

    if(transactionData.amount < 500) throw new HttpException(403, "You are only allowed to send amount of money equivalent to 500 naira and above")
    if(transactionData.amount > senderData.balance) throw new HttpException("Your Account has Insufficient funds so you are not allowed to make this transaction")
    senderData.balance -= transactionData.amount
    receiverData.balance += transactionData.amount
    const newTransaction = new Transaction(data)
    const createTransaction = await newTransaction.save();
    if (createTransaction) {
        await User.findByIdAndUpdate(
            senderId,
            { $set: { balance: senderData.balance } },
            { new: true }
        )
        await User.findByIdAndUpdate(
            receiverData._id,
            { $set: { balance: receiverData.balance } },
            { new: true }
        )
    }
    return { senderData, receiverData, createTransaction }
}

const getAllTransactionsService = async () => {
    const transactions = await Transaction.find()
    return transactions
}

const getUserTransactionsService = async (userId) => {
    const user = await User.findById(userId)
    if(!user) throw new HttpException(404, "A user with this userId does not exist")

    const userTransactions = await Transaction.find({ userId: userId })
    return userTransactions
}


module.exports = { depositService, WithdrawalService, transferService, getAllTransactionsService, getUserTransactionsService }