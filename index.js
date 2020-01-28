const cors = require('cors');
const dotenv = require('dotenv');
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const userRouter = require('./Routes/user');
const foodRouter = require('./Routes/food');
const orderRouter = require('./Routes/order');
const uploadRouter = require('./Routes/upload');
const locationRouter = require('./Routes/location');
const feedbackRouter = require('./Routes/feedback');


// const auth = require('./auth');

dotenv.config();
const app = express();
app.use(express.json());
app.options('*', cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + "/public"));

mongoose.connect(process.env.URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then((db) => {
        console.log("Successfully connected to MongodB server");
    }, (err) => console.log(err));

app.use('/upload', uploadRouter);
app.use('/', foodRouter);
app.use('/', userRouter);
app.use('/', orderRouter);
app.use('/', locationRouter);
app.use('/', feedbackRouter);
// app.use(auth.verifyUser);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500);
    res.json({
        status: err.message
    });
});

app.listen(process.env.PORT, () => {
    console.log(`App is running at localhost:${process.env.PORT}`);
});