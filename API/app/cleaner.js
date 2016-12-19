'use strict';

var moment		    = require('moment');
var Info 		    = require('./models/Info');

module.exports = {
	deleteOldInfo() {
		var now = moment().utc().format();

		Info.remove({expirydate: {$lt: now} }, function(err) {
			if(err) {
				console.log('Error when trying to delete old infos');
				return;
			}
			console.log('//////// Database Cleaned ////////');
		});
	}
};
