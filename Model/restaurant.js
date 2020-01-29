const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    location: {
        type: String
    },
    image: String,
});

module.exports = mongoose.model('Restaurant', restaurantSchema);