const { registerService, loginService } = require("../services/auth.services")

const register = async (req, res, next) => {
    try {
        const userData = req.body
        const savedUser = await registerService(userData)
        res.status(200).json({
            success: true,
            status: "OK",
            message: "User has been successfully registered",
            accountNumber: `Your account number is ${savedUser.accountNumber}`,
            data: savedUser
        })
    } catch (err) {
        next(err)
    }
}

const login = async (req, res, next) => {
    try {
        const userData = req.body
        const loginData = await loginService(userData)
        res.status(200).json({
            success: true,
            status: "OK",
            message: "You are now logged In",
            data: loginData
        })
    } catch (err) {
        next(err)
    }
}


module.exports = { register, login }