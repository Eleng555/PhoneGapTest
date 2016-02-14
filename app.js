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

app.set("host", process.env.HOST || "0.0.0.0");
app.listen(~~(process.env.PORT) || 80, function() {
	console.log("Listening.");
});