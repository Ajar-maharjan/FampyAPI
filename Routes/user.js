const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Model/user');
const auth = require('../auth');

const router = express.Router();


router.post('/signup', (req, res, next) => {
    let password = req.body.password;
    bcrypt.hash(password, 10, function (err, hash) {
        if (err) {
            let err = new Error('Could not hash!');
            err.status = 500;
            return next(err);
        }
        User.create({
            email: req.body.email,
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            password: hash,
            image: req.body.image
        }).then((user) => {
            let token = jwt.sign({
                _id: user._id
            }, "this is secret key");
            res.json({
                status: "Signup success!",
                token: token
            });
        }).catch(next);
    });
});

router.post('/login', (req, res, next) => {
    User.findOne({
            email: req.body.email
        })
        .then((user) => {
            if (user == null) {
                let err = new Error("User not found!");
                err.status = 401;
                return next(err);
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then((isMatch) => {
                        if (!isMatch) {
                            let err = new Error('Incorrect password');
                            err.status = 401;
                            return next(err);
                        }
                        let token = jwt.sign({
                            _id: user._id
                        }, process.env.SECRET);
                        res.json({
                            status: 'Login success!',
                            token: token
                        });
                    }).catch(next);
            }

        }).catch(next);
})

router.get('/me',auth.verifyUser,(req,res,next)=>{
    res.json({
        _id:req._id,
        email:req.user.email,
        image:req.user.image,
        name: req.user.name,
        phoneNumber: req.user.phoneNumber
    });
});

module.exports = router;
