const express = require('express');
const Order = require('../Model/order');
const auth = require('../auth');

const router = express.Router();

router.get("/order", auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
    Order.find({})
        .then((order) => {
            res.json(order);
        })
        .catch(next);
});
router.route("/order/:id")
    .post(auth.verifyUser, async (req, res) => {
        const {
            foodId,
            quantity,
            price
        } = req.body;

        const locationId = req.params.id;
        const userId = req.user._id;
        try {
            let order = await Order.findOne({
                users: userId
            });
            if (order) {
                let itemIndex = order.foods.findIndex(p => p.foodId == foodId);
                if (itemIndex > -1) {
                    let orerItem = order.foods[itemIndex];
                    orerItem.quantity = quantity;
                    order.foods[itemIndex] = orerItem;
                } else {
                    order.foods.push({
                        foodId,
                        quantity,
                        price
                    });
                }
                order = await order.save();
                return res.status(201).send(order);
            } else {
                const newOrder = await Order.create({
                    users: userId,
                    foods: [{
                        foodId,
                        quantity,
                        price
                    }],
                    locations: locationId
                });
                return res.status(201).send(newOrder);
            }
        } catch (err) {
            console.log(err);
            res.status(500).send("Something went wrong");
        }
    })
    .put(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        Order.findByIdAndUpdate({
                _id: req.params.id
            }, {
                active: req.body.active
            })
            .then(() => {
                Order.findOne({
                        _id: req.params.id
                    })
                    .then((order) => {
                        res.status(200);
                        if (order.active == false)
                            res.json({
                                status: 'Delivered successfully'
                            })
                        else {
                            res.json({
                                status: 'Order reactivated'
                            })
                        }
                    })
            })
            .catch(next)
    })


module.exports = router;

/**
 * @swagger
 * /order:
 *  get:
 *   tags:
 *    - Food order
 *   description: Retrieve all order of users by admin
 *   produces:
 *    - application/json
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: Retrieved successfully
 *    401:
 *     description: Bearer token error or unauthorized
 *    500:
 *     description: Internal server error/ token could not be verified
 *    403:
 *     description: Forbidden
 */

/**
 * @swagger
 * /order/{id}:
 *  post:
 *   tags:
 *    - Food order
 *   description: Order food and add food to basket
 *   produces:
 *    - application/json
 *   consumes:
 *    - application/json
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - name: id
 *      in: path
 *      required: true
 *      description: Location Id
 *    - name: foods
 *      in: body
 *      type: string
 *      description: food order details
 *      schema:
 *        type: object
 *        required:
 *          - foodId
 *        properties:
 *          foodId:
 *            type: string
 *          quantity:
 *            type: number
 *          price:
 *            type: number
 *   responses:
 *    201:
 *     description: Created successfully
 *    500:
 *     description: Something went wrong
 *    401:
 *     description: Bearer token error or unauthorized
 *  put:
 *   tags:
 *    - Food order
 *   description: Change status of the user order by admin
 *   produces:
 *    - application/json
 *   consumes:
 *    - application/json
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - name: id
 *      in: path
 *      required: true
 *      description: Order Id
 *    - name: status
 *      in: body
 *      type: string
 *      description: order status
 *      schema:
 *        type: object
 *        required:
 *          - active
 *        properties:
 *          active:
 *            type: boolean
 *   responses:
 *    200:
 *     description: Delivery status
 *    401:
 *     description: Bearer token error or unauthorized
 *    500:
 *     description: Internal server error/ token could not be verified
 *    403:
 *     description: Forbidden
 */