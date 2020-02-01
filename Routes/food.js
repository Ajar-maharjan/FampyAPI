const express = require('express');
const Food = require('../Model/food');
const auth = require('../auth');
const cors = require('cors');

const router = express.Router();

router.route('/food')
    .get((req, res, next) => {
        Food.find({})
            .then((food) => {
                res.json(food);
            })
            .catch(next);
    })
    .post(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        let newFood = new Food(req.body);
        newFood.save()
            .then((food) => {
                res.statusCode = 201;
                res.json(food);
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
router.route('/food/:id')
    .put(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        Food.findByIdAndUpdate(
                req.params.id, {
                    $set: req.body
                })
            .then((food) => {
                if (food == null) throw new Error("Food not found!");
                res.json(food);
            }).catch(next);
    })
    .delete(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        Food.findOneAndDelete({
                _id: req.params.id
            })
            .then((food) => {
                if (food == null) throw new Error("Food not found!");
                res.json(food);
            }).catch(next);
    })
    .get((req, res, next) => {
        Food.findOne({
                _id: req.params.id
            })
            .then((food) => {
                res.json(food);
            })
            .catch(next)
    })
    .post();

router.get('/restaurant/food/:id', (req, res, next) => {
    Food.find({
            restaurants: req.params.id
        })
        .then((food) => {
            res.json(food);
        })
        .catch(next);
});

router.get('/searchfood/:search', cors(), (req, res, next) => {
    let searchText = req.params.search;
    Food.find({
            $text: {
                $search: searchText
            }
        })
        .then((food) => {
            res.json(food);
        })
        .catch(next);
});
module.exports = router;