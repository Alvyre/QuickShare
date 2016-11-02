// BASE SETUP
// ====================================

var express 		= require('express');
var app     		= express();						// create the app with express
var port    		= process.env.PORT || 8080;			// define the port
var mongoose		= require('mongoose');				// mongoose for mongodb
var database 		= require('./config/database'); 	// Database information
var morgan			= require('morgan');				// log requests to the console (express4)
var bodyParser		= require('body-parser');			// pull information from HTML POST (express4)
var router  		= require('./app/routes');			// Routes of the app
var methodOverride 	= require('method-override');		// simulate DELETE and PUT (express4)

// Config

mongoose.connect(database.url, function (err) {			// Connect to the mongoDB
	if(err) { 
		throw err; 
		console.log("Database connection Error");
	}
});
app.use(express.static(__dirname + '/public'));						// set static files location
app.use(morgan('dev'));												// log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));				// parse application/x-www-form-urlencoded
app.use(bodyParser.json());											// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));		// parse application/vnd.api+json as json
app.use(methodOverride());

// ROUTES
// ==============================================

app.use('/api', router);

// START THE SERVER
// ==============================================

app.listen(port, function(){
	console.log('Server listening on port' + port);
});
