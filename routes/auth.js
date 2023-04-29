const express = require('express');
const mockupfunc = require('../util/mockup-response.js').mockupfunc;

const {register, login, logout} = require('../controllers/auth.js');

const router = express.Router();

const {protect} = require('../middleware/auth');

router.route('/login').post(login)
router.route('/register').post(register)
router.route('/logout').get(protect,logout)


module.exports = router;