import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const { Schema, Types } = mongoose;

const userSchema = new Schema(
    {
        first_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            index: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },

        age: {
            type: Number,
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
            required: true,
        },
        cart_id: {
            type: Types.ObjectId,
            ref: "Cart",
            required: false,
        },
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
