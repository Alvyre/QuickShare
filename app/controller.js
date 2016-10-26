var Post 		= require('./models/post-model');
var Event 		= require('./models/event-model');
var User		= require('./models/user-model');

var Controller = {


	getAllPosts: function() {
		Post.find(function(err, posts) {
			if(err) {
				console.log('Error when trying to get all posts');
				return -1;
			}
			return posts;
		});
	},

	getAllEvents: function() {
		Event.find(function(err, events) {
			if(err) {
				console.log('Error when trying to get all events');
				return -1;
			}
			return events;
		});
	},

	signup: function(user){
		var checkUsername = User.findOne({username: '/'+user.name+'/i'},function(err, res) {
			if(err) {
				console.log('Error when trying to check user');
				return -1;
			}
			return res;
		});
		if(checkUsername === user.name) return ('User name exists');

		var checkMail = User.findOne({mail: '/'+user.mail+'/i'}, function(err, res) {
			if(err) {
				console.log('Error when trying to check mail');
				return -1;
			}
			return res;
		});
		if(checkMail === user.mail) return ('User mail already registered');

		User.create({
			username: user.name,
			password: user.password, //TODO HASH
			mail: 	  user.mail
		}, function(err, user) {
			if(err) {
				console.log('Error when creating the user');
				return -1;
			}
		});
		return 'Success';

		// TODO connect the user directly.
	},

	login: function() {
		//todo
	},

	addPost: function(post) {
		Post.create({
			title 			: post.title,
			description 	: post.description,
			birthdate   	: post.birthdate,
			expiratydate	: post.expiratydate,
			category		: post.category,
			location		: post.location,
			addInfo			: post.addInfo,
			userID			: post.UserID
		}, function(err, post) {
			if(err) {
				console.log('Error when creating a post');
				return -1;
			}
		});
		return 'Success';
	},	

	addEvent: function(event) {
		//TODO
	}

};

module.exports = Controller;