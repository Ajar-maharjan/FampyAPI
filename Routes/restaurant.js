const express = require('express');
const Restarant = require('../Model/restaurant');
const auth = require('../auth');

const router = express.Router();

router.route('/restaurant')
    .get((req, res, next) => {
        Restarant.find({})
            .then((restaurant) => {
                res.json(restaurant);
            })
            .catch(next);
    })
    .post(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        Restarant.create(req.body)
            .then((restaurant) => {
                res.statusCode = 201;
                res.json(restaurant);
            })
            .catch(next);
    })
    .put((req, res) => {
        res.statusCode = 405;
        res.json({
            message: "Method not allowed"
        });
    })
    .delete((req, res) => {
        res.statusCode = 405;
        res.json({
            message: "Method not allowed"
        });
    })

router.route('/restaurant/:id')
    .put(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        Restarant.findByIdAndUpdate(
                req.params.id, {
                    $set: req.body
                })
            .then((restaurant) => {
                if (restaurant == null) throw new Error("Restaurant not found!");
                res.json(restaurant);
            }).catch(next);
    })

    .delete(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        Restarant.findOneAndDelete({
                _id: req.params.id
            })
            .then((restaurant) => {
                if (restaurant == null) throw new Error("Restaurant not found!");
                res.json(restaurant);
            }).catch(next);
    })
    .get()
    .post();

module.exports = router;