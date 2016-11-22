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
var cors			= require('cors');
var cookieParser 	= require('cookie-parser');

// Configuration
//======================================

var corsOptions = {
  origin: config.origin,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true
};

var port = process.env.PORT || 80;						// define the port
mongoose.connect(config.database, function (err) {			// Connect to the mongoDB
	if(err) { 
		throw err; 
		console.log("Database connection Error");
	}
});
app.use(cookieParser(config.cookieSecret));
app.use(express.static(__dirname + '/public'));						// set static files location
app.use(morgan('dev'));												// log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));				// parse application/x-www-form-urlencoded
app.use(bodyParser.json());											// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));		// parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors(corsOptions));

// ROUTES
// ==============================================
app.use('/robots.txt', function(req,res) {
		console.log('robot: '+req.hostname +', IP: '+req.ip);
		res.status(200).sendFile(__dirname+'/robots.txt');
});
//Enable Preflight request cors
app.options('*', cors()); // include before other routes

//redirect to the API
app.use('/api', router); // redirect to the API Router

// redirect to the Front view
app.use('*', function(req, res) {
		console.log('request host: '+req.hostname +' , IP: '+req.ip);
        res.status(404).sendFile(__dirname+'/public/404.html'); // redirect to front
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
