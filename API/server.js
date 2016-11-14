'use strict';
// Getting Packages
//======================================

var express 		= require('express');
var app     		= express();						// create the app with express
var mongoose		= require('mongoose');				// mongoose for mongodb
var config 	 		= require('./config/config'); 	// Database information
var morgan			= require('morgan');				// log requests to the console (express4)
var bodyParser		= require('body-parser');			// pull information from HTML POST (express4)
var router  		= require('./app/routes');			// Routes of the app
var methodOverride 	= require('method-override');		// simulate DELETE and PUT (express4)
var http			= require('http').Server(app);
var fs 				= require('fs');
var io 				= require('socket.io')(http);

// Configuration
//======================================

var port = process.env.PORT || 8080;						// define the port
mongoose.connect(config.database, function (err) {			// Connect to the mongoDB
	if(err) { 
		throw err; 
		console.log("Database connection Error");
	}
});
app.use(express.static(__dirname + '/public'));						// set static files location
app.use('/scripts/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/scripts/vue', express.static(__dirname + '/node_modules/vue/dist/'));
app.use('/scripts/vue-resource', express.static(__dirname + '/node_modules/vue-resource/dist/'));
app.use('/scripts/moment', express.static(__dirname + '/node_modules/moment/min/'));

app.use(morgan('dev'));												// log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));				// parse application/x-www-form-urlencoded
app.use(bodyParser.json());											// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));		// parse application/vnd.api+json as json
app.use(methodOverride());


// ROUTES
// ==============================================

//redirect to the API
app.use('/api', router); // redirect to the API Router

// redirect to the Front view
app.get('*', function(req, res) {
        res.sendFile(__dirname+'/public/index.html'); // redirect to front
    });


//Socket io
// ==============================================

io.on('connection', function(socket) {
	console.log('a user connected');
});


// START THE SERVER
// ==============================================

http.listen(port, function(){
	console.log('Server listening on port' + port);
});