// Require Express
var express     = require('express');
var router      = express.Router();
var moment		= require('moment');
var Promise		= require('bluebird');
var Post 		= require('./models/Post');
var Event 		= require('./models/Event');
var User		= require('./models/User');
var controller  = require('./controller.js');


// Export the router
module.exports  = router;

// API Routes
router

// POST & GET informations (TODO: Security)
//=============================================
    
    .post('/infos/:type', function(req, res) {
    	if(req.params.type === 'posts') {

    		//We convert the string into a date
    		var	tempExpiryDate = moment(req.body.expirydate, moment.ISO_8601);
    		var tempBirthDate = moment();
    		if(req.body.birthdate != '' && req.body.birthdate != undefined)
    			tempBirthDate = moment(req.body.birthdate, moment.ISO_8601);

    		//We create a new post and save it
    		var post = new Post({

    		title: 			req.body.title,
    		description: 	req.body.description,
    		birthdate: 		tempBirthDate,
    		expirydate: 	tempExpiryDate,
    		category: 		req.body.category,
    		location: 		req.body.location,
    		addInfo: 		req.body.addInfo,
    		userID: 		req.body.userID,
    		});

    		post.save(function(err, resp) {
    			if(err) {
    				console.log('Error when adding post');
    				res.send(err);
    			}
    			res.json({message: 'Successfully added'});
    		});
    	}
    	else if(req.params.type === 'events') {

    		//We convert the string into a date
    		var	tempExpiryDate = moment(req.body.expirydate, moment.ISO_8601);
    		var tempBirthDate = moment();
    		if(req.body.birthdate != '' && req.body.birthdate != undefined)
    			tempBirthDate = moment(req.body.birthdate, moment.ISO_8601);

    		//we create a new event and save it
    		var event = new Event({

    		title: 			req.body.title,
    		description: 	req.body.description,
    		birthdate: 		tempBirthDate,
    		expirydate: 	tempExpiryDate,
    		category: 		req.body.category,
    		location: 		req.body.location,
    		addInfo: 		req.body.addInfo,
    		userID: 		req.body.userID,
    		userLimit: 		req.body.userLimit,
    		acceptOverload: req.body.acceptOverload

    		});
    		event.userList.push(req.body.userID);

    		event.save(function(err, resp) {
    			if(err) {
    				console.log('Error when adding post');
    				res.send(err);
    			}
    			res.json({message: 'Successfully added'});
    		});
    	}
    	else {
    		res.json({message: 'Error bad type request'});
    	}
    })
    
    .get('/infos/:type', function(req, res) {
        if(req.params.type === 'posts') {
            Post.find(function(err, posts) {
            	if(err) {
            		console.log('Error when trying to get all posts');
            		res.send(err);
            	}
            	res.json(posts);
            });
        }  
        else if(req.params.type === 'events') {
        	Event.find(function(err, events) {
        		if(err) {
        			console.log('Error when trying to get all events');
        			res.send(err);
        		}
        		res.json(events);
        	});
        }
        else 
            res.send('error bad \'type\' as request');
    })

// POST register (TODO: Security)
//==============================================

    .post('/register', function(req, res) {
    	//We check if length are good

        if(controller.isUsernameValid(req.body.username) && controller.isUserMailValid(req.body.mail)) {
        	var tempUsername = controller.sanitizeString(req.body.username);
        	var tempUserMail = controller.sanitizeString(req.body.mail);
        	// We check the username and the e-mail
        	Promise.props({
			    username: User.findOne({username: tempUsername}, 'username').execAsync(),
			    mail: User.findOne({mail: tempUserMail}, 'mail').execAsync()
			  })
			  .then(function(results) {
			    if(results.username != null)
			    	res.json({message: 'Username already exists'});
			    else if(results.mail != null)
			    	res.json({message: 'Mail already exists'});
	    		else {
	    			var user = new User({
	    				username: 	tempUsername,
	    				password: 	req.body.password,
	    				mail: 		tempUserMail
	    			});
	    			user.save(function(err, resp) {
	    				if(err) {
	    					console.log('Error when trying to register an user');
	    					res.send(err);
	    				}
	    				res.json({message: 'Successfully registered'});
	    			});
	    		}
			  })
			  .catch(function(err) {
			    cosole.log(err);
			    res.send(500); // oops - we're even handling errors!
			  });
        }
        else {
        	res.json({message: 'Bad request :  invalid inputs'});
        }
    })

// GET users
//=============================================

	.get('/users', function(req, res) {
		User.find({}, '-password', function(err, users) {
			if(err) {
				console.log('Error when trying to get all users');
				res.send(err);
			}
			res.json(users);
		});
	})


// LOG In
//======================================================
    /*.get('/login', function(req, res) {
        res.setHeader('Content-Type', 'text/plain');
        res.end('Connection STUFF');
    })
    .post('/login', function(req, res) {
        //CHECK if connected
        if(true)
            res.end('Connected !');
    })

// PROFILE
//======================================================
    .get('/profil', function(req, res) {
        //redirect to profil page
        res.end('profil page');
    })
    .get('/profil/:id', function(req, res) {
        // get the profil with the ID in argument
        res.end('profil id:' +req.params.id +' page');
    })
    .post('/profil/update', function(req, res) {
        // update informations
        res.end('form update profil infos');
    })*/

// ERRORS
//======================================================   
    .use(function(req, res, next){
        res.setHeader('Content-Type', 'text/plain');
        res.status(404).send('Error 404 : Bad request');
    });