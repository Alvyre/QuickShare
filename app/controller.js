var validator = require('validator');

var Controller = {

	isUsernameValid: function(username) {
		username += ''; // Be sure to have a string input;

		if( !validator.isEmpty(username) && validator.isLength(username, {min: 3, max: 15}) ) {
			return true;
		}
		return false;
	},

	isObjectIDValid: function(id) {
		id += '';

		if(id.match(/^[0-9a-fA-F]{24}$/))
			return true;
		return false;
	},

	isUserMailValid: function(mail) {
		mail += ''; // Be sure to have a string input

		if(validator.isEmail(mail) && validator.isLength(mail, {min: 5, max: undefined}) ) {
			return true;
		}
		return false;
	},

	isUserPasswordValid: function(password) {
		password += ''; // be sure to have string input

		if( !validator.isEmpty(password) && validator.isLength(password, {min: 6, max: undefined}) ) {
			return true;
		}
		return false;
	},

	checkBoolean: function(stringBool) {
		if(stringBool === 'true')
			return true;
		if(stringBool === 'false')
			return false;
		return null;
	},

	isVoteTypeValid: function(votetype) {
		if(votetype === 'upvote' || votetype === 'downvote') {
			return true;
		}
		return false;
	},

	sanitizeString: function(string) {
		string = validator.escape(string);
		if(validator.isEmail(string)) {
			string = validator.normalizeEmail(string, [{	
				all_lowercase: true, 
				gmail_remove_dots: false,
				gmail_remove_subaddress: false,
				outlookdotcom_remove_subaddress: false,
				yahoo_remove_subaddress: false
			}]);
		}
		return string;
	}

};

module.exports = Controller;