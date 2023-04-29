const express = require('express');

// const {register, login, getMe, logout} = require('../controllers/auth.js');
const {  login } = require("../controllers/auth.js");
const router = express.Router();

// const {protect} = require('../middleware/auth');

// router.post('/register', register);
// router.post('/login', login);
// router.get('/me', protect, getMe);
// router.get('/logout', protect, logout)


router.route('/login').post(login)
router.route('/register')


module.exports = router;