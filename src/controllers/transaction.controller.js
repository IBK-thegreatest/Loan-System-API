const { depositService, WithdrawalService, transferService, getAllTransactionsService, getUserTransactionsService } = require("../services/transaction.services")

//DEPOSIT FUNDS INTO YOUR ACCOUNT
const deposit = async (req, res, next) => {
    try {
        const userId = req.params.id
        const transactionData = req.body
        const { createTransaction, user } = await depositService(userId, transactionData)
        res.status(200).json({
            success: true,
            status: "OK",
            message: `An Amount of ${createTransaction.amount} has been deposited into your account. Your Account Balance is now ${user.balance}`,
            data: createTransaction
        })
    } catch (err) {
        next(err)
    }
}

const withdrawal = async (req, res, next) => {
    try {
        const userId = req.params.id
        const transactionData = req.body
        const { createTransaction, user } = await WithdrawalService(userId, transactionData)
        res.status(200).json({
            success: true,
            status: "OK",
            message: `An Amount of ${createTransaction.amount} has been withdrawed from your account. Your Account Balance is now ${user.balance}`,
            data: createTransaction
        })
    } catch (err) {
        next(err)
    }
}

const transfer = async (req, res, next) => {
    try {
        const senderId = req.params.id
        const transactionData = req.body
        const { senderData, receiverData, createTransaction } = await transferService(senderId, transactionData)
        res.status(200).json({
            success: true,
            status: "OK",
            message: `You have transferred an amount of ${createTransaction.amount} to ${receiverData.firstName} ${receiverData.lastName}. Your Account balance is now ${senderData.balance}`,
            senderData: senderData,
            receiverData: receiverData,
            transferData: createTransaction
        })
    } catch (err) {
        next(err)
    }
}

const getAllTransactions = async (req, res, next) => {
    try {
        const transactions = await getAllTransactionsService();
        res.status(200).json(transactions)
    } catch (err) {
        next(err)
    }
}

const getUserTransactions = async (req, res, next) => {
    try {
        const userId = req.params.id
        const transactions = await getUserTransactionsService(userId)
        res.status(200).json(transactions)
    } catch (err) {
        next(err)
    }
}


module.exports = { deposit, withdrawal, transfer, getAllTransactions, getUserTransactions }