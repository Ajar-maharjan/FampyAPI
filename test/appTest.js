'use strict';
process.env.NODE_ENV = 'test';

const path = require("path");
const chai = require('chai');
const app = require('../index.js')
const request = require('supertest');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const conn = require('../config/dbConnect');
chai.use(chaiHttp);
const body = res.body;

//new admin and ordinary user

let adminUser = {
    email: 'admin',
    name: 'admin',
    phoneNumber: '123456789',
    password: 'admin',
    image: 'admin',
    admin: true
}
let adminJwtToken = '';

let normalUser = {
    email: 'user',
    name: 'user',
    phoneNumber: '987654321',
    password: 'password',
    image: 'user',
};
let userJwtToken = '';

before((done) => {
    conn.connect()
        .then(() => done())
        .catch((err) => done(err));
});
after((done) => {
    conn.close()
        .then(() => done())
        .catch((err) => done(err));
});

//user unit testing

describe('POST /signup admin', () => {
    it('OK, should get valid admin JWT token', (done) => {
        request(app).post('/signup').send(adminUser)
            .then((res) => {
                expect(res.statusCode).to.equal(201)
                expect(res.body).to.contain.property('token');
                adminJwtToken = `Bearer ${res.body.token}`;
                console.log(adminJwtToken);
                done();
            })
            .catch((err) => done(err))
    })
});


describe('POST /signup user', () => {
    it('OK, should get valid user JWT token', (done) => {
        request(app).post('/signup').send(normalUser)
            .then((res) => {
                expect(res.statusCode).to.equal(201)
                expect(res.body).to.contain.property('token');
                userJwtToken = `Bearer ${res.body.token}`;
                console.log(userJwtToken);
                done();
            })
            .catch((err) => done(err))
    })
});

describe('POST /signup', () => {
    it('Fail, should get error empty email and phonenumber', (done) => {
        request(app).post('/signup').send({
                email: '',
                name: 'aabb',
                phoneNumber: '',
                password: 'password'
            })
            .then((res) => {
                expect(res.statusCode).to.equal(500)
                expect(res.body).to.be.empty;
                done();
            })
            .catch((err) => done(err))
    })
});

describe('POST /login admin', () => {
    it('OK, should get valid admin JWT token', (done) => {
        request(app).post('/login')
            .send({
                email: adminUser.email,
                password: adminUser.password
            })
            .then((res) => {
                expect(res.statusCode).to.equal(200)
                expect(res.body).to.contain.property('token');
                done();
            })
            .catch((err) => done(err))
    })
});

describe('POST /login normal user', () => {
    it('OK, should get valid user JWT token', (done) => {
        request(app).post('/login')
            .send({
                email: normalUser.email,
                password: normalUser.password
            })
            .then((res) => {
                expect(res.statusCode).to.equal(200)
                expect(res.body).to.contain.property('token');
                done();
            })
            .catch((err) => done(err))
    })
});

describe('POST /login', () => {
    it('Fail, should error logging incorrect email or password', (done) => {
        request(app).post('/login')
            .send({
                email: 'wrongemail',
                password: 'wrongpassword'
            })
            .then((res) => {
                expect(res.statusCode).to.equal(401);
                expect(res.body).to.be.empty;
                done();
            })
            .catch((err) => done(err))
    })
});

describe('GET /me', () => {
    it('OK, should provide user details', (done) => {
        request(app).get('/me')
            .set('Authorization', userJwtToken)
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property('_id');
                expect(body).to.contain.property('email', 'user');
                expect(body).to.contain.property('image', 'user');
                expect(body).to.contain.property('name', 'user');
                expect(body).to.contain.property('phoneNumber', '987654321');
                done();
            })
            .catch((err) => done(err))
    })
});

describe('GET /me', () => {
    it('Fail, wrong bearer token', (done) => {
        request(app).get('/me')
            .set('Authorization', 'wrong bearer token')
            .then((res) => {
                expect(res.statusCode).to.equal(500);
                expect(res.body).to.be.empty;
                done();
            })
            .catch((err) => done(err))
    })
});

describe('GET /me', () => {
    it('OK, should update user details', (done) => {
        request(app).put('/me')
            .set('Authorization', userJwtToken)
            .send({
                email: 'editeduser',
                name: 'editeduser',
                phoneNumber: 'editeduser',
                image: 'editeduser'
            })
            .then((res) => {
                const body = res.body;
                expect(res.statusCode).to.equal(200);
                expect(body).to.contain.property('_id');
                expect(body).to.contain.property('email', 'editeduser');
                expect(body).to.contain.property('image', 'editeduser');
                expect(body).to.contain.property('name', 'editeduser');
                expect(body).to.contain.property('phoneNumber', 'editeduser');
                done();
            })
            .catch((err) => done(err))
    })
});

describe('GET /me', () => {
    it('Fail, wrong bearer token', (done) => {
        request(app).put('/me')
            .set('Authorization', 'wrong token')
            .send({
                email: 'editeduser2',
                name: 'editeduser2',
                phoneNumber: 'editeduser2',
                image: 'editeduser2'
            })
            .then((res) => {
                expect(res.statusCode).to.equal(500);
                expect(res.body).to.be.empty;
                done();
            })
            .catch((err) => done(err))
    })
});

describe('POST and PUT /user/change ', () => {
    it('OK, should validate user details and change password', (done) => {
        request(app).post('/user/change')
            .set('Authorization', userJwtToken)
            .send({
                password: normalUser.password
            })
            .then((res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.contain.property('status', 'Correct password!');
                request(app).put('/user/change')
                    .set('Authorization', userJwtToken)
                    .send({
                        password: 'newpassword'
                    })
                    .then((resp) => {
                        const body = resp.body;
                        expect(resp.statusCode).to.equal(200);
                        expect(body).to.contain.property('_id');
                        expect(body).to.contain.property('email');
                        expect(body).to.contain.property('image');
                        expect(body).to.contain.property('name');
                        expect(body).to.contain.property('phoneNumber');
                        expect(body).to.contain.property('status', 'password changed');
                    })
                    .catch((err) => done(err))
                done();
            })
            .catch((err) => done(err))

    })
});


describe('POST /user/change ', () => {
    it('Fail, Wrong old password changing password', (done) => {
        request(app).post('/user/change')
            .set('Authorization', userJwtToken)
            .send({
                password: 'wrong password'
            })
            .then((res) => {
                expect(res.statusCode).to.equal(401);
                expect(res.body).to.be.empty;
                done();
            })
            .catch((err) => done(err))

    })
});

describe('PUT /user/change ', () => {
    it('Fail, Wrong bearer token changing password', (done) => {
        request(app).put('/user/change')
            .set('Authorization', 'wrong bearer token')
            .send({
                password: 'newpassword'
            })
            .then((res) => {
                expect(res.statusCode).to.equal(500);
                expect(res.body).to.be.empty;
                done();
            })
            .catch((err) => done(err))
    })
});

// feedback unit testing

describe('POST /feedback', () => {
    it('OK, send feedback to the server', (done) => {
        request(app).post('/feedback')
            .send({
                email: "email.com",
                feedbackmsg: "feedback message"
            })
            .then((res) => {
                expect(res.statusCode).to.equal(201);
                expect(res.body).to.contain.property('status', 'Feedback sent successfully');
                done();
            })
            .catch((err) => done(err));
    })
});

describe('POST /feedback', () => {
    it('Fail, empty email', (done) => {
        request(app).post('/feedback')
            .send({
                email: "",
                feedbackmsg: "feedback message"
            })
            .then((res) => {
                const body = res.body;
                expect(res.statusCode).to.equal(500);
                expect(body).to.be.empty;
                done();
            })
            .catch((err) => done(err));
    })
});

describe('GET /feedback', () => {
    it('OK, should provide all feedbacks', (done) => {
        request(app).get('/feedback')
            .set('Authorization', adminJwtToken)
            .then((res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.not.be.empty;
                done();
            })
            .catch((err) => done(err))
    })
});

describe('GET /feedback', () => {
    it('Fail, not admin bearer token', (done) => {
        request(app).get('/feedback')
            .set('Authorization', userJwtToken)
            .then((res) => {
                expect(res.statusCode).to.equal(403);
                expect(res.body).to.be.empty;
                done();
            })
            .catch((err) => done(err))
    })
});

//image upload unit testing

describe('POST /upload', () => {
    it('OK, send imagefile to upload', (done) => {
        request(app).post('/upload')
            .set('Content-Type', 'multipart/form-data')
            .attach('imageFile', path.resolve(__dirname, "resources/thomas.jpeg"))
            .then((res) => {
                const body = res.body;
                expect(res.statusCode).to.equal(200);
                expect(body).to.contain.property('fieldname');
                expect(body).to.contain.property('originalname');
                expect(body).to.contain.property('encoding');
                expect(body).to.contain.property('destination');
                expect(body).to.contain.property('filename');
                expect(body).to.contain.property('path');
                expect(body).to.contain.property('size');
                done();
            })
            .catch((err) => done(err));
    })
});

describe('POST /upload', () => {
    it('Fail, send invalid non image file', (done) => {
        request(app).post('/upload')
            .set('Content-Type', 'multipart/form-data')
            .attach('imageFile', path.resolve(__dirname, "resources/thomas.pdf"))
            .then((res) => {
                expect(res.statusCode).to.equal(500);
                expect(res.body).to.be.empty;
                done();
            })
            .catch((err) => done(err));
    })
});