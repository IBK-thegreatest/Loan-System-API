const { getAllUserService, getOneUserService, updateUserService, deleteUserService, passwordResetService } = require("../services/user.services")

//GET ALL USERS
const getAllUsers = async (req, res, next) => {
    try {
        const users = await getAllUserService()
        res.status(200).json(users)
    } catch (err) {
        next(err)
    }
}

//GET ONE USER
const getOneUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        const user = await getOneUserService(userId)
        res.status(200).json(user)
    } catch (err) {
        next(err)
    }
}

//UPDATE USER INFORMATION
const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        const userData = req.body
        const updateUserData = await updateUserService(userId, userData)
        res.status(200).json({
            success: true,
            status: "OK",
            message: "User Information has been successfully updated",
            data: updateUserData
        })
    } catch (err) {
        next(err)
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        await deleteUserService(userId)
            .then(() => {
                res.status(200).json({
                    success: true,
                    status: "OK",
                    message: "User has been successfully deleted"
                })
            }).catch(err => {
                res.status(500).json({
                    success: false,
                    status: 500,
                    message: "Something went wrong!!!"
                })
            })
    } catch (err) {
        next(err)
    }
}

const passwordReset = async (req, res, next) => {
    try {
        const userData = req.body
        const resetPassword = await passwordResetService(userData)
        res.status(200).json({
            success: true,
            status: "OK",
            message: "A New Password has been generated for you. You can log into the App",
            newPassword: resetPassword
        })
    } catch (err) {
        next(err)
    }
}


module.exports = { getAllUsers, getOneUser, updateUser, deleteUser, passwordReset }