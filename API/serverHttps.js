'use strict';
// Getting Packages
//======================================

var express 		= require('express');
var app     		= express();						// create the app with express
var mongoose		= require('mongoose');				// mongoose for mongodb
var config 	 		= require('./config/config'); 		// Database information
var morgan			= require('morgan');				// log requests to the console (express4)
var bodyParser		= require('body-parser');			// pull information from HTML POST (express4)
var router  		= require('./app/routes');			// Routes of the app
var methodOverride 	= require('method-override');		// simulate DELETE and PUT (express4)
var https			= require('https');
var fs 				= require('fs');
var socket 			= require('socket.io');
var cors			= require('cors');
var cookieParser 	= require('cookie-parser');
var cron 			= require('node-cron');
var Cleaner			= require('./app/cleaner');

// Server Config
//======================================

var SSLoptions = {
	ca: 	fs.readFileSync(config.ca),
	key: 	fs.readFileSync(config.key),
	cert: 	fs.readFileSync(config.cert)
};

var httpsServer = https.createServer(SSLoptions, app);
var io = socket(httpsServer);

// Configuration
//======================================

var corsOptions = {
  origin: function(origin, callback){
    var originIsWhitelisted = config.whitelist.indexOf(origin) !== -1;
    callback(originIsWhitelisted ? null : 'Bad Request', originIsWhitelisted);
  },
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true
};

var port = process.env.PORT || 443;						// define the port
mongoose.connect(config.database, function (err) {			// Connect to the mongoDB
	if(err) { 
		console.log("Database connection Error");
		throw err;
	}
});

app.use(cookieParser(config.cookieSecret));
app.use(express.static(__dirname + '/public'));						// set static files location
app.use(morgan('dev'));												// log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));				// parse application/x-www-form-urlencoded
app.use(bodyParser.json());											// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));		// parse application/vnd.api+json as json
app.use(methodOverride());
app.set('socketio', io);

// ROUTES
// ==============================================

app.use('/robots.txt', function(req,res) {
		console.log('robot: '+req.hostname +', IP: '+req.ip);
		res.status(200).sendFile(__dirname+'/robots.txt');
});
app.use('/E40A3C755494A14C14BE29B78115CE50.txt', function(req,res) {
	console.log('SSL Checking');
	res.status(200).sendFile(__dirname+ '/E40A3C755494A14C14BE29B78115CE50.txt');
});
app.use(cors(corsOptions));
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

// CRON DELETE OLD INFOS Every 30 min
// ==============================================

cron.schedule('30 * * * *', function(){
	console.log('/***** Start Cleaning.. *****/');
	Cleaner.deleteOldInfo();
});

// START THE SERVER
// ==============================================

httpsServer.listen(port, function(){
	console.log('Server listening on port' + port);
});
