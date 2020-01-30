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
    .post((req, res, next) => {
        let newLocation = new Location(req.body);
        newLocation.save()
            .then((location) => {
                res.statusCode = 201;
                res.json(location);
            })
            .catch(next);
    })


router.route('/mylocation/:id')
    .put(auth.verifyUser, (req, res, next) => {
        Location.findOne({
                _id: req.params.id,
                users: req.user._id
            })
            .then((location) => {
                if (location == null) {
                    let err = new Error("Location not found");
                    err.status = 404;
                    return next(err);
                } else {
                    Location.findByIdAndUpdate(
                            req.params.id, {
                                $set: req.body
                            })
                        .then((location) => {
                            if (location == null) throw new Error("Food not found!");
                            res.json(location);
                        }).catch(next)
                }
            }).catch(next);

    })
    .delete(auth.verifyUser, (req, res, next) => {
        Location.findOneAndDelete({
                users: req.users._id,
                _id: req.params.id
            })
            .then((location) => {
                if (location == null) throw new Error("Food not found!");
                res.json(location);
            }).catch(next);
    })


module.exports = router;