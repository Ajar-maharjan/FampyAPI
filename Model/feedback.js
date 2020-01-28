const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    feedbackmsg: String
});

module.exports = mongoose.model('Feedback', feedbackSchema);