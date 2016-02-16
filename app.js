var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mongodb = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
var db;

// Initialize connection once
MongoClient.connect(process.env.MONGO_URI, function(err, database) {
  	if(err) throw err;
  	db = database;
	
	app.set("host", process.env.HOST || "0.0.0.0");
	app.listen(~~(process.env.PORT) || 80, function() {
		console.log("Listening.");
	});
});

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("www"));

var token = function(length) {
	var length = length || 25;
	var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
	var token = "";
	for(var i=0; i<length; i++) {
		var R = Math.floor(Math.random()*chars.length);
		token += chars.substring(R, R+1);
	}
	return token;
};

app.get("/", function(req, res) {
	res.send("Hello");
});
app.post("/createGroup", function(req, res) {
	console.log(req.body);
	/*var found = false, id = token(6);
	while (!found) {
		if (typeof db("organizers").find({ id: id }) == "undefined") {
			found = true;
		} else {
			id = token(6);
		}
	}
	req.body["JoinCode"] = id;
	var password = req.body["Password"];
	db("organizers").push(req.body);
	res.cookie("JoinCode", id);*/
	db.collection("groups").insert({"gid": token(6), "Name": req.body["Name"]}, function(err, doc){
		if(err){
			console.log(err);
		}
	});
	res.send({ success: 1 });
});

app.post("/joinGroup", function(req, res) {
	console.log(req.body);
	var code = req.body["JoinCode"];
	var email = req.body["Email"];
	if(db("organizers").find({"JoinCode": code}) != undefined && db("users").find({"JoinCode": code, "Email": email}) == undefined){
		db("users").push(req.body);
		res.cookie("JoinCode", code);
		res.send({ success: 1 });
	}
	else{
		res.send({ success: 0 });
	}
	
});

app.post("/viewGroup", function(req, res) {
	console.log(req.body);
	var code = req.body["JoinCode"];
	var members = [];
	var org = db("organizers").find({"JoinCode": code});
	if(org != null){
		members.push({
			"Name": org["Name"],
			"Email": org["Email"]
		});
		var _members = db("users").filter({"JoinCode": code});
		if(_members != null){
			console.log(_members);
			for(var i=0; i<_members.length; i++) {
				members.push(_members[i]);
			}
		}
		console.log(members);
		res.send({ success: 1, members: members });
	}
	else{
		res.send({ success: 0});
	}
	
});
