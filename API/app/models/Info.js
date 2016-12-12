'use strict';

// define INFO Model
//======================================

//require
var mongoose 	= require('mongoose');
var Promise		= require('bluebird');
var moment 		= require('moment');
var Vote 		= require('./Vote');
var Controller  = require('../controller');

moment().format();

mongoose.Promise = require('bluebird');

Promise.promisifyAll(mongoose);

var Schema 		= mongoose.Schema;
// Schema
//======================================

var InfoSchema = new Schema({
	title			: { type: String, required: true },
	description 	: { type: String, required: true, default: '' },
	birthdate		: { type: Date,   required: true, default: moment() },
	expirydate		: { type: Date,   required: true },
	category		: { type: String, required: true, default: 'Info' },
	location		: { type: String, required: true, default: '' },
	addInfo			: { type: String, default: ''},
	userID			: { type: String, required: true },
	userList		: { type: [{ID: String, username: String}], default: []},
	userLimit		: { type: Number, min: 0, default: 0}, 
	acceptOverload  : { type: Boolean, default: false },
	votes			: { type: [Vote.schema], default: [] },
	voteCount		: { type: Number, default: 0}
});


// Methods
//======================================

InfoSchema.methods.getRemainingTime = function() {
	var birthMoment = moment(this.birthdate);
	var deathMoment = moment(this.expirydate);
	var timeleft 	 = deathMoment.diff(birthMoment);
	return timeleft.format('HH:mm:ss').toJSON();
};

InfoSchema.methods.isFull = function() {
	if(this.acceptOverload)
		return false;
	else if(this.userList.length >= this.userLimit)
		return true;
	else
		return false;
};

InfoSchema.methods.getCurrentSize = function() {
	return this.userList.length;
}

InfoSchema.methods.updateVoteCount = function() {

	var total = 0;
	var vote;
	for (var i = this.votes.length - 1; i >= 0; i--) {
		vote = this.votes[i];
		total += vote.value;
	}
	this.voteCount = total;
};

InfoSchema.methods.updateInfos = function(data) {
	if(data.title && data.title != '') {
		this.title = Controller.sanitizeString(data.title); 
	}
	if(data.description) {
		this.description = Controller.sanitizeString(data.description);
	}
	if(data.birthdate) {
		var newBirthDate = moment(data.birthdate, moment.ISO_8601);
		var timeFromNow = newBirthDate.diff(moment());
		if( timeFromNow >= 0 && timeFromNow <= 86400000) { 		// this is 24h in ms
			this.birthdate = newBirthDate;    
		}
	}
	if(data.expirydate) {
		var newExpiryDate = moment(data.expirydate);
		var timeFromBegin = newExpiryDate.diff(this.birthdate);
		if( timeFromBegin >= 0 && timeFromBegin <= 86400000) { 	// this is 24h in ms
			this.expirydate = newExpiryDate;
		}
	}
	if(data.category) {
		this.category = Controller.sanitizeString(data.category);
	}
	if(data.location) {
		this.location = Controller.sanitizeString(data.location);
	}
    if(data.addInfo) {
    	this.addInfo = Controller.sanitizeString(data.addInfo);
    }
}

// Model
//======================================

var Info = mongoose.model('Info', InfoSchema);


// Exports
//======================================

module.exports = Info;