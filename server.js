// set up ======================================================================
var express = require('express');
var app = express(); 						// create our app w/ express
var mongoose = require('mongoose'); 				// mongoose for mongodb
var port = process.env.PORT || 8080; 				// set the port
var database = require('./config/database'); 			// load the database config
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// configuration ===============================================================
mongoose.connect(database.localUrl); 	// Connect to local MongoDB instance. A remoteUrl is also available (modulus.io)

app.use(express.static('./public')); 		// set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request


// define model =================
var Todo = mongoose.model('Todo', {
    text : String
});
app.get('/api/todos', function(req,res){
	//res.json('{text: Texto_1111}')
	//Todo.find({text: {$regex: '.* um'}},function(err, todos){
	Todo.find({text: {$regex: '.*um'}},function(err, todos){
		if(err){
			res.send(err);
		}
		res.json(todos);
	});
});

app.post('/api/todos', function(req,res){
	//res.json('{text: Texto_1111}')
	//Todo.find({text: {$regex: '.* um'}},function(err, todos){
	Todo.create({text: req.body.text},function(err, todos){
		if(err){
			res.send(err);
		}
		res.json(todos);
	});
});

app.get('/api/todos/:todo_id', function(req,res){
	console.log('On server.js: '+req.params.todo_id);
	Todo.find({_id: req.params.todo_id},function(err, todos){
		if(err){
			res.send(err);
		}
		res.json(todos);
	});
});

// routes ======================================================================
//require('./app/routes.js')(app);
module.exports = function(app){

	app.get('*', function(req,res){
		res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
}

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);

