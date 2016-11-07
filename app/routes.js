// Requires
var express     = require('express');
var router      = express.Router();
var secretKey   = require('../config/config').secret;
var moment		= require('moment');
var Promise		= require('bluebird');
var Post 		= require('./models/Post');
var Event 		= require('./models/Event');
var User		= require('./models/User');
var Controller  = require('./controller.js');
var bcrypt      = require('bcrypt');
var jwt         = require('jsonwebtoken'); // used to create, sign, and verify tokens

//hash setup
const saltRounds = 10;

// Export the router
module.exports  = router;

// API Routes
router

// POST register
//==============================================

.post('/user/register', function(req, res) {
    
    //Checking inputs

    if( Controller.isUsernameValid(req.body.username) && 
        Controller.isUserMailValid(req.body.mail) && 
        Controller.isUserPasswordValid(req.body.password)) {

        var tempUsername   = Controller.sanitizeString(req.body.username);
        var tempUserMail   = Controller.sanitizeString(req.body.mail);
        var isEmailVisible = Controller.checkBoolean(req.body.isEmailVisible);

        // Checking database for email or username
        
        Promise.props({
           username: User.findOne({username: tempUsername}, 'username').execAsync(),
           mail: User.findOne({mail: tempUserMail}, 'mail').execAsync()
        })
        .then(function(results) {
            if(results.username != null)
                res.json({success: false, message: 'Username already exists'});
            else if(results.mail != null)
                res.json({success: false, message: 'Mail already exists'});
            else {
                var user = new User({
                    username:   tempUsername,
                    password:   req.body.password,
                    mail:       tempUserMail
                });
                if(isEmailVisible)
                    user.isEmailVisible = true;
                //Hash password and save
                bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                    user.password = hash;
                    user.save(function(err, resp) {
                        if(err) {
                            console.log('Error when trying to register an user: '+err);
                            res.send(err);
                        }
                        res.json({
                            success: true,
                            message: 'Successfully registered !'
                        });
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
        res.json({success: false, message: 'Bad request :  invalid inputs'});
    }
})


// LOGIN
//==============================================

.post('/user/login', function(req, res) {

    //Checking inputs

    if( Controller.isUsernameValid(req.body.username) && 
        Controller.isUserPasswordValid(req.body.password)) {

        Promise.props({
            user: User.findOne({username: req.body.username}).execAsync()
        })
        .then(function(results) {
            if(results.user != null) {
                // Load hash from your password DB.
                bcrypt.compare(req.body.password, results.user.password, function(err, resp) {
                    if(err) {
                        console.log('Error when checking password: '+ err);
                        res.json({success: false, message: 'Error when checking password'});
                    }
                    if(resp === true) {
                        var userData = {
                            id: results.user._id,
                            username: results.user.username,
                            mail: results.user.mail,
                            isEmailVisible: results.user.isEmailVisible
                        };
                        var token = jwt.sign(userData, secretKey, {
                            expiresIn: '24h',
                            issuer: 'API-auth',
                            audience: 'web-frontend'
                        });
                        res.json({
                            success: true,
                            message: 'User connected',
                            token: token
                        });
                    }
                    else {
                        res.json({success: false, message: 'wrong password'})
                    }
                });
            }
            else {
                res.json({success: false, message: 'User not found'});
            }
        });
    }
})


// Checking token
//===========================================

.use(function(req, res, next) {

    //check header or url params or post params for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    //decode token
    if(token) {

        //verifies secret and checks exp
        jwt.verify(token, secretKey, function(err, decoded) {
            if(err) {
                return res.json({ success: false, message: 'Failed to authenticate token'});
            }
            else {
                //if everything good save to request for use in other Routes
                req.decoded = decoded;
                next();
            }
        });
    }
    else {

        //if there is no token : return error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
})


// POST & GET  new informations (TODO: Security)
//=============================================

.post('/infos/:type', function(req, res) {

    // User ID checking

    if( !(Controller.isObjectIDValid(req.decoded.userID)) ) {
        res.send({success: false, message: 'Invalid userID'});
    }
    else{
        
        // DATE CHECKING
        var tempExpiryDate = moment(req.body.expirydate, moment.ISO_8601);
        var tempBirthDate = moment();
        if(req.body.birthdate != '' && req.body.birthdate != undefined) {
            tempBirthDate = moment(req.body.birthdate, moment.ISO_8601);
        }
        var timeFromNow = tempBirthDate.diff(moment());
        var timeFromBirth = tempExpiryDate.diff(tempBirthDate);
        if( timeFromNow < 0 || timeFromNow > 86400000) {                    // 24h in ms
            res.send({success: false, message: 'Invalid birthdate'});
        }
        else if( timeFromBirth < 0 || timeFromBirth > 86400000) {           // 24 in ms
            res.send({success: false, message: 'Invalid expirydate'});
        }

        // POST Handling

        if(req.params.type === 'posts') {
        	
    		var post = new Post({

                title: 			Controller.sanitizeString(req.body.title),
                description: 	Controller.sanitizeString(req.body.description),
                birthdate: 		tempBirthDate,
                expirydate: 	tempExpiryDate,
                category: 		Controller.sanitizeString(req.body.category),
                location: 		Controller.sanitizeString(req.body.location),
                addInfo: 		Controller.sanitizeString(req.body.addInfo),
                userID: 		req.decoded.userID,
            });

        	post.save(function(err, resp) {
                if(err) {
                    console.log('Error when adding post');
                    res.send(err);
        	    }
        		res.json({success: true, message: 'Successfully added'});
        	});
        }

        // EVENT Handling

        else if(req.params.type === 'events') {                           
        			
        	var event = new Event({

                title: 			Controller.sanitizeString(req.body.title),
                description: 	Controller.sanitizeString(req.body.description),
                birthdate: 		tempBirthDate,
                expirydate:     tempExpiryDate,
                category: 		Controller.sanitizeString(req.body.category),
                location: 		Controller.sanitizeString(req.body.location),
                addInfo: 		Controller.sanitizeString(req.body.addInfo),
                userID: 		req.decoded.userID,
                userLimit: 		req.body.userLimit,
                acceptOverload: req.body.acceptOverload

            });
        	
            event.userList.push(req.decoded.userID);
        	event.save(function(err, resp) {
       			if(err) {
       				console.log('Error when adding post');
       				res.send(err);
       			}
       			res.json({success: true, message: 'Successfully added'});
       		});
       	}
       	else {
       		res.json({success: false, message: 'Error bad type request'});
       	}
    }
})

.get('/infos/:type', function(req, res) {
    if(req.params.type === 'posts') {           // Handling Posts
        Post.find().sort({voteCount: -1}).exec(function(err, posts) {
            if(err) {
                console.log('Error when trying to get all posts');
                res.send(err);
            }
        res.json(posts);
        });
    }  
    else if(req.params.type === 'events') {     // Handling Events
        Event.find().sort({voteCount: -1}).exec(function(err, events) {
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
        res.send({success: false, message: 'Invalid userID'});
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


// UPDATE informations
//==============================================

.post('/infos/update/:type/:id', function(req, res) {
    
    // IDs Cheking

    if( !(Controller.isObjectIDValid(req.decoded.userID)) ) {
        res.send({success: false, message: 'Invalid userID'});
    }
    else {
        var userID = req.decoded.userID;

    // DATE Checking

        var tempBirthDate = moment(req.body.birthdate);
        var tempExpiryDate = moment(req.body.expirydate);
        var timeFromNow = tempBirthDate.diff(moment());
        var timeFromBirth = tempExpiryDate.diff(tempBirthDate);
        if( timeFromNow < 0 || timeFromNow > 86400000) {                    // 24h in ms
            res.send({success: false, message: 'Invalid birthdate'});
        }
        else if( timeFromBirth < 0 || timeFromBirth > 86400000) {           // 24h in ms
            res.send({success: false, message: 'Invalid expirydate'});
            console.log(timeFromBirth);
        }

    // POST Handling

        else if(req.params.type === 'posts') {
            if( !(Controller.isObjectIDValid(req.params.id)) ) {
                res.send({success: false, message: 'Invalid Post ID'});
            }
            else {
                var postID = req.params.id;
                Post.findOne({_id: postID, userID: userID}, function(err, post) {
                    if(err) {
                        console.log('Error when trying to get the post to update: '+err);
                        res.send({success: false, message: 'Error when trying to get the post'});
                    }
                    if(post) {
                        if(post.userID === userID) {
                           post.updateInfos(req.body);
                            Post.update({_id: post._id}, post, function(err) {
                            if(err) {
                                console.log('Error when updating post: '+err);
                                res.send({success: false, message: 'Error when updating post'});
                            }
                            res.send({success: true, message: 'Post updated'});
                        }); 
                        }
                        else {
                            res.send({success: false, message: 'You are not authorized to update this post'});
                        }
                        
                    }
                    else {
                        res.send({success: false, message: 'No post found'});
                    }
                });
            }
        }
    
    // EVENT Handling

        else if(req.params.type === 'events') {
            if( !(Controller.isObjectIDValid(req.params.id)) ) {
                res.send({success: false, message: 'Invalid Event ID'});
            }
            else {
                var eventID = req.params.id;
                Event.findOne({_id: eventID, userID: userID}, function(err, event) {
                    if(err) {
                        console.log('Error when trying to get the event to update: '+err);
                        res.send({success: false, message: 'Error when trying to get the event'});
                    }
                    if(event) {
                        if(event.userID === userID) {
                           event.updateInfos(req.body);
                            Event.update({_id: event._id}, event, function(err) {
                            if(err) {
                                console.log('Error when updating event: '+err);
                                res.send({success: false, message: 'Error when updating event'});
                            }
                            res.send({success: true, message: 'Post updated'});
                            }); 
                        }
                        else {
                            res.send({success: false, message: 'You are not authorized to update this event'});
                        }
                        
                    }
                    else {
                        res.send({success: false, message: 'No event found'});
                    }
                });
            }
        }
        else {
            res.send({success: false, message: 'Bad request'});
        }
    }
})


// DELETE informations // todo Security
//==============================================

.delete('/infos/delete/:type/:id', function(req, res) {
    
    // Cheking userID
    if( !(Controller.isObjectIDValid(req.decoded.userID)) ) {
        res.send({success: false, message: 'Invalid userID'});
    }
    else {
        if(req.params.type === 'posts') {       //Handling Posts
            if (!(Controller.isObjectIDValid(req.params.id)) )
                res.send({success: false, message: 'Post ID is invalid'});
            else {
                Post.findOneAndRemove({_id: req.params.id, userID: req.decoded.userID}, function(err, post) {
                    if(err) {
                        console.log('Error when trying to delete the post');
                        res.send(err);
                    }
                    if(post) {
                        console.log('Post removed');
                        res.json({success: true, message: 'Post removed'});
                    }
                    else {
                        res.send({success: false, message: 'There is no post with this ID or you are to authorized to delete it'});
                    }
                });
            }
        }
        else if(req.params.type === 'events') {     //Handling Events
            if (! (Controller.isObjectIDValid(req.params.id)) )
                res.send({success: false, message: 'Evend ID is invalid'});
            else {
                Event.findOneAndRemove({_id: req.params.id, userID: req.decoded.userID}, function(err, event) {
                    if(err) {
                        console.log('Error when trying to get the event to delete');
                        res.send(err);
                    }
                    if(event) {
                        console.log('Event removed');
                        res.json({success: true, message: 'Event removed'});
                    }
                    else {
                        res.send({success: false, message: 'There is no event with this ID or you are not authorized to delete it'});
                    }
                });
            }
        }
    }
})


// JOIN Event
//==============================================

.post('/infos/events/:id/join', function(req, res) {

    // ID Checking

    if( !(Controller.isObjectIDValid(req.decoded.userID)) ) {
        res.send({success: false, message: 'Invalid userID'});
    }
    else if ( !(Controller.isObjectIDValid(req.params.id)) ) {
        res.send({success: false, message: 'Invalid Event ID'});
    }
    else {
        var userID  = req.decoded.userID;
        var eventID = req.params.id;
        User.findOne({_id: userID}, function(err, user) {
            if(err) {
                console.log('Error when checking user identity');
                res.send({success: false, message: 'Error when checking user identity'});
            }
            if(!user) {
                res.send({success: false, message: 'Bad request : Unknown user id'});
            }
            else {
                Event.findOne({_id: eventID}, function(err, event) {
                    if(err) {
                    console.log('Error when trying to find event to join: '+err);
                    res.send(err);
                    }
                    if(event) {
                        if(event.isFull()) {
                            res.send({success: false, message: 'Event is full'});
                        }
                        else {
                            var isUserAlreadyIn = false;
                            for (var i = event.userList.length - 1; i >= 0; i--) {
                                if(event.userList[i] === userID) {
                                    isUserAlreadyIn = true;
                                    res.send({success: false, message: 'User already in the event'});
                                }
                            }
                            if(!isUserAlreadyIn) {
                                event.userList.push(userID);
                                Event.update({_id: eventID}, event, function(err) {
                                    if(err) {
                                        console.log('Error when updating the event after user joined: '+err);
                                        res.send({success: false, message: 'Error when updating the event'});
                                    }
                                    res.send({success: true, message: 'Event joined'});
                                });
                            }
                        }
                    }
                    else {
                        res.send({success: false, message: 'No event found'});
                    }
                });
            }
        });
    }
})


// LEAVE Event
//=============================================

.post('/infos/events/:id/leave', function(req, res) {

    // ID Checking

    if( !(Controller.isObjectIDValid(req.decoded.userID)) ) {
        res.send({success: false, message: 'Invalid userID'});
    }
    else if ( !(Controller.isObjectIDValid(req.params.id)) ) {
        res.send({success: false, message: 'Invalid Event ID'});
    }
    else {
        var eventID = req.params.id;
        var userID  = req.decoded.userID;
        Event.findOne({_id: eventID}, function(err, event) {
            if(err) {
                console.log('Error when trying to find the event to leave: '+err);
                res.send(err);
            }
            if(event) {
                var isUserIn = false;
                for (var i = event.userList.length - 1; i >= 0; i--) {
                    if(event.userList[i] === userID) {
                        isUserIn = true;
                        event.userList.pull(userID);
                        Event.update({_id: eventID}, event, function(err) {
                            if(err) {
                                console.log('Error when updating event after user leaving: '+err);
                                res.send(err);
                            }
                            res.send({success: true, message: 'user removed from event'});
                        });
                        
                    }
                }
                if(!isUserIn) {
                    res.send({success: false, message: 'user not found in the event'});
                }
            }
            else {
                res.send({success: false, message: 'Event not found'});
            }
        });
    }

}) 


// POST add upvote/downvote
//==============================================

.post('/infos/:type/:id/:votetype', function(req, res) {
    if( !(Controller.isObjectIDValid(req.params.id)) ||
        !(Controller.isObjectIDValid(req.decoded.userID)) ) {
        
        res.send({success: false, message: 'Invalid ID'});
    }
    else if ( !(Controller.isVoteTypeValid(req.params.votetype)) ) {
        res.send({success: false, message: 'Bad request'});
    }
    else {
        var userID      = req.decoded.userID;
        var infoID      = req.params.id;
        var votetype    = req.params.votetype === 'upvote'?(1):(-1);
        
        if(req.params.type === 'posts') {
            // We search if the post exists
            Post.findOne({_id: infoID}, function(err, post) {
                if(err) {
                    console.log('Error when updating votes');
                    res.send(err);
                }
                if(post) {
                    var vote;
                    var isVoteExist = false;
                    // We search if the user already added a vote
                    for (var i = 0; i < post.votes.length; i++) {
                        vote = post.votes[i];
                        if(vote.userID === userID) {
                            isVoteExist = true;
                            vote.value = votetype;
                            post.updateVoteCount();
                            Post.update({_id: infoID}, post, function(err) {
                                if(err) {
                                    console.log('Error when updating the post: '+err);
                                    res.send({success: false, message: 'Error when updating the post'});
                                }
                                res.send({success: true, message: 'Vote updated !'});
                            }); 
                        }
                        if(isVoteExist) break;
                    } // END FOR
                    // If no vote found, we add a new one
                    if(!isVoteExist) {
                        post.votes.push({userID: userID, value: votetype});
                        post.updateVoteCount();
                        Post.update({_id: infoID}, post, function(err) {
                        if(err) {
                            console.log('Error when updating the post: '+err);
                            res.send({success: true, message: 'Error when updating the post'});
                        }
                        res.send({success: true, message: 'Vote sent !'});
                        });
                    } 
                }
                else {
                    res.send({success: true, message: 'No post found'});
                }
            });
        } // END IF POST
        else if(req.params.type === 'events') {
            // We search if the event exists
            Event.findOne({_id: infoID}, function(err, event) {
                if(err) {
                    console.log('Error when updating votes');
                    res.send(err);
                }
                if(event) {
                    var vote;
                    var isVoteExist = false;
                    // We search if the user already added a vote
                    for (var i = 0; i < event.votes.length; i++) {
                        vote = event.votes[i];
                        if(vote.userID === userID) {
                            isVoteExist = true;
                            vote.value = votetype;
                            event.updateVoteCount();
                            Event.update({_id: infoID}, event, function(err) {
                                if(err) {
                                    console.log('Error when updating the event: '+err);
                                    res.send({success: false, message: 'Error when updating the event'});
                                }
                                res.send({success: false, message: 'Vote updated !'});
                            }); 
                        }
                        if(isVoteExist) break;
                    } // END FOR
                    // If no vote found, we add a new one
                    if(!isVoteExist) {
                        event.votes.push({userID: userID, value: votetype});
                        event.updateVoteCount();
                        Event.update({_id: infoID}, event, function(err) {
                        if(err) {
                            console.log('Error when updating the event: '+err);
                            res.send({success: false, message: 'Error when updating the event'});
                        }
                        res.send({success: true, message: 'Vote sent !'});
                        });
                    } 
                }
                else {
                    res.send({success: false, message: 'No event found'});
                }
            });    
        } // END IF EVENT
        else {
            res.send({success: false, message: 'Bad request'});
        }
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
            res.json(users);
        }
        else {
            res.json({success: false, message: 'No users found'});
        }
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
        res.json({success: false, message: 'Bad request'});
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
        res.json({success: false, message: 'Bad request'});
    }
    
})


// POST update user
//=============================================

.post('/user/update', function(req, res) {
    
    var checkPwd    = false;
    var checkEmail  = false;
    if(Controller.checkBoolean(req.body.isNewPwd) && Controller.isUserPasswordValid(req.decoded.password)) {
        checkPwd = true;
    }
    if( Controller.checkBoolean(req.body.isNewEmail) && Controller.isUserMailValid(req.decoded.mail)) {
        checkEmail = true;
    }
    
    if(checkPwd === false && checkEmail === false) {
        res.send({success: false, message: 'Bad request: nothing to change'});
    }
    else {

        var username            = Controller.sanitizeString(req.decoded.username);
        var newPassword         = req.body.newPassword;
        var newEmail            = Controller.sanitizeString(req.body.newEmail);
        var newIsEmailVisible   = Controller.checkBoolean(req.body.isEmailVisible);

        Promise.props({
            user: User.findOne({username: username}).execAsync()
        })
        .then(function(results) {
            if(results.user != null) {
                if(results.user.mail != null)
                    res.send({success: false, message: 'Email already exists'});
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
                                res.send({success: true, message: 'Successfully updated'});
                            });  
                        });
                    }
                    else {
                        results.user.save(function(err, resp) {
                            if(err) {
                                console.log('Error when trying to update the user: '+user.username);
                                res.send(err);
                            }
                            res.send({success: true, message: 'Successfully updated'});
                        });
                    }
                }

            }
            else 
                res.send({success: false, message: 'User doesn\'t exist'});
        });  
    }
})


// DELETE user
//=============================================

.delete('/user/delete/', function(req, res) {
    if(! (Controller.isObjectIDValid(req.decoded.userID)) ) {
        res.send({success: false, message: 'Invalid ID'});
    }
    else {

        var userID = req.decoded.userID;
        User.findOneAndRemove({_id: userID}, function(err, user) {
            if(err) {
                console.log('Error when deleting user');
                res.send(err);
            }
            if(user){
                res.send({success: true, message: 'User Deleted'});
            }
            else {
                res.send({success: false, message: 'User not found'});
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