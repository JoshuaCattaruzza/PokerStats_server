const { verifySignUp } = require('../middleware');
const controller = require('../controllers/authController');
const express = require('express');
const router = express.Router();
router.use(function (req, res, next) {
	res.header(
		'Access-Control-Allow-Headers',
		'x-access-token, Origin, Content-Type, Accept'
	);
	next();
});

router.post(
	'/signup',
	[verifySignUp.checkDuplicateUsername, verifySignUp.checkRolesExisted],
	controller.signup
);

router.post('/signin', controller.signin);
module.exports = router;
