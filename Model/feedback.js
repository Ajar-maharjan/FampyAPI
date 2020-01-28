const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    feedbackmsg: String
});

module.exports = mongoose.model('Feedback', feedbackSchema);