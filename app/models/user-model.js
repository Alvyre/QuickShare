// define USERS Model
//======================================

//require
mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
//======================================

var UserSchema = new Schema({
	username	: { type: String, required: true, index: {unique: true} },
	password	: { type: String, required: true },
	mail		: { type: String, required: true }
});


// Methods
//======================================



// Model
//======================================

var User = mongoose.model('User', UserSchema);


// Exports
//======================================

module.exports = User;