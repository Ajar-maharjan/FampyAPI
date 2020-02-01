const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    foodName: {
        type: String,
        index: true,
        required: [true,"Food name is required"]
    },
    restaurants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: [true,"Restaurant is required"]
    }],
    foodPrice: {
        type: Number,
        required: [true,"Food Price is required"]
    },
    description: String,
    image: String
});

module.exports = mongoose.model('Food', foodSchema);