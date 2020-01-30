const express = require('express');
const Feedback = require('../Model/feedback');
const auth = require('../auth');

const router = express.Router();

router.route('/feedback')
    .post((req, res, next) => {
        Feedback.create(req.body)
            .then((feedback) => {
                res.statusCode = 201;
                res.json(feedback);
            })
            .catch(next);
    })
    .get(auth.verifyUser,auth.verifyAdmin,(req, res, next) => {
        Feedback.find({})
            .then((feedback) => {
                res.json(feedback);
            })
            .catch(next);
    })
    .put()
    .delete();


module.exports = router;