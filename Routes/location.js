const express = require('express');
const Location = require('../Model/location');
const auth = require('../auth');

const router = express.Router();

router.route('/mylocation')
    .get(auth.verifyUser, (req, res, next) => {
        Location.find({
                users: req.user._id
            })
            .then((location) => {
                res.json(location);
            })
            .catch(next);
    })
    .post(auth.verifyUser, (req, res, next) => {
        let newLocation = new Location(req.body);
        newLocation.users = req.user._id
        newLocation.save()
            .then((location) => {
                res.statusCode = 201;
                res.json(location);
            })
            .catch(next);
    })


router.route('/mylocation/:id')
    .get(auth.verifyUser, (req, res, next) => {
        Location.findOne({
                _id: req.params.id
            })
            .then((location) => {
                res.json(location);
            })
            .catch(next);
    })
    .put(auth.verifyUser, (req, res, next) => {
        Location.findOneAndUpdate({
                _id: req.params.id,
                users: req.user._id
            }, {
                $set: req.body
            })
            .then((location) => {
                if (location == null) throw new Error("Location not found!");
                res.json(location);
            }).catch(next)
    })

    .delete(auth.verifyUser, (req, res, next) => {
        Location.findOneAndDelete({
                users: req.users._id,
                _id: req.params.id
            })
            .then((location) => {
                if (location == null) throw new Error("Location not found!");
                res.json(location);
            }).catch(next);
    })


module.exports = router;