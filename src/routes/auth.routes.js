const express = require("express")
const { register, login } = require("../controllers/auth.controller")
const router = express.Router()

//REGISTER A USER
router.post("/register", register)

//LOGIN TO AN EXISTING USER
router.post("/login", login)


module.exports = router