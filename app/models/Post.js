// define POST Model
//======================================

//require
var mongoose 	= require('mongoose');
var Promise 	= require('bluebird');
moment	 		= require('moment');

moment().format();

mongoose.Promise = require('bluebird');

Promise.promisifyAll(mongoose);

var Schema 	= mongoose.Schema
// Schema
//======================================

var PostSchema = new Schema({
	title		: { type: String, required: true },
	description : { type: String, required: true },
	birthdate	: { type: Date,   required: true, default: Date.now },
	expirydate	: { type: Date,   required: true },
	category	: { type: String, required: true },
	location	: { type: String, required: true },
	addInfo		: String,
	userID		: { type: String, required: true }
});


// Methods
//======================================



// Model
//======================================

var Post = mongoose.model('Post', PostSchema);

// Exports
//======================================

module.exports = Post;