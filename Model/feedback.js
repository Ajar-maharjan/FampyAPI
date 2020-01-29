const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true,"Email address is required"]
    },
    feedbackmsg: String
});

module.exports = mongoose.model('Feedback', feedbackSchema);