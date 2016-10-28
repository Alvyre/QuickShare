// define EVENT Model
//======================================

//require
var mongoose 	= require('mongoose');
var Promise		= require('bluebird');
moment	 		= require('moment');
moment().format();

Promise.promisifyAll(mongoose);

var Schema 		= mongoose.Schema;
// Schema
//======================================

var EventSchema = new Schema({
	title			: { type: String, required: true },
	description 	: { type: String, required: true },
	birthdate		: { type: Date,   required: true, default: moment() },
	expirydate		: { type: Date,   required: true },
	category		: { type: String, required: true },
	location		: { type: String, required: true },
	addInfo			: String,
	userID			: { type: String, required: true },
	userList		: [String],
	userLimit		: { type: Number, min: 0}, 
	acceptOverload  : { type: Boolean, default: false, required: true }
});


// Methods
//======================================

EventSchema.methods.getRemainingTime = function() {
	var birthMoment = moment(this.birthdate);
	var deathMoment = moment(this.expirydate);
	var timeleft 	 = deathMoment.diff(birthMoment);
	return timeleft.format('HH:mm:ss').toJSON();
};

EventSchema.methods.isFull = function() {
	if(this.acceptOverload)
		return false;
	else if(this.userList.length >= this.userLimit)
		return true;
	else
		return false;
};

EventSchema.methods.getCurrentSize = function() {
	return this.userList.length;
}


// Model
//======================================

var Event = mongoose.model('Event', EventSchema);


// Exports
//======================================

module.exports = Event;