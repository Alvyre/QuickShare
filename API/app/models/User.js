'use strict';

// define USERS Model
//======================================

//require
var mongoose = require('mongoose');
var Promise  = require('bluebird');



// Setup 
mongoose.Promise = require('bluebird');
Promise.promisifyAll(mongoose);

var Schema = mongoose.Schema;
// Schema
//======================================

var UserSchema = new Schema({
	username		: { type: String, required: true, index: {unique: true} },
	password		: { type: String, required: true },
	mail			: { type: String, required: true, index: {unique: true} },
	isEmailVisible	: { type: Boolean, default: false}
});


// Methods
//======================================

// Model
//======================================

var User = mongoose.model('User', UserSchema);


// Exports
//======================================

module.exports = User;