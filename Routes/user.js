const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Model/user');
const auth = require('../auth');

const router = express.Router();


module.exports = router;
