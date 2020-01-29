const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    foodName: {
        type: String,
        required: true
    },
    restaurants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    }],
    foodPrice: {
        type: Number,
        required: true
    },
    description: String,
    image: String
});

module.exports = mongoose.model('Food', foodSchema);