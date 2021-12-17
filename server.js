//--------MODULES IMPORT-------------------------------------------------------
const express = require('express'); //import express
const mongoose = require('mongoose'); //import mongoose
const cors = require('cors');
const bodyparser = require('body-parser'); //import bp middleware
const { json } = require('body-parser');
//----------IMPORT OF ROUTES---------------------------------------------------
const gameRoutes = require('./routes/gameRoute');
const userRoutes = require('./routes/userRoute');
const authRoutes = require('./routes/authRoute');

//----------IMPORT OF CONFIGS ANF MODELS---------------------------------------
const PORT = process.env.PORT || 4200;
const dbConfig = require('./config/dbConfig');
const db = require('./models');
const Role = db.role;
//---------CORS OPTIONS--------------------------------------------------------
const corsOptions = {
	origin: '*',
};
//---------DB CONNECTION AND CONFIGURATION-------------------------------------
db.mongoose
	.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Successfully connected to DB');
		initial();
	})
	.catch((err) => {
		console.error('Connection error', err);
		process.exit();
	});
//Initial insertion of three main Roles, function is invoked once after mongoose connection
function initial() {
	Role.estimatedDocumentCount((err, count) => {
		if (!err && count === 0) {
			new Role({
				name: 'user',
			}).save((err) => {
				if (err) {
					console.log('error', err);
				}
				console.log("added 'user' to roles collection");
			});

			new Role({
				name: 'moderator',
			}).save((err) => {
				if (err) {
					console.log('error', err);
				}

				console.log("added 'moderator' to roles collection");
			});

			new Role({
				name: 'admin',
			}).save((err) => {
				if (err) {
					console.log('error', err);
				}

				console.log("added 'admin' to roles collection");
			});
		}
	});
}
//----------SERVER--------------------------------------------------------------
const app = express();
app.listen(PORT, () => console.log('Listening on port ' + PORT)); //listen accetta due param, il primo specifica la potra su cui ascolta il secondo può essere una funzione
app.use(cors(corsOptions)); //Passing cors options to cors and app
app.use(express.static('public')); //Per gestire i file statici, quali immagini, file CSS e file JavaScript, utilizzare la funzione middleware integrata express.static in Express.
app.use(express.json({ limit: '1mb' })); //Controls the maximum request body size. If this is a number, then the value specifies the number of bytes; if it is a string, the value is passed to the bytes library for parsing.
app.use(bodyparser.json()); //per convertire direttamente l'input in JSON cosi non besetemmio a salvare i dati nel db
app.use(bodyparser.urlencoded({ extended: true }));
app.use('/game', gameRoutes);
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
// require('./routes/authRoute')(app);
// require('./routes/userRoute')(app);

//--------HTTPS STUFF---------------------------------------------------------------
//da gestire con SSL di terze parti
// const options = {
// 	key: fs.readFileSync('./keys/client-key.pem'),
// 	cert: fs.readFileSync('./keys/client-cert.pem'),
// };
//const https = require('https');
//const fs = require('fs');
//------------
// https
// 	.createServer(options, app)
// 	.listen(443, () => console.log('Listening on port 443'));
//------------
