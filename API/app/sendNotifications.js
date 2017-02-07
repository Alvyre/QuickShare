'use strict';

var APIKey 		= require('../config.js').notifAPIKey;
var notifAppID 	= require('../config.js').notifAppID;

module.exports = {

	sendNotification (message) {

		//Set headers
		var headers = {
			"Content-Type": "application/json; charset=utf-8",
			"Authorization": "Basic " +APIKey
		};

		//Set options
		var options = {
			host: "onesignal.com",
			port: 443,
			path: "/api/v1/notifications",
			method: "POST",
			headers: headers
		};

		//Data (App-ID, message and player-ID)
		var data = {
			app_id: notifAppID,
			contents: {"en": message.content},
			include_player_ids: message.users
		};

		//Request
		var https = require('https');
		var req = https.request(options, function(res) {  
			res.on('data', function(data) {
				console.log("Response:");
				console.log(JSON.parse(data));
			});
		});

		req.on('error', function(e) {
			console.log("ERROR:");
			console.log(e);
		});

		req.write(JSON.stringify(data));
		req.end();
	}	
};

