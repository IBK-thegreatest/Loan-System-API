const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const { HttpException } = require("../exceptions/http.exception")
const { emailValidator, schema } = require("../middlewares/validation.middleware")

const registerService = async (userData) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(userData.password, salt)
    //CHECKING IF PASSWORD ALREADY EXISTS
    const alreadyExistsUser = await User.findOne({ email: userData.email })
    if (alreadyExistsUser) throw new HttpException(409, "This User already Exists")

    //Generating a 10 digit account number for a new user anytime a user registers
    let accountNumber;
    let isUnique = false
    while (!isUnique) {
        accountNumber = String(Math.floor(1000000000 + Math.random() * 9000000000));
        //Checking if the account number is unique
        const existingUserWithAccountNumber = await User.findOne({ accountNumber: accountNumber })
        if (!existingUserWithAccountNumber) {
            isUnique = true
        }
    }
    const data = {
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: hashedPassword,
        accountNumber: accountNumber,
        isAdmin: userData.isAdmin
    }
    if (userData.username.length < 6) {
        throw new HttpException(403, "Username should be at least 6 characters long")
    } else if (!emailValidator.validate(userData.email)) {
        throw new HttpException(403, "Email Format Incorrect, Please enter an email in the format foo@bar.com")
    } else if (!schema.validate(userData.password)) {
        throw new HttpException(403, "Password must contain uppercase letter, lowercase letter, no whitespaces and at least 2 digits")
    } else {
        const newUser = new User(data)
        const createUser = await newUser.save();
        return createUser
    }
}

const loginService = async (userData) => {
    const user = await User.findOne({ email: userData.email })
    if (!user) throw new HttpException(404, "User not found!!!")
    //CHECKING IF THE PASSWORD IS CORRECT
    const isPasswordCorrect = await bcrypt.compare(userData.password, user.password)
    if (!isPasswordCorrect) throw new HttpException(403, "Username and Password don't match")

    const dataStoredInToken = {
        id: user._id,
        isAdmin: user.isAdmin
    }
    const accessToken = jwt.sign(dataStoredInToken, process.env.JWT_SEC, { expiresIn: "30d" })
    const loginData = {
        id: user._id,
        isAdmin: user.isAdmin,
        token: accessToken
    }
    return loginData
}


module.exports = { registerService, loginService }