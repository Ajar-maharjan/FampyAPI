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
        let newUser = new User(req.body);
        newUser.password = hash;
        newUser.save()
            .then((user) => {
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
                let err = new Error("Incorrect username or password");
                err.status = 401;
                return next(err);
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then((isMatch) => {
                        if (!isMatch) {
                            let err = new Error('Incorrect username or password');
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

router.route('/me')
    .get(auth.verifyUser, (req, res, next) => {
        res.json({
            _id: req.user._id,
            email: req.user.email,
            image: req.user.image,
            name: req.user.name,
            phoneNumber: req.user.phoneNumber
        })
    })
    .put(auth.verifyUser, (req, res, next) => {
        User.findByIdAndUpdate({
                _id: req.user._id
            }, req.body)
            .then(() => {
                User.findOne({
                        _id: req.user._id
                    })
                    .then((user) => {
                        res.json(user)
                    })
            })
            .catch(next)
    });


router.route('/user/change')
    .post(auth.verifyUser, (req, res, next) => {
        User.findOne({
                email: req.body.email
            })
            .then((user) => {
                if (user == null) {
                    let err = new Error("Incorrect username");
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
                            res.json({
                                status: 'correct password',
                            });
                        }).catch(next);
                }
            })
            .catch(next)

    })
    .put(auth.verifyUser, (req, res, next) => {
        let password = req.body.password;
        bcrypt.hash(password, 10, function (err, hash) {
            if (err) {
                let err = new Error('Could not hash!');
                err.status = 500;
                return next(err);
            }
            User.findByIdAndUpdate({
                    _id: req.user._id
                }, {
                    password: hash
                })
                .then(() => {
                    User.findOne({
                            _id: req.user._id
                        })
                        .then((user) => {
                            res.json(user)
                        })
                })
                .catch(next)

        });
    });


module.exports = router;