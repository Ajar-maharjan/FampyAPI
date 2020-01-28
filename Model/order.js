const mongoose = require('mongoose');

const orderschema = new mongoose.Schema({
    foods: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food'
    }],
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    quantity: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderschema);