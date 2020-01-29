const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    feedbackmsg: String
});

module.exports = mongoose.model('Feedback', feedbackSchema);