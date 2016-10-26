// define POST Model
//======================================

//require
mongoose = require('mongoose');
var Schema = mongoose.Schema;
moment	 = require('moment');
moment().format();

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

PostSchema.methods.getRemainingTime = function() {
	var birthMoment = moment(this.birthdate);
	var deathMoment = moment(this.expirydate);
	var timeleft 	 = deathMoment.diff(birthMoment);
	return timeleft.format('HH:mm:ss').toJSON();
};


// Model
//======================================

var Post = mongoose.model('Post', PostSchema);

// Exports
//======================================

module.exports = Post;