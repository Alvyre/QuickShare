'use strict';

//require
var mongoose 	= require('mongoose');
var config		= require('../../config/config');
var https 		= require('https');

// Schema
//=========================================

var Schema = mongoose.Schema;

var schema = new Schema({
	infoID 		: { type: String, required: true, default: ''},
	userID		: { type: String, required: true, default: ''},
	playerID	: { type: String, required: true, default: ''}
});

// Methods
//=========================================

schema.statics.pushMessage = function (subUsers, message) {
	var headers = {
		"Content-Type": "application/json; charset=utf-8",
		"Authorization": "Basic " +config.notifAPIKey
	};
	
	var options = {
		host: "onesignal.com",
		port: 443,
		path: "/api/v1/notifications",
		method: "POST",
		headers: headers
	};
	let ids = ['87ca2831-b82e-4062-bb36-a5de4490e395'];
	for (var i = subUsers.length - 1; i >= 0; i--) {
		ids.push(subUsers[i].playerID);
	}

	var data = { 
		app_id: config.notifAppID,
		title: 'QuickShare',
		contents: {"en": message.content},
		include_player_ids: ids,
		url: message.url
	};

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
};

// Model
//=========================================

var WebNotification = mongoose.model('WebNotification', schema);

// Exports
//=========================================

module.exports = WebNotification;