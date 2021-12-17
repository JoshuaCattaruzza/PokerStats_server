const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const gameModel = require('../models/gameModel');


router.post('/', (req, res) => {

	const Game = {
		name: req.body.name,
		start: req.body.start,
		end: req.body.end,
		location: req.body.location,
		blinds: req.body.blinds,
		active: req.body.active,
		total_cash: req.body.total_cash,
		created_by: req.body.player._id,
		players: [
			req.body.player
		]
	};
	if(typeof Game.players[0].starting_stack != "number"){
		return res.status(400).send({message: "stack must be an integer"});
	}else{
		const inputData = new gameModel(Game);
		inputData
		.save()
		.then(()=> { res.status(200).send({message: "game created"})})
		.catch((err) => {
			 res.status(400).send(err);
		});
	}
	
});
router.patch('/join/:_id', (req, res) => {
	var id = { _id: req.params._id }
	const Player = {
		_id: req.body._id,
		username: req.body.username,
		starting_stack: req.body.starting_stack,
		finishing_stack: 0,
		in_game:  req.body.in_game
		
	};
	gameModel.findById(id).exec((err, game) => {
		var players = game.players;
		var duplicatePlayer = false
		players.forEach(player => {
			if (player._id == Player._id) {
				duplicatePlayer=true
				
			}});
			if(duplicatePlayer){
				return res.status(400).send({message:"player already exists"})
			}else{
				gameModel.findByIdAndUpdate(
					id,
					{ $push: { players: Player } },
					(err) => {
						if (err) {
							return res.send(err);
							
						} else {
							return res.send({ message: 'player added to game succesfully' });
							
						}
					}
				);
			}
	}
	);
});
router.patch("/close/:_id", (req, res) =>{
	var id = { _id: req.params._id }

	
	gameModel.findById(id).exec((err, game)=>{
		var status = game.active;
		// console.log(game);
		// game.players.forEach(player => {
		// 	player.in_game=false
		// });
		//SETTARE A IN_GAME:FALSE TUTTI I PLAYER DELLA PARTITA
		gameModel.findByIdAndUpdate(id, {active: !status, end: new Date()}, (err) =>{
			if (err) {
				return res.send(err);
				
			} else {
				return res.send({ message: `changed game status to ${!status}`});
				
			}
		}
		
	)
})
	
})
router.patch("/addon/:_id", (req, res) =>{
	var id = req.params._id;
	var user_id = req.body.user_id;
	var addon = req.body.addOn;
    gameModel.findOne({"_id": id}, {"players":{$elemMatch: {"_id": user_id}}}, (err, game)=>{
		var player =  game.players[0];
		player.addons.push(addon);
		game.save();
		console.log(player.addons);
	});
	res.send("done");
})
router.patch("/leave/:_id", (req, res) =>{
	var id = { _id: req.params._id };

	var user_id = req.body._id;
	var finishing_stack = req.body.finishing_stack;

	console.log(user_id, finishing_stack);

	gameModel.findById(id).then((game=>{
		const player = game.players.id(user_id);
		console.log(player);
		player.set({finishing_stack: finishing_stack, in_game: false});
		return game.save();
	})).then((player)=>{res.send({player})}).catch((err)=>{res.send(err)})
	
})
router.get('/', (req, res) => {

	gameModel.find({}, (err, data) => {
		if (err) {
			res.json(err);
		} else {

			res.json(data);
		}
	});
});
router.get('/:_id', (req, res) => {
	const Id = req.params._id;
	console.log(Id);
	gameModel.findById(Id, (err, data) => {
		if (err) {
			res.json(err);
		} else {
			res.json(data);
		}
	});
});

router.delete('/:_id', (req, res) => {
	const Game = req.params._id;
	gameModel
		.findByIdAndDelete(Game)
		.then(res.json({ message: 'game deleted succesfully' }))
		.catch((err) => {
			res.status(400).send(err.json());
		});
});

module.exports = router;
