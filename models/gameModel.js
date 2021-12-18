const mongoose = require('mongoose'); //import mongoose

const Game = mongoose.model(
	'Game',
	new mongoose.Schema({
		name: String,
		start: Date,
		end: Date,
		location: String,
		blinds: Number,
		active: Boolean,
		total_cash: Number,
		created_by: String,
		code: String,
		players: [
			{
				_id: String,
				username: String,
				starting_stack: Number,
				finishing_stack: Number,
				addons: Array,
				in_game: Boolean,
			},
		],
	})
);

module.exports = Game;
