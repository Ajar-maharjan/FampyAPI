const express = require('express');
const Order = require('../Model/order');
const auth = require('../auth');

const router = express.Router();

router.post("/order/:id", auth.verifyUser, async (req, res) => {
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
                    name,
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
                    name,
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
});

module.exports = router;

