const mongoose  = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unqiue: true
        },
        password: {
            type: String,
            required: true
        },
        accountNumber: {
            type: Number,
            required: true,
            unique: true,
            validate: {
                validator: function(value) {
                    // Use a regular expression to check for exactly 10 digits
                    return /^\d{10}$/.test(value);
                },
                message: 'Account number must be a 10-digit string.'
            }
        },
        balance: {
            type: Number,
            default: 0
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", UserSchema)


module.exports = User