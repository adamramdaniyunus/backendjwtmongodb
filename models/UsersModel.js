import mongoose from "mongoose";


const User = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    refresh_token: {
        type: String,
    }
});

export default mongoose.model('Users', User);