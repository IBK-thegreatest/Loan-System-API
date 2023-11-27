const express = require("express")
const { verifyUser, verifyAdmin } = require("../middlewares/auth.middleware")
const { deposit, withdrawal, transfer, getAllTransactions, getUserTransactions } = require("../controllers/transaction.controller")
const router = express.Router()

//DEPOSIT TO YOUR OWN ACCOUNT
router.post("/:id/deposit", verifyUser, deposit)

//WITHDRAWING FUNDS FROM YOUR OWN ACCOUNT
router.post("/:id/withdrawal", verifyUser, withdrawal)

//TRANSFERING FUNDS FROM ONE ACCOUNT TO ANOTHER
router.post("/:id/transfer", verifyUser, transfer)

//GET ALL TRANSACTIONS
router.get("/", verifyAdmin, getAllTransactions)

//GET USER TRANSACTIONS
router.get("/:id", verifyUser, getUserTransactions)



module.exports = router