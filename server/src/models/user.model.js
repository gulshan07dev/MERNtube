import { Schema, model } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    username: {
        type: String,
        unique: [true, "username must be unique"],
        required: [true, "username is required"],
        trim: true,
        lowercase: true,
        index: true
    },
    fullName: {
        type: String,
        required: [true, "fullName is required"],
        minLength: [3, "fullName must be at least 4 char"],
        maxLength: [20, "fullName must be less than 20 char"],
        trim: true,
        index: true,
    },
    email: {
        type: String,
        unique: [true, "Email already registered"],
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [4, "Password must be at least 4 char"],
        maxLength: [7, "Password must be less than 8 char"],
        trim: true,
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    },
    avatar: {
        type: String
    },
    coverImage: {
        type: String
    },
    refreshToken: {
        type: String,
    },
    isWatchHistoryPaused: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        username: this.username,
        fullName: this.fullName,
        email: this.email
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}

export const User = model("User", userSchema);