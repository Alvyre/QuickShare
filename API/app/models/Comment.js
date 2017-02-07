'use strict';

//require
var mongoose 	= require('mongoose');
var Promise 	= require('bluebird');
var moment 		= require('moment');
var Controller  = require('../controller');


mongoose.Promise = require('bluebird');
Promise.promisifyAll(mongoose);
moment().format();




// Schema
//=========================================

var Schema = mongoose.Schema;

var schema = new Schema({
	title 		: { type: String, required: true, default: ''},
	content		: { type: String, required: true, default: ''},
	userID		: { type: String, required: true, default: ''},
	username	: { type: String, required: true, default: ''},
	date		: { type: Date,   required: true, default: moment()}
});


// Methods
//=========================================

schema.methods.edit = function (data) {
	if(data.title) {
		this.title = Controller.sanitizeString(data.title);
	}
	if(data.content) {
		this.content = Controller.sanitizeString(data.content);
	}
	this.date = moment();
};

// Model
//=========================================

var model = mongoose.model('Comment', schema);



// Exports
//=========================================

module.exports = {
	model,
	schema
};