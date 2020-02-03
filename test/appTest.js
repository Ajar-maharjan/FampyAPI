process.env.NODE_ENV = 'test';
const app = require('../index.js')
const chai = require('chai');
const request = require('supertest');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const conn = require('../config/dbConnect');

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
    it('OK,send feedback to the server', (done) => {
        request(app).post('/feedback')
            .send({
                email: "email.com",
                feedbackmsg: "feedback message"
            })
            .then((res) => {
                const body = res.body;
                expect(res.statusCode).to.equal(201);
                expect(body).to.contain.property('status', 'Feedback sent successfully');
                done();
            })
            .catch((err) => done(err));
    })
})