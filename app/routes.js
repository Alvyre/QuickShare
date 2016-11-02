// Requires
var express     = require('express');
var router      = express.Router();
var moment		= require('moment');
var Promise		= require('bluebird');
var Post 		= require('./models/Post');
var Event 		= require('./models/Event');
var User		= require('./models/User');
var Controller  = require('./controller.js');
var bcrypt      = require('bcrypt');

//hash setup
const saltRounds = 10;

// Export the router
module.exports  = router;

// API Routes
router

// POST & GET informations (TODO: Security)
//=============================================

.post('/infos/:type', function(req, res) {

    // User ID checking

    if( !(Controller.isObjectIDValid(req.body.userID)) ) {
        res.send({message: 'Invalid userID'});
    }
    else{

        if(req.params.type === 'posts') {       // Handling Posts

            //We convert the string into a date
            var	tempExpiryDate = moment(req.body.expirydate, moment.ISO_8601);
            var tempBirthDate = moment();

            if(req.body.birthdate != '' && req.body.birthdate != undefined) {
                tempBirthDate = moment(req.body.birthdate, moment.ISO_8601);
            }
        	
        	//We create a new post and save it
    		var post = new Post({

                title: 			Controller.sanitizeString(req.body.title),
                description: 	Controller.sanitizeString(req.body.description),
                birthdate: 		tempBirthDate,
                expirydate: 	tempExpiryDate,
                category: 		Controller.sanitizeString(req.body.category),
                location: 		Controller.sanitizeString(req.body.location),
                addInfo: 		Controller.sanitizeString(req.body.addInfo),
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
        else if(req.params.type === 'events') {     // Handling Events

            //We convert the string into a date
        	var	tempExpiryDate = moment(req.body.expirydate, moment.ISO_8601);
        	var tempBirthDate = moment();

        	if(req.body.birthdate != '' && req.body.birthdate != undefined) {
                tempBirthDate = moment(req.body.birthdate, moment.ISO_8601);
            }
        			
        	//We create a new event and save it
        	var event = new Event({

                title: 			Controller.sanitizeString(req.body.title),
                description: 	Controller.sanitizeString(req.body.description),
                birthdate: 		tempBirthDate,
                expirydate:     tempExpiryDate,
                category: 		Controller.sanitizeString(req.body.category),
                location: 		Controller.sanitizeString(req.body.location),
                addInfo: 		Controller.sanitizeString(req.body.addInfo),
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
    }
})

.get('/infos/:type', function(req, res) {
    if(req.params.type === 'posts') {           // Handling Posts
        Post.find(function(err, posts) {
            if(err) {
                console.log('Error when trying to get all posts');
                res.send(err);
            }
        res.json(posts);
        });
    }  
    else if(req.params.type === 'events') {     // Handling Events
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

.get('/infos/:type/user/id/:id', function(req, res) {

    // Checking userID
    if( !(Controller.isObjectIDValid(req.params.id)) ) {
        res.send({message: 'Invalid userID'});
    }
    else {
        if(req.params.type === 'posts') {          // Handling Posts
            Post.find({userID: req.params.id}, function(err, posts) {
                if(err) {
                    console.log('Error when trying to get events for User ID: '+req.params.id);
                    res.send(err);
                }
                res.json(posts);
            });
        }
        else if(req.params.type === 'events') {     // Handling Events
            Events.find({userID: req.params.id}, function(err, events) {
                if(err) {
                    console.log('Error when trying to get events for User ID: '+req.params.id);
                    res.send(err);
                }
                res.json(events);
            })
        }
    }
})


// DELETE POST todo Security
//==============================================

.delete('/info/delete/:type/:id', function(req, res) {
    
    // Cheking userID
    if( !(Controller.isObjectIDValid(req.body.userID)) ) {
        res.send({message: 'Invalid userID'});
    }
    else {
        if(req.params.type === 'posts') {       //Handling Posts
            if (! (Controller.isObjectIDValid(req.params.id)) )
                res.send({message: 'Post ID is invalid'});
            else {
                Post.findOneAndRemove({_id: req.params.id, userID: req.body.userID}, function(err, post) {
                    if(err) {
                        console.log('Error when trying to delete the post');
                        res.send(err);
                    }
                    if(post) {
                        console.log('Post removed');
                        res.json({message: 'Post removed'});
                    }
                    else {
                        res.send({message: 'There is no post with this ID or you are to authorized to delete it'});
                    }
                });
            }
        }
        else if(req.params.type === 'events') {     //Handling Events
            if (! (Controller.isObjectIDValid(req.params.id)) )
                res.send({message: 'Evend ID is invalid'});
            else {
                Event.findOneAndRemove({_id: req.params.id, userID: req.body.userID}, function(err, event) {
                    if(err) {
                        console.log('Error when trying to get the event to delete');
                        res.send(err);
                    }
                    if(event) {
                        console.log('Event removed');
                        res.json({message: 'Event removed'});
                    }
                    else {
                        res.send({message: 'There is no event with this ID or you are not authorized to delete it'});
                    }
                });
            }
        }
    }
})


// POST register (TODO: Security)
//==============================================

.post('/user/register', function(req, res) {
	//We check if length are good

    if( Controller.isUsernameValid(req.body.username) && 
        Controller.isUserMailValid(req.body.mail) && 
        Controller.isUserPasswordValid(req.body.password)) {

        var tempUsername   = Controller.sanitizeString(req.body.username);
        var tempUserMail   = Controller.sanitizeString(req.body.mail);
        var isEmailVisible = Controller.checkBoolean(req.body.isEmailVisible);

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
                if(isEmailVisible)
                    user.isEmailVisible = true;
                //Hash password and save
                bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                    user.password = hash;
                    user.save(function(err, resp) {
                        if(err) {
                            console.log('Error when trying to register an user');
                            res.send(err);
                        }
                        res.json({message: 'Successfully registered'});
                    });  
                });
            }
        })
        .catch(function(err) {
            console.log(err);
		    res.sendStatus(500); // oops - we're even handling errors!
        });
    }
    else {
    	res.json({message: 'Bad request :  invalid inputs'});
    }
})


// LOGIN Todo Security
//==============================================

.post('/user/login', function(req, res) {
    if( Controller.isUsernameValid(req.body.username) && 
        Controller.isUserPasswordValid(req.body.password)) {

        Promise.props({
            username: User.findOne({username: req.body.username}).execAsync()
        })
        .then(function(results) {
            if(results.username != null) {
                // Load hash from your password DB.
                bcrypt.compare(req.body.password, results.username.password, function(err, resp) {
                    if(err) {
                        console.log('Error when checking password: '+ err);
                        res.json({message: 'Error when checking password'});
                    }
                    if(resp === true) {
                        res.json({message: 'connected'});
                    }
                    else {
                        res.json({message: 'wrong password'})
                    }
                });
            }
        });
    }
})


// GET all users
//==============================================

.get('/users', function(req, res) {
    User.find({}, '-password', function(err, users) {
        if(err) {
            console.log('Error when trying to get all users');
            res.send(err);
        }
        if(users) {
            users.forEach(function(user){
            if(user.isEmailVisible === false)
                user.mail = '';
            });
        }
        res.json(users);
    });
})


// GET user by ID
//==============================================

.get('/user/id/:id', function(req, res) {
    if(Controller.isObjectIDValid(req.params.id)) {
        var id = req.params.id;
        User.findOne({_id: id}, '-password', function(err, user) {
            if(err) {
                console.log('error when trying to get the user by id');
                res.send(err);
            }
            if(user) {
                if(user.isEmailVisible === false) {
                    user.mail = '';
                }
            }
            res.json(user);
        });
    }
    else {
        res.json({message: 'Bad request'});
    }
})


// GET user by name
//==============================================

.get('/user/name/:name', function(req, res) {
    if(Controller.isUsernameValid(req.params.name)) {
        var name = Controller.sanitizeString(req.params.name);

        User.findOne({username: name}, '-password', function(err, user) {
        if(err) {
            console.log('error when trying to get the user by name');
            res.send(err);
        }
        if(user) {
            if(user.isEmailVisible === false) {
                user.mail = '';
            }
        }
        res.json(user);
        });    
    }
    else {
        res.json({message: 'Bad request'});
    }
    
})


// POST update user // TODO SECURITY
//=============================================

.post('/user/update', function(req, res) {
    
    var checkPwd    = false;
    var checkEmail  = false;
    if(Controller.checkBoolean(req.body.isNewPwd) && Controller.isUserPasswordValid(req.body.password)) {
        checkPwd = true;
    }
    if( Controller.checkBoolean(req.body.isNewEmail) && Controller.isUserMailValid(req.body.mail)) {
        checkEmail = true;
    }
    
    if(checkPwd === false && checkEmail === false) {
        //console.log('checkpwd: ' +checkPwd +' checkemail: ' +checkEmail);
        res.send({message: 'Bad request nothing to change'});
    }
    else {

        var username            = Controller.sanitizeString(req.body.username);
        var newPassword         = req.body.password;
        var newEmail            = Controller.sanitizeString(req.body.mail);
        var newIsEmailVisible   = Controller.checkBoolean(req.body.isEmailVisible);

        Promise.props({
            user: User.findOne({username: username}).execAsync(),
            mail: User.findOne({mail: newEmail}).execAsync()
        })
        .then(function(results) {
            if(results.user != null) {
                if(results.mail != null)
                    res.send({message: 'Email already exists'});
                else {
                    if(newIsEmailVisible != null)
                        results.user.isEmailVisible = newIsEmailVisible; 
                    if(checkEmail)
                        results.user.mail = newEmail;
                    if(checkPwd) {
                        bcrypt.hash(newPassword, saltRounds, function(err, hash) {
                            results.user.password = hash;
                            results.user.save(function(err, resp) {
                                if(err) {
                                    console.log('Error when trying to update the user: '+user.username);
                                    res.send(err);
                                }
                                res.json({message: 'Successfully updated'});
                            });  
                        });
                    }
                    else {
                        results.user.save(function(err, resp) {
                            if(err) {
                                console.log('Error when trying to update the user: '+user.username);
                                res.send(err);
                            }
                            res.json({message: 'Successfully updated'});
                        });
                    }
                }

            }
            else 
                res.send({message: 'User doesn\'t exist'});
        });  
    }
})


// DELETE user // TODO SECURITY
//=============================================

.delete('/user/delete/', function(req, res) {
    if(! (Controller.isObjectIDValid(req.body.userID)) ) {
        res.send({message: 'Invalid ID'});
    }
    else {
        var userID = req.body.userID;
        User.findOneAndRemove({_id: userID}, function(err, user) {
            if(err) {
                console.log('Error when deleting user');
                res.send(err);
            }
            if(user){
                //console.log('User Deleted');
                res.send({message: 'User Deleted'});
            }
            else {
                res.send({message: 'User not found'});
            }
        });
    }
})


// ERRORS
//=============================================   
.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Error 404 : Bad request');
});