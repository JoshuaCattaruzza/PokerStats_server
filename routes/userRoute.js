const { authJwt } = require('../middleware');
const controller = require('../controllers/userController');
const express = require('express');
const router = express.Router();

router.use(function (req, res, next) {
	res.header(
		'Access-Control-Allow-Headers',
		'x-access-token, Origin, Content-Type, Accept'
	);
	next();
});

router.get('/public', controller.allAccess);

router.get('/user', [authJwt.verifyToken], controller.userBoard);

router.get(
	'/mod',
	[authJwt.verifyToken, authJwt.isModerator],
	controller.moderatorBoard
);

router.get(
	'/admin',
	[authJwt.verifyToken, authJwt.isAdmin],
	controller.adminBoard
);
module.exports = router;

// const express = require('express');
// const router = express.Router();
// const userModel = require('../models/userModel');
// //register the user
// router.post('/signup', (req, res) => {
// 	const User = {
// 		username: req.body.username,
// 		password: req.body.password,
// 	};
// 	console.log(User);
// 	const inputData = new userModel(User);
// 	inputData
// 		.save()
// 		.then(res.json({ message: 'user created successfully' }))
// 		.catch((err) => {
// 			res.status(400).send(err);
// 		});
// });
// //login
// router.post('/login', (req, res) => {
// 	const User = {
// 		username: req.body.username,
// 		password: req.body.password,
// 	};
// 	const inputData = new userModel(User);
// 	inputData
// 		.save()
// 		.then(res.json({ message: 'user logged in successfully' }))
// 		.catch((err) => {
// 			res.status(400).send(err);
// 		});
// });
// router.get('/', (req, res) => {
// 	userModel.find({}, (err, data) => {
// 		if (err) {
// 			res.json(err);
// 		} else {
// 			res.json(data);
// 		}
// 	});
// });
// router.delete('/:_id', (req, res) => {
// 	const User = req.params._id;
// 	userModel
// 		.findByIdAndDelete(User)
// 		.then(res.json({ message: 'player deleted succesfully' }))
// 		.catch((err) => {
// 			res.status(400).send(err.json());
// 		});
// });

// router.get('/:_id', (req, res) => {
// 	const Id = req.params._id;
// 	console.log(Id);
// 	userModel.findById(Id, (err, data) => {
// 		if (err) {
// 			res.json(err);
// 		} else {
// 			res.json(data);
// 		}
// 	});
// });
// module.exports = router;
