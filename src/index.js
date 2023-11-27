const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const compression = require("compression")
const morgan = require("morgan")
const cors = require("cors")
const helmet = require("cors")
const authRoutes = require("./routes/auth.routes.js")
const userRoutes = require("./routes/user.routes.js")
const transactionRoutes = require("./routes/transaction.routes.js")
dotenv.config();

mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true },
    { useUnifiedTopology: true }
).then(() => {
    console.log("Database Connection Successful");
}).catch(err => {
    console.log(err);
})

const app = express()
app.use(express.json())
app.use(compression())
app.use(helmet())
app.use(morgan("dev"))
app.use(cors())
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/transactions", transactionRoutes)
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || "Something went wrong"
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Backend Server is currently running on port ${PORT}`);
})