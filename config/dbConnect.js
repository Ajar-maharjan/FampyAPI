const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
function connect() {
    return new Promise((resolve) => {
        mongoose.connect(process.env.URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true
            })
            .then(() => {
                console.log("Successfully connected to MongodB server");
            }, (err) => console.log(err));
        resolve();
    })
}

function close(){
    return mongoose.disconnect();
}

module.exports = {connect,close};