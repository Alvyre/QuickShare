// Require Express
var express     = require('express');
var router      = express.Router();
var controller  = require('./controller');

// Export the router
module.exports  = router;

// API Routes
router

    //
    .get('/api/infos/:type', function(req, res) {
        if(req.params.type == 'posts') {
            temp = controller.getAllPosts();
            if(temp === -1)
                res.send('Error when trying to get posts');
            else if(temp === undefined) {
                res.send('No data found');
            }
            else
                res.json(res);
        }  
        else if(req.params.type == 'events') {
            res = controller.getAllEvents();
            if(res === -1)
                res.send('Error when trying to get posts');
            else {
                res.json(res);
            }
        }
        else 
            res.send('error bad \'type\' as request');
    })

// SIGN Up
//======================================================
    .post('/signup', function(req, res) {
        var user = {
            name:       req.params.name,
            password :  req.params.name,
            mail :      req.params.name
        };
        res = controller.signup(user);
        switch(res) {
            case -1: 
                res.send('Error when creating the user');
                break;
            case 'User name exists':
                res.send('The username already exists !');
                break;
            case 'user mail exists':
                res.send('User mail already exists !');
                break;
            case 'Success':
                res.send('Success');
            default:
                res.send('Unknown error :(');
                break;    
        }

    })

// LOG In
//======================================================
    .get('/login', function(req, res) {
        res.setHeader('Content-Type', 'text/plain');
        res.end('Connection STUFF');
    })
    .post('/login', function(req, res) {
        //CHECK if connected
        if(true)
            res.end('Connected !');
    })

// POST
//====================================================== 
    .get('/post/:type', function(req, res) {
        //check quel type d'infos on post et redirection
        res.end('Post Form');
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
    })

// ERRORS
//======================================================   
    .use(function(req, res, next){
        res.setHeader('Content-Type', 'text/plain');
        res.status(404).send('Error 404 : Bad request');
    });