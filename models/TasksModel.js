import mongoose, { Schema } from "mongoose";
import User from "./UsersModel.js";

const Task = mongoose.Schema({
    taskName: {
        type: String,
        required: true
    },
    dateTask: {
        type: Date,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

export default mongoose.model('Tasks', Task);