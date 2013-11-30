var fs = require('fs');
var mongo = require('mongodb');

var mongoose = require('mongoose');  

var connectionString = process.env.CUSTOMCONNSTR_MONGOLAB_URI

mongoose.connect(connectionString);
var express = require('express');
var config = JSON.parse(fs.readFileSync('config.json'));
var host = config.host;
var port = config.port;
var dbPort = mongo.Connection.DEFAULT_PORT;
var db = new mongo.Db('jobbies', new mongo.Server(host, dbPort, {}));

var app = express();

var userCollection;


app.get('/', function(req, res){
	var content = fs.readFileSync('user.html');

	getUsers(function(users){
		var ul = '';
		users.forEach(function(user){
			ul += '<li>' + user.name + ':' + user.email + '</li>';
		});
		content = content.toString('utf8').replace('{{USERS}}', ul);
		res.setHeader('Content-Type', 'text/html');
		res.send(content);
	});
});

db.open(function(error){
	db.collection('user', function(error, collection){
		userCollection = collection;
	});
});

function getUsers(callback) {
	var coll = userCollection.find().toArray();
	callback(coll);
};

app.listen(port, host);