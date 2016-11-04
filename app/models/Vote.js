//require
var mongoose 	= require('mongoose');
var Promise 	= require('bluebird');
mongoose.Promise = require('bluebird');
Promise.promisifyAll(mongoose);




// Schema
//=========================================

var schema = new mongoose.Schema({
	userID 		: { type: String, required: true, index: {unique: true} },
	value		: { type: Number, required: true, default: 0}
});


// Methods
//=========================================




// Model
//=========================================

var model = mongoose.model('Vote', schema);



// Exports
//=========================================

module.exports = {
	model,
	schema
};