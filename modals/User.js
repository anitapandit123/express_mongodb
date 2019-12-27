//database schemas

const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now

    }
});

const UsersSchema = mongoose.model('User', UserSchema)
