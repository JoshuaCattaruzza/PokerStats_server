const mongoose = require('mongoose'); //import mongoose

const Role = mongoose.model(
	'Role',
	new mongoose.Schema({
		name: String,
	})
);

module.exports = Role;
