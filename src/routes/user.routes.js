const express = require("express")
const { verifyAdmin, verifyUser } = require("../middlewares/auth.middleware")
const { getAllUsers, getOneUser, updateUser, deleteUser, passwordReset } = require("../controllers/user.controller")
const router = express.Router()

//GET ALL USER
router.get("/", verifyAdmin, getAllUsers)

//GET ONE USER
router.get("/:id", verifyUser, getOneUser)

//UPDATE USER INFORMATION
router.put("/:id", verifyUser, updateUser)

//DELETE USER INFORMATION
router.delete("/:id", verifyUser, deleteUser)

//PASSWORD RESET OPTION
router.post("/password-reset", passwordReset)


module.exports = router