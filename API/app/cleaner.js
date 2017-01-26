'use strict';

var moment		    = require('moment');
var Info 		    = require('./models/Info');
var WebNotification = require('./models/WebNotification');
var async			= require('async');


module.exports = {
	deleteOldInfo() {

		var now = moment().utc().format();

		Info.find({expirydate: {$lt: now} }, function(err, infos) {
			async.each(infos, function(info, callback) {
				info.remove(function(err, result) {
					if(err) {
						console.log('Error when trying to delete old infos');
						return;
					}
					this.CleanNotifications(result._id);
				});
			});
			console.log('/***** Cleaning Done *****/');
		});

/*		Info.remove({expirydate: {$lt: now} }, function(err) {
			if(err) {
				console.log('Error when trying to delete old infos');
				return;
			}
		});*/
	},
	CleanNotifications (infoID) {
		WebNotification.remove({infoID: infoID}, function(err) {
			if(err) {
				console.log('Error when trying to delete Webnotification subscription');
				return;
			}
			//console.log('/***** Web Notification Cleaned *****/');
		});
 	}
};
