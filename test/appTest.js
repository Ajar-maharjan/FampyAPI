const chai = require('chai');
const request = require('supertest');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const conn = require('../config/dbConnect');
const userRouter = require('../Routes/user');
const foodRouter = require('../Routes/food');
const orderRouter = require('../Routes/order');
const uploadRouter = require('../Routes/upload');
const locationRouter = require('../Routes/location');
const feedbackRouter = require('../Routes/feedback');
const restaurantRouter = require('../Routes/restaurant');

chai.use(chaiHttp);

describe('POST /feedback', () => {
    before((done) => {
        conn.connect()
            .then(() => done())
            .catch((err) => done(err));
    })
    after((done) => {
        conn.close()
            .then(() => done())
            .catch((err) => done(err));
    })
    it('send feedback to the server', (done) => {
        request(feedbackRouter).post('/feedback')
            .send({
                email: "email.com",
                feedbackmsg: "feedback message"
            })
            .then((res) => {
                const body = res.body;
                expect(body).to.contain("Feedback sent successfully");
                done();
            })
    })
})