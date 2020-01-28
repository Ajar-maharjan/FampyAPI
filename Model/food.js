const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    foodName: {
        type: String,
        required: true
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    foodPrice: {
        type: Number,
        required: true
    },
    description: String,
    image: String
});

module.exports = mongoose.model('Food', foodSchema);