const express = require('express');
const mockupfunc = require('../util/mockup-response.js').mockupfunc;
const {register} = require('../controllers/auth.js');

// const {register, login, getMe, logout} = require('../controllers/auth.js');

const router = express.Router();

// const {protect} = require('../middleware/auth');

// router.post('/register', register);
// router.post('/login', login);
// router.get('/me', protect, getMe);
// router.get('/logout', protect, logout)


router.route('/login')
router.route('/register').post(register)


module.exports = router;