var express = require("express");
var app = express();
var bodyParser = require('body-parser');
const low = require('lowdb')
const storage = require('lowdb/file-sync')
const db = low('db.json', { storage: storage })
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
	var found = false, id = token(6);
	while (!found) {
		if (typeof db("organizers").find({ id: id }) == "undefined") {
			found = true;
		} else {
			id = token(6);
		}
	}
	req.body["JoinCode"] = id;
	db("organizers").push(req.body);
	res.cookie("JoinCode", id);
	res.send({ success: 1 });
});

app.post("/joinGroup", function(req, res) {
	console.log(req.body);
	var code = req.body["JoinCode"];
	if(db("organizers").find({"JoinCode": code}) != null){
		db("users").push(req.body);
		res.send({ success: 1 });
	}
	else{
		res.send({ success: 0});
	}
	
});

app.post("/viewGroup", function(req, res) {
	console.log(req.body);
	var code = req.body["JoinCode"];
	var members = [];
	if(db("organizers").filter({"JoinCode": code}) != null){
		members.push((db("organizers").chain().filter({"JoinCode": code}).map("Name").value()).toString());
		members.push((db("organizers").chain().filter({"JoinCode": code}).map("Email").value()).toString());
		if(db("users").filter({"JoinCode": code}) != null){
			members.push((db("users").chain().filter({"JoinCode": code}).map("Name").value()).toString());
			members.push((db("users").chain().filter({"JoinCode": code}).map("Email").value()).toString());
		}
		console.log(members);
		res.cookie("Members", members);
		res.send({ success: 1 });
	}
	else{
		res.send({ success: 0});
	}
	
});

app.set("host", "0.0.0.0");
app.listen(80, function() {
	console.log("Listening.");
});