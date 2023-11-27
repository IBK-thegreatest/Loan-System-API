const { HttpException } = require("../exceptions/http.exception")
const bcrypt = require("bcrypt")
const { schema } = require("../middlewares/validation.middleware")
const User = require("../models/User")

const getAllUserService = async () => {
    const users = await User.find()
    return users
}

const getOneUserService = async (userId) => {
    const user = await User.findById(userId)
    if(!user) throw new HttpException(404, "A user with this userId does not exist")
    return user
}

const updateUserService = async (userId, userData) => {
    const user = await User.findById(userId)
    if(!user) throw new HttpException(404, "A user with this userId does not exist")
    if(userData.email) throw new HttpException(401, "You are not allowed to change your email address")
    if (userData.password) {
        if (!schema.validate(userData.password)) throw new HttpException(403, "Password must contain uppercase, lowercase, no whitespaces and at least 2 digits")
        const salt = await bcrypt.genSalt(10)
        userData.password = await bcrypt.hash(userData.password, salt)
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: userData },
            { new: true }
        )
        return updatedUser
    } else {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: userData },
            { new: true }
        )
        return updatedUser
    }
}

const deleteUserService = async (userId) => {
    const user = await User.findById(userId)
    if (!user) throw new HttpException(404, "A user with this userId does not exist")

    await User.findByIdAndDelete(userId)
    return user
}

const passwordResetService = async (userData) => {
    const user = await User.findOne({ email: userData.email })
    if (!user) throw new HttpException(404, "A user with this userId does not exist")
    function generateRandomAlphanumeric(length) {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let randomString = "";

        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          randomString += characters.charAt(randomIndex);
        }

        return randomString;
    }
    const email = userData.email
    const resetPassword = generateRandomAlphanumeric(10)
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(resetPassword, salt)
    await User.findOneAndUpdate(
        { email },
        { $set: { password: hashedPassword } },
        { new: true }
    )
    return resetPassword
}


module.exports = { getAllUserService, getOneUserService, updateUserService, deleteUserService, passwordResetService }