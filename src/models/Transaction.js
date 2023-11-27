const mongoose = require("mongoose")

const TransactionSchema = new mongoose.Schema(
    {   
        userId: {
            type: String,
            required: true
        },
        fromAccountNumber: {
            type: String,
            required: true
        },
        toAccountNumber: {
            type: String,
            required: false
        },
        amount: {
            type: Number,
            required: true
        },
        transactionType: {
            type: String,
            required: true,
            enum: ["Deposit", "Withdrawal", "Transfer"]
        }
    },
    {
        timestamps: true
    }
)

const Transaction = mongoose.model("Transaction", TransactionSchema)


module.exports = Transaction